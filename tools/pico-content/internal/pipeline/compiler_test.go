package pipeline

import (
	"context"
	"image"
	"image/color"
	"testing"

	"pico-content/internal/schema"
)

type fakeAI struct{}

func (fakeAI) PlanDifferences(_ context.Context, _ schema.StageRequest, _ image.Image) (schema.PlanResult, error) {
	return schema.PlanResult{
		Candidates: []schema.DiffCandidate{
			{
				CandidateID:          "bucket_color",
				ObjectName:           "bucket",
				DiffType:             "color_change",
				VisibilityScore:      1,
				IsolationScore:       1,
				ChildFriendlyScore:   1,
				EditRiskScore:        0.1,
				ChildDifficultyScore: 0.1,
				ApproxBox:            schema.BBox{X: 3, Y: 4, W: 5, H: 5},
				EditInstruction:      "Change only the bucket color.",
			},
			{
				CandidateID:          "towel_pattern",
				ObjectName:           "towel",
				DiffType:             "color_change",
				VisibilityScore:      0.9,
				IsolationScore:       1,
				ChildFriendlyScore:   1,
				EditRiskScore:        0.1,
				ChildDifficultyScore: 0.1,
				ApproxBox:            schema.BBox{X: 12, Y: 4, W: 5, H: 5},
				EditInstruction:      "Change only the towel pattern.",
			},
		},
	}, nil
}

func (fakeAI) EditCandidate(_ context.Context, _ schema.StageRequest, candidate schema.DiffCandidate, crop image.Image, _ *image.Alpha) (image.Image, error) {
	edited := image.NewRGBA(image.Rect(0, 0, crop.Bounds().Dx(), crop.Bounds().Dy()))
	for y := 0; y < edited.Bounds().Dy(); y++ {
		for x := 0; x < edited.Bounds().Dx(); x++ {
			edited.SetRGBA(x, y, color.RGBA{A: 255})
		}
	}
	for y := candidate.ApproxBox.H/2 - 1; y <= candidate.ApproxBox.H/2+1; y++ {
		for x := candidate.ApproxBox.W/2 - 1; x <= candidate.ApproxBox.W/2+1; x++ {
			edited.SetRGBA(x+1, y+1, color.RGBA{R: 240, G: 80, B: 40, A: 255})
		}
	}
	edited.SetRGBA(0, 0, color.RGBA{B: 220, A: 255})
	return edited, nil
}

func (fakeAI) VerifyStage(_ context.Context, request schema.StageRequest, _ image.Image, _ image.Image, components []schema.Component) (schema.VerifierResult, error) {
	differences := make([]schema.VerifierDifference, 0, len(components))
	for _, component := range components {
		differences = append(differences, schema.VerifierDifference{
			CandidateID:     component.AssignedCandidateID,
			Label:           component.AssignedCandidateID,
			ComponentIDs:    []int{component.ComponentID},
			IsChildFriendly: true,
			IsCoveredByBBox: true,
			Confidence:      1,
		})
	}
	return schema.VerifierResult{
		VisibleDifferenceCount: request.TargetDifferenceCount,
		Differences:            differences,
		Confidence:             1,
	}, nil
}

func TestCompilerBuildsRuntimeBBoxesFromPixelDiff(t *testing.T) {
	left := image.NewRGBA(image.Rect(0, 0, 20, 16))
	request := schema.StageRequest{
		StageID:               "spot_test_001",
		TargetDifferenceCount: 2,
		PanelSize:             schema.Size{W: 20, H: 16},
		RightOffsetX:          20,
		PixelDiffThreshold:    10,
		MinComponentArea:      1,
		MinVisibleAreaPerDiff: 1,
		MinBBoxWidth:          1,
		MinBBoxHeight:         1,
		HitPadding:            0,
		MaskPadding:           1,
	}

	result, err := Compiler{AI: fakeAI{}}.Compile(context.Background(), request, left)
	if err != nil {
		t.Fatal(err)
	}
	if len(result.RuntimeStage.Differences) != 2 {
		t.Fatalf("runtime differences = %d, want 2", len(result.RuntimeStage.Differences))
	}
	for _, diff := range result.RuntimeStage.Differences {
		if diff.BBox.X < request.RightOffsetX {
			t.Fatalf("bbox should be in combined right-panel coordinates: %+v", diff.BBox)
		}
	}
	if got := result.RightPanel.RGBAAt(2, 3); got.B == 220 {
		t.Fatalf("leaked pixel outside mask was not clamped: %#v", got)
	}
}
