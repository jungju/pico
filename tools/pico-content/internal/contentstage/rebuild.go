package contentstage

import (
	"fmt"
	"image"
	"image/color"

	"pico-content/internal/imageops"
	"pico-content/internal/schema"
)

type PatchSpec struct {
	DifferenceID string `json:"differenceId"`
	BBox         BBox   `json:"bbox"`
}

type RebuildOptions struct {
	MaskThreshold uint32
	CloseRadius   int
	DilateRadius  int
	BBoxPadding   int
	FullRectMask  bool
}

type RebuildReport struct {
	StageID       string        `json:"stageId"`
	MaskThreshold uint32        `json:"maskThreshold"`
	CloseRadius   int           `json:"closeRadius"`
	DilateRadius  int           `json:"dilateRadius"`
	BBoxPadding   int           `json:"bboxPadding"`
	FullRectMask  bool          `json:"fullRectMask"`
	Patches       []PatchResult `json:"patches"`
	Warnings      []string      `json:"warnings,omitempty"`
}

type PatchResult struct {
	DifferenceID string `json:"differenceId"`
	SourceBBox   BBox   `json:"sourceBbox"`
	GeneratedBox BBox   `json:"generatedBbox"`
	ChangedArea  int    `json:"changedAreaPx"`
}

func RebuildFromPatches(stage Stage, source image.Image, patches []PatchSpec, opts RebuildOptions) (Stage, *image.RGBA, RebuildReport, error) {
	opts = opts.withDefaults()
	if err := validateStage(stage); err != nil {
		return stage, nil, RebuildReport{}, err
	}
	if len(patches) == 0 {
		return stage, nil, RebuildReport{}, fmt.Errorf("at least one patch is required")
	}

	leftPanel, err := imageops.Crop(source, panelBBox(stage.Panels.Left))
	if err != nil {
		return stage, nil, RebuildReport{}, fmt.Errorf("crop left panel: %w", err)
	}
	sourceRight, err := imageops.Crop(source, panelBBox(stage.Panels.Right))
	if err != nil {
		return stage, nil, RebuildReport{}, fmt.Errorf("crop right panel: %w", err)
	}
	rightPanel := imageops.Clone(leftPanel)
	panelSize := schema.Size{W: stage.Panels.Right.Width, H: stage.Panels.Right.Height}

	report := RebuildReport{
		StageID:       stage.ID,
		MaskThreshold: opts.MaskThreshold,
		CloseRadius:   opts.CloseRadius,
		DilateRadius:  opts.DilateRadius,
		BBoxPadding:   opts.BBoxPadding,
		FullRectMask:  opts.FullRectMask,
	}

	for _, patch := range patches {
		index := differenceIndex(stage, patch.DifferenceID)
		if index < 0 {
			return stage, nil, report, fmt.Errorf("unknown difference id %q", patch.DifferenceID)
		}
		localBox := toLocalBBox(patch.BBox, stage.Panels.Right).Clamp(panelSize)
		if localBox.Empty() {
			return stage, nil, report, fmt.Errorf("patch %s is outside right panel", patch.DifferenceID)
		}
		leftCrop, err := imageops.Crop(leftPanel, localBox)
		if err != nil {
			return stage, nil, report, fmt.Errorf("crop left patch %s: %w", patch.DifferenceID, err)
		}
		rightCrop, err := imageops.Crop(sourceRight, localBox)
		if err != nil {
			return stage, nil, report, fmt.Errorf("crop source patch %s: %w", patch.DifferenceID, err)
		}
		mask, err := buildPatchMask(leftCrop, rightCrop, opts)
		if err != nil {
			return stage, nil, report, fmt.Errorf("mask patch %s: %w", patch.DifferenceID, err)
		}
		maskBox := imageops.MaskBBox(mask)
		if maskBox.Empty() {
			report.Warnings = append(report.Warnings, fmt.Sprintf("patch %s produced an empty diff mask", patch.DifferenceID))
			continue
		}
		clamped, err := imageops.ClampEditedCrop(leftCrop, rightCrop, mask, 0)
		if err != nil {
			return stage, nil, report, fmt.Errorf("clamp patch %s: %w", patch.DifferenceID, err)
		}
		if err := imageops.Composite(rightPanel, clamped, image.Pt(localBox.X, localBox.Y)); err != nil {
			return stage, nil, report, fmt.Errorf("composite patch %s: %w", patch.DifferenceID, err)
		}

		generatedLocal := maskBox.Shift(localBox.X, localBox.Y).Expand(opts.BBoxPadding, panelSize)
		generatedFull := generatedLocal.Shift(stage.Panels.Right.X, stage.Panels.Right.Y)
		stage.Differences[index].BBox = fromSchemaBBox(generatedFull)
		report.Patches = append(report.Patches, PatchResult{
			DifferenceID: patch.DifferenceID,
			SourceBBox:   patch.BBox,
			GeneratedBox: stage.Differences[index].BBox,
			ChangedArea:  maskArea(mask),
		})
	}

	combined := imageops.Clone(source)
	if err := imageops.Composite(combined, leftPanel, image.Pt(stage.Panels.Left.X, stage.Panels.Left.Y)); err != nil {
		return stage, nil, report, err
	}
	if err := imageops.Composite(combined, rightPanel, image.Pt(stage.Panels.Right.X, stage.Panels.Right.Y)); err != nil {
		return stage, nil, report, err
	}
	return stage, combined, report, nil
}

func (opts RebuildOptions) withDefaults() RebuildOptions {
	if opts.MaskThreshold == 0 {
		opts.MaskThreshold = 80
	}
	if opts.BBoxPadding == 0 {
		opts.BBoxPadding = 10
	}
	return opts
}

func differenceIndex(stage Stage, differenceID string) int {
	for index, difference := range stage.Differences {
		if difference.ID == differenceID {
			return index
		}
	}
	return -1
}

func buildPatchMask(leftCrop image.Image, rightCrop image.Image, opts RebuildOptions) (*image.Alpha, error) {
	if opts.FullRectMask {
		bounds := leftCrop.Bounds()
		mask := image.NewAlpha(image.Rect(0, 0, bounds.Dx(), bounds.Dy()))
		for y := 0; y < bounds.Dy(); y++ {
			for x := 0; x < bounds.Dx(); x++ {
				mask.SetAlpha(x, y, color.Alpha{A: 255})
			}
		}
		return mask, nil
	}
	mask, err := imageops.DiffMask(leftCrop, rightCrop, opts.MaskThreshold)
	if err != nil {
		return nil, err
	}
	if opts.CloseRadius > 0 {
		mask = imageops.Close(mask, opts.CloseRadius)
	}
	if opts.DilateRadius > 0 {
		mask = imageops.Dilate(mask, opts.DilateRadius)
	}
	return mask, nil
}

func maskArea(mask *image.Alpha) int {
	if mask == nil {
		return 0
	}
	bounds := mask.Bounds()
	area := 0
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			if mask.AlphaAt(x, y) != (color.Alpha{}) {
				area++
			}
		}
	}
	return area
}
