package imageops

import (
	"image"
	"image/color"
	"testing"

	"pico-content/internal/schema"
)

func TestClampEditedCropRestoresPixelsOutsideMask(t *testing.T) {
	original := image.NewRGBA(image.Rect(0, 0, 4, 4))
	edited := image.NewRGBA(image.Rect(0, 0, 4, 4))
	for y := 0; y < 4; y++ {
		for x := 0; x < 4; x++ {
			original.SetRGBA(x, y, color.RGBA{R: 10, G: 20, B: 30, A: 255})
			edited.SetRGBA(x, y, color.RGBA{R: 200, G: 80, B: 90, A: 255})
		}
	}
	mask := MaskFromBox(schema.Size{W: 4, H: 4}, schema.BBox{X: 1, Y: 1, W: 2, H: 2})

	clamped, err := ClampEditedCrop(original, edited, mask, 0)
	if err != nil {
		t.Fatal(err)
	}

	if got := clamped.RGBAAt(0, 0); got != (color.RGBA{R: 10, G: 20, B: 30, A: 255}) {
		t.Fatalf("outside mask = %#v, want original color", got)
	}
	if got := clamped.RGBAAt(1, 1); got != (color.RGBA{R: 200, G: 80, B: 90, A: 255}) {
		t.Fatalf("inside mask = %#v, want edited color", got)
	}
}

func TestDiffComponentsAndRuntimeBBoxes(t *testing.T) {
	left := image.NewRGBA(image.Rect(0, 0, 10, 10))
	right := image.NewRGBA(image.Rect(0, 0, 10, 10))
	for y := 2; y < 5; y++ {
		for x := 3; x < 7; x++ {
			right.SetRGBA(x, y, color.RGBA{R: 255, A: 255})
		}
	}

	components, _, err := DiffComponents(left, right, DiffOptions{
		Threshold: 1,
		MinArea:   1,
	})
	if err != nil {
		t.Fatal(err)
	}
	if len(components) != 1 {
		t.Fatalf("component count = %d, want 1", len(components))
	}
	if got := components[0].BBox; got != (schema.BBox{X: 3, Y: 2, W: 4, H: 3}) {
		t.Fatalf("bbox = %+v", got)
	}

	runtime := BBoxesFromComponents(components, 10, 1, schema.Size{W: 10, H: 10})
	if got := runtime[0]; got != (schema.RuntimeBBox{X: 12, Y: 1, W: 6, H: 5}) {
		t.Fatalf("runtime bbox = %+v", got)
	}
}
