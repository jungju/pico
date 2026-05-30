package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"os"
	"path/filepath"

	"pico-content/internal/imageops"
	"pico-content/internal/pipeline"
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
  pico-content analyze-diff --left left.png --right right.png --out components.json [--threshold 36] [--min-area 300]`)
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
