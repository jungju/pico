package contentstage

import (
	"image"
	"image/color"
	"testing"
)

func TestAnalyzeUpdatesBBoxesFromPixelComponents(t *testing.T) {
	img := image.NewRGBA(image.Rect(0, 0, 20, 10))
	for y := 4; y < 7; y++ {
		for x := 13; x < 17; x++ {
			img.SetRGBA(x, y, color.RGBA{R: 255, A: 255})
		}
	}
	stage := Stage{
		ID:               "spot_test",
		ImageWidth:       20,
		ImageHeight:      10,
		TotalDifferences: 1,
		Panels: Panels{
			Left:  Panel{X: 0, Y: 0, Width: 10, Height: 10},
			Right: Panel{X: 10, Y: 0, Width: 10, Height: 10},
		},
		Differences: []Difference{
			{
				ID:         "shell",
				Label:      "shell",
				TargetSide: "right",
				BBox:       BBox{X: 12, Y: 3, Width: 6, Height: 6},
			},
		},
	}

	updated, report, err := Analyze(stage, "test.png", img, AnalyzeOptions{
		Threshold:         1,
		MinArea:           1,
		AssignmentPadding: 1,
		BBoxPadding:       1,
	})
	if err != nil {
		t.Fatal(err)
	}
	if report.RawComponentCount != 1 {
		t.Fatalf("raw component count = %d, want 1", report.RawComponentCount)
	}
	got := updated.Differences[0].BBox
	want := BBox{X: 12, Y: 3, Width: 6, Height: 5}
	if got != want {
		t.Fatalf("bbox = %+v, want %+v", got, want)
	}
}
