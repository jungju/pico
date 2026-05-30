package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"pico-content/internal/contentstage"
	"pico-content/internal/generator"
	"pico-content/internal/imageops"
	openaiapi "pico-content/internal/openai"
	"pico-content/internal/pipeline"
	"pico-content/internal/schema"
)

func main() {
	if len(os.Args) < 2 {
		usage()
		os.Exit(2)
	}

	var err error
	switch os.Args[1] {
	case "describe":
		err = describe()
	case "analyze-diff":
		err = analyzeDiff(os.Args[2:])
	case "analyze-stage":
		err = analyzeStage(os.Args[2:])
	case "rebuild-stage":
		err = rebuildStage(os.Args[2:])
	case "generate-stage":
		err = generateStage(os.Args[2:])
	default:
		usage()
		err = fmt.Errorf("unknown command %q", os.Args[1])
	}

	if err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
}

func usage() {
	fmt.Fprintln(os.Stderr, `Usage:
  pico-content describe
  pico-content generate-stage --stage-id spot_toy_room_021 --prompt "a cozy toy room with large isolated toys" --out ../../contents
  pico-content analyze-diff --left left.png --right right.png --out components.json [--threshold 36] [--min-area 300]
  pico-content analyze-stage --stage contents/spot_beach_day_001.json --image contents/spot_beach_day_001.jpg --out report.json [--apply]
  pico-content rebuild-stage --stage contents/spot_beach_day_001.json --image contents/spot_beach_day_001.jpg --out-image rebuilt.jpg --patch difference_id=x,y,w,h [--apply]`)
}

func describe() error {
	for i, state := range pipeline.OrderedStates {
		fmt.Printf("%02d %s\n", i+1, state)
	}
	return nil
}

func analyzeDiff(args []string) error {
	fs := flag.NewFlagSet("analyze-diff", flag.ContinueOnError)
	leftPath := fs.String("left", "", "left panel image path")
	rightPath := fs.String("right", "", "right panel image path")
	outPath := fs.String("out", "", "JSON output path")
	threshold := fs.Uint("threshold", 36, "RGB sum delta threshold")
	minArea := fs.Int("min-area", 300, "minimum connected component area")
	closeRadius := fs.Int("close-radius", 1, "morphological close radius")
	if err := fs.Parse(args); err != nil {
		return err
	}
	if *leftPath == "" || *rightPath == "" {
		return fmt.Errorf("--left and --right are required")
	}

	left, err := loadImage(*leftPath)
	if err != nil {
		return fmt.Errorf("load left image: %w", err)
	}
	right, err := loadImage(*rightPath)
	if err != nil {
		return fmt.Errorf("load right image: %w", err)
	}

	components, _, err := imageops.DiffComponents(left, right, imageops.DiffOptions{
		Threshold:   uint32(*threshold),
		MinArea:     *minArea,
		CloseRadius: *closeRadius,
	})
	if err != nil {
		return err
	}

	payload := map[string]any{
		"left":       *leftPath,
		"right":      *rightPath,
		"threshold":  *threshold,
		"minArea":    *minArea,
		"components": components,
	}
	data, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		return err
	}
	data = append(data, '\n')

	if *outPath == "" || *outPath == "-" {
		_, err = os.Stdout.Write(data)
		return err
	}
	if dir := filepath.Dir(*outPath); dir != "." && dir != "" {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return err
		}
	}
	return os.WriteFile(*outPath, data, 0o644)
}

func analyzeStage(args []string) error {
	fs := flag.NewFlagSet("analyze-stage", flag.ContinueOnError)
	stagePath := fs.String("stage", "", "content stage JSON path")
	imagePath := fs.String("image", "", "combined stage image path")
	outPath := fs.String("out", "", "analysis JSON output path")
	apply := fs.Bool("apply", false, "write generated bboxes back to the stage JSON")
	threshold := fs.Uint("threshold", 44, "RGB sum delta threshold")
	minArea := fs.Int("min-area", 180, "minimum connected component area")
	closeRadius := fs.Int("close-radius", 1, "morphological close radius")
	assignmentPadding := fs.Int("assignment-padding", 180, "pixels to expand existing bboxes when assigning components")
	bboxPadding := fs.Int("bbox-padding", 8, "pixels to pad generated visible bboxes")
	if err := fs.Parse(args); err != nil {
		return err
	}
	if *stagePath == "" || *imagePath == "" {
		return fmt.Errorf("--stage and --image are required")
	}

	stage, err := contentstage.Load(*stagePath)
	if err != nil {
		return fmt.Errorf("load stage: %w", err)
	}
	img, err := loadImage(*imagePath)
	if err != nil {
		return fmt.Errorf("load image: %w", err)
	}

	updated, report, err := contentstage.Analyze(stage, *imagePath, img, contentstage.AnalyzeOptions{
		Threshold:         uint32(*threshold),
		MinArea:           *minArea,
		CloseRadius:       *closeRadius,
		AssignmentPadding: *assignmentPadding,
		BBoxPadding:       *bboxPadding,
	})
	if err != nil {
		return err
	}
	if *apply {
		report.Applied = true
		if err := contentstage.Save(*stagePath, updated); err != nil {
			return fmt.Errorf("save stage: %w", err)
		}
	}
	return writeJSON(*outPath, report)
}

func rebuildStage(args []string) error {
	fs := flag.NewFlagSet("rebuild-stage", flag.ContinueOnError)
	stagePath := fs.String("stage", "", "content stage JSON path")
	imagePath := fs.String("image", "", "source combined stage image path")
	outImagePath := fs.String("out-image", "", "rebuilt combined image output path")
	outReportPath := fs.String("out-report", "", "rebuild report JSON output path")
	apply := fs.Bool("apply", false, "overwrite source image and stage JSON")
	maskThreshold := fs.Uint("mask-threshold", 80, "RGB sum delta threshold for patch masks")
	closeRadius := fs.Int("close-radius", 1, "morphological close radius for patch masks")
	dilateRadius := fs.Int("dilate-radius", 1, "dilation radius for patch masks")
	bboxPadding := fs.Int("bbox-padding", 10, "pixels to pad generated bboxes")
	fullRect := fs.Bool("full-rect", false, "copy the full patch rectangle instead of a thresholded mask")
	jpegQuality := fs.Int("jpeg-quality", 95, "JPEG quality for rebuilt .jpg output")
	var patchFlags stringList
	fs.Var(&patchFlags, "patch", "patch in the form difference_id=x,y,width,height; repeat for each difference")
	if err := fs.Parse(args); err != nil {
		return err
	}
	if *stagePath == "" || *imagePath == "" {
		return fmt.Errorf("--stage and --image are required")
	}
	if !*apply && *outImagePath == "" {
		return fmt.Errorf("--out-image is required unless --apply is set")
	}
	patches, err := parsePatchFlags(patchFlags)
	if err != nil {
		return err
	}

	stage, err := contentstage.Load(*stagePath)
	if err != nil {
		return fmt.Errorf("load stage: %w", err)
	}
	img, err := loadImage(*imagePath)
	if err != nil {
		return fmt.Errorf("load image: %w", err)
	}
	updated, rebuilt, report, err := contentstage.RebuildFromPatches(stage, img, patches, contentstage.RebuildOptions{
		MaskThreshold: uint32(*maskThreshold),
		CloseRadius:   *closeRadius,
		DilateRadius:  *dilateRadius,
		BBoxPadding:   *bboxPadding,
		FullRectMask:  *fullRect,
	})
	if err != nil {
		return err
	}

	targetImagePath := *outImagePath
	if *apply {
		targetImagePath = *imagePath
	}
	if err := saveImage(targetImagePath, rebuilt, *jpegQuality); err != nil {
		return fmt.Errorf("save rebuilt image: %w", err)
	}
	if *apply {
		if err := contentstage.Save(*stagePath, updated); err != nil {
			return fmt.Errorf("save stage: %w", err)
		}
	}
	return writeJSON(*outReportPath, report)
}

func generateStage(args []string) error {
	fs := flag.NewFlagSet("generate-stage", flag.ContinueOnError)
	stageID := fs.String("stage-id", "", "stage id, for example spot_toy_room_021")
	prompt := fs.String("prompt", "", "source image generation prompt")
	title := fs.String("title", "", "English stage title")
	titleKo := fs.String("title-ko", "", "Korean stage title")
	theme := fs.String("theme", "", "stage theme")
	level := fs.Int("level", 2, "stage level")
	count := fs.Int("count", 6, "target difference count")
	panelSizeRaw := fs.String("panel-size", "1024x1024", "single panel size")
	outDir := fs.String("out", "../../contents", "content output directory")
	artifactDir := fs.String("artifacts", "", "artifact output directory")
	reportPath := fs.String("report", "", "summary report output path")
	dryRun := fs.Bool("dry-run", false, "print prompts and planned metadata without calling OpenAI")
	timeout := fs.Duration("timeout", 10*time.Minute, "generation timeout")
	jpegQuality := fs.Int("jpeg-quality", 95, "JPEG quality")
	if err := fs.Parse(args); err != nil {
		return err
	}

	panelSize, err := parseSize(*panelSizeRaw)
	if err != nil {
		return err
	}
	request := generator.Request{
		StageID:   *stageID,
		Prompt:    *prompt,
		Title:     *title,
		TitleKo:   *titleKo,
		Theme:     *theme,
		Level:     *level,
		Count:     *count,
		PanelSize: panelSize,
	}

	if *dryRun {
		result := generator.DryRun(request)
		return writeJSON(*reportPath, result)
	}

	loadDotEnv(".env")
	ctx, cancel := context.WithTimeout(context.Background(), *timeout)
	defer cancel()

	ai := openaiapi.NewHTTPClientFromEnv()
	result, err := generator.Compiler{AI: ai}.Generate(ctx, request)
	if err != nil {
		return err
	}
	targetArtifactDir := *artifactDir
	if targetArtifactDir == "" {
		targetArtifactDir = filepath.Join("artifacts", request.StageID)
	}
	exportReport, err := generator.Export(result, generator.ExportOptions{
		OutputDir:   *outDir,
		ArtifactDir: targetArtifactDir,
		JPEGQuality: *jpegQuality,
	})
	if err != nil {
		return err
	}
	return writeJSON(*reportPath, exportReport)
}

func writeJSON(outPath string, payload any) error {
	data, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		return err
	}
	data = append(data, '\n')
	if outPath == "" || outPath == "-" {
		_, err = os.Stdout.Write(data)
		return err
	}
	if dir := filepath.Dir(outPath); dir != "." && dir != "" {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return err
		}
	}
	return os.WriteFile(outPath, data, 0o644)
}

func saveImage(path string, img image.Image, jpegQuality int) error {
	if dir := filepath.Dir(path); dir != "." && dir != "" {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return err
		}
	}
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()

	switch strings.ToLower(filepath.Ext(path)) {
	case ".jpg", ".jpeg":
		if jpegQuality < 1 || jpegQuality > 100 {
			jpegQuality = 95
		}
		return jpeg.Encode(file, img, &jpeg.Options{Quality: jpegQuality})
	case ".png":
		return png.Encode(file, img)
	default:
		return fmt.Errorf("unsupported image extension %q", filepath.Ext(path))
	}
}

type stringList []string

func (list *stringList) String() string {
	return strings.Join(*list, ",")
}

func (list *stringList) Set(value string) error {
	*list = append(*list, value)
	return nil
}

func parsePatchFlags(values []string) ([]contentstage.PatchSpec, error) {
	if len(values) == 0 {
		return nil, fmt.Errorf("at least one --patch is required")
	}
	patches := make([]contentstage.PatchSpec, 0, len(values))
	for _, value := range values {
		id, rawBox, ok := strings.Cut(value, "=")
		if !ok {
			return nil, fmt.Errorf("patch %q must use difference_id=x,y,width,height", value)
		}
		parts := strings.Split(rawBox, ",")
		if len(parts) != 4 {
			return nil, fmt.Errorf("patch %q must have four bbox numbers", value)
		}
		nums := [4]int{}
		for index, part := range parts {
			parsed, err := strconv.Atoi(strings.TrimSpace(part))
			if err != nil {
				return nil, fmt.Errorf("patch %q has invalid number %q", value, part)
			}
			nums[index] = parsed
		}
		if strings.TrimSpace(id) == "" || nums[2] <= 0 || nums[3] <= 0 {
			return nil, fmt.Errorf("patch %q has invalid id or size", value)
		}
		patches = append(patches, contentstage.PatchSpec{
			DifferenceID: strings.TrimSpace(id),
			BBox: contentstage.BBox{
				X:      nums[0],
				Y:      nums[1],
				Width:  nums[2],
				Height: nums[3],
			},
		})
	}
	return patches, nil
}

func parseSize(value string) (schema.Size, error) {
	widthRaw, heightRaw, ok := strings.Cut(strings.ToLower(strings.TrimSpace(value)), "x")
	if !ok {
		return schema.Size{}, fmt.Errorf("size %q must use WIDTHxHEIGHT", value)
	}
	width, err := strconv.Atoi(widthRaw)
	if err != nil {
		return schema.Size{}, fmt.Errorf("invalid width %q", widthRaw)
	}
	height, err := strconv.Atoi(heightRaw)
	if err != nil {
		return schema.Size{}, fmt.Errorf("invalid height %q", heightRaw)
	}
	if width <= 0 || height <= 0 {
		return schema.Size{}, fmt.Errorf("size must be positive")
	}
	return schema.Size{W: width, H: height}, nil
}

func loadDotEnv(path string) {
	data, err := os.ReadFile(path)
	if err != nil {
		return
	}
	for _, line := range strings.Split(string(data), "\n") {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.Trim(strings.TrimSpace(value), `"'`)
		if key == "" || os.Getenv(key) != "" {
			continue
		}
		_ = os.Setenv(key, value)
	}
}

func loadImage(path string) (image.Image, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	img, _, err := image.Decode(file)
	if err != nil {
		return nil, err
	}
	return img, nil
}
