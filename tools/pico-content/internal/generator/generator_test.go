package generator

import (
	"context"
	"image"
	"image/color"
	"strings"
	"testing"

	"pico-content/internal/schema"
)

type fakeClient struct {
	size schema.Size
}

func (f fakeClient) GenerateImage(_ context.Context, _ string, size schema.Size) (image.Image, error) {
	img := image.NewRGBA(image.Rect(0, 0, size.W, size.H))
	for y := 0; y < size.H; y++ {
		for x := 0; x < size.W; x++ {
			img.SetRGBA(x, y, color.RGBA{R: 230, G: 240, B: 250, A: 255})
		}
	}
	return img, nil
}

func (f fakeClient) PlanDifferences(_ context.Context, _ string, _ image.Image, _ int) ([]schema.DiffCandidate, error) {
	return []schema.DiffCandidate{
		{
			CandidateID:          "red_ball",
			ObjectName:           "ball",
			DiffType:             "color_change",
			VisibilityScore:      1,
			IsolationScore:       1,
			ChildFriendlyScore:   1,
			EditRiskScore:        0.1,
			ChildDifficultyScore: 0.1,
			ApproxBox:            schema.BBox{X: 8, Y: 8, W: 10, H: 10},
			EditInstruction:      "Change the ball to red.",
		},
		{
			CandidateID:          "blue_box",
			ObjectName:           "box",
			DiffType:             "color_change",
			VisibilityScore:      0.9,
			IsolationScore:       1,
			ChildFriendlyScore:   1,
			EditRiskScore:        0.1,
			ChildDifficultyScore: 0.1,
			ApproxBox:            schema.BBox{X: 30, Y: 8, W: 10, H: 10},
			EditInstruction:      "Change the box to blue.",
		},
	}, nil
}

func (f fakeClient) EditImage(_ context.Context, prompt string, currentRight image.Image, mask *image.Alpha, _ schema.Size) (image.Image, error) {
	edited := image.NewRGBA(currentRight.Bounds())
	for y := 0; y < edited.Bounds().Dy(); y++ {
		for x := 0; x < edited.Bounds().Dx(); x++ {
			edited.Set(x, y, currentRight.At(x, y))
		}
	}
	fill := color.RGBA{R: 255, A: 255}
	if containsText(prompt, "blue") {
		fill = color.RGBA{B: 255, A: 255}
	}
	bounds := mask.Bounds()
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			if mask.AlphaAt(x, y).A > 0 {
				edited.SetRGBA(x, y, fill)
			}
		}
	}
	return edited, nil
}

func (f fakeClient) VerifyStage(_ context.Context, _ string, _ image.Image, _ image.Image, components []schema.Component) (schema.VerifierResult, error) {
	diffs := make([]schema.VerifierDifference, 0, len(components))
	for _, component := range components {
		diffs = append(diffs, schema.VerifierDifference{
			CandidateID:     component.AssignedCandidateID,
			Label:           component.AssignedCandidateID,
			ComponentIDs:    []int{component.ComponentID},
			IsChildFriendly: true,
			IsCoveredByBBox: true,
			Confidence:      1,
		})
	}
	return schema.VerifierResult{
		VisibleDifferenceCount: len(components),
		Differences:            diffs,
		Confidence:             1,
	}, nil
}

func TestGenerateBuildsCombinedStageFromPrompt(t *testing.T) {
	result, err := Compiler{AI: fakeClient{}}.Generate(context.Background(), Request{
		StageID:     "spot_toy_room_999",
		Prompt:      "a toy room with large isolated toys",
		Count:       2,
		PanelSize:   schema.Size{W: 48, H: 32},
		MinArea:     1,
		Threshold:   10,
		MaskPadding: 1,
		BBoxPadding: 1,
		HitPadding:  4,
	})
	if err != nil {
		t.Fatal(err)
	}
	if result.Combined.Bounds().Dx() != 96 || result.Combined.Bounds().Dy() != 32 {
		t.Fatalf("combined bounds = %v", result.Combined.Bounds())
	}
	if len(result.Stage.Differences) != 2 {
		t.Fatalf("differences = %d, want 2", len(result.Stage.Differences))
	}
	for _, difference := range result.Stage.Differences {
		if difference.BBox.X < 48 {
			t.Fatalf("bbox should be in right-panel combined coordinates: %+v", difference.BBox)
		}
	}
}

func TestDryRunBuildsPrompts(t *testing.T) {
	result := DryRun(Request{
		StageID: "spot_garden_123",
		Prompt:  "a garden with large friendly objects",
	})
	if result.BasePrompt == "" || len(result.EditPrompts) == 0 {
		t.Fatalf("dry run should include prompts: %+v", result)
	}
	if result.Stage.ImageWidth != 2048 {
		t.Fatalf("stage image width = %d, want default combined width", result.Stage.ImageWidth)
	}
}

func containsText(value, needle string) bool {
	return strings.Contains(value, needle)
}
