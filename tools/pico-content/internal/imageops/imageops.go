package imageops

import (
	"fmt"
	"image"
	"image/color"
	"image/draw"

	"pico-content/internal/schema"
)

type DiffOptions struct {
	Threshold   uint32
	MinArea     int
	CloseRadius int
}

func ToRGBA(src image.Image) *image.RGBA {
	if rgba, ok := src.(*image.RGBA); ok {
		return rgba
	}
	bounds := src.Bounds()
	dst := image.NewRGBA(image.Rect(0, 0, bounds.Dx(), bounds.Dy()))
	draw.Draw(dst, dst.Bounds(), src, bounds.Min, draw.Src)
	return dst
}

func Clone(src image.Image) *image.RGBA {
	rgba := ToRGBA(src)
	dst := image.NewRGBA(rgba.Bounds())
	draw.Draw(dst, dst.Bounds(), rgba, rgba.Bounds().Min, draw.Src)
	return dst
}

func Crop(src image.Image, box schema.BBox) (*image.RGBA, error) {
	rgba := ToRGBA(src)
	bounds := rgba.Bounds()
	clamped := box.Clamp(schema.Size{W: bounds.Dx(), H: bounds.Dy()})
	if clamped.Empty() {
		return nil, fmt.Errorf("crop bbox is outside image bounds: %+v", box)
	}
	dst := image.NewRGBA(image.Rect(0, 0, clamped.W, clamped.H))
	draw.Draw(dst, dst.Bounds(), rgba, image.Pt(clamped.X, clamped.Y), draw.Src)
	return dst, nil
}

func Composite(dst *image.RGBA, patch image.Image, at image.Point) error {
	patchBounds := patch.Bounds()
	target := image.Rect(at.X, at.Y, at.X+patchBounds.Dx(), at.Y+patchBounds.Dy())
	if !target.In(dst.Bounds()) {
		return fmt.Errorf("patch target %v exceeds destination bounds %v", target, dst.Bounds())
	}
	draw.Draw(dst, target, patch, patchBounds.Min, draw.Src)
	return nil
}

func MaskFromBox(size schema.Size, box schema.BBox) *image.Alpha {
	mask := image.NewAlpha(image.Rect(0, 0, size.W, size.H))
	clamped := box.Clamp(size)
	for y := clamped.Y; y < clamped.Bottom(); y++ {
		for x := clamped.X; x < clamped.Right(); x++ {
			mask.SetAlpha(x, y, color.Alpha{A: 255})
		}
	}
	return mask
}

func MaskUnion(base, add *image.Alpha) *image.Alpha {
	if base == nil {
		return cloneAlpha(add)
	}
	if add == nil {
		return cloneAlpha(base)
	}
	out := cloneAlpha(base)
	bounds := out.Bounds()
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			if add.AlphaAt(x, y).A > out.AlphaAt(x, y).A {
				out.SetAlpha(x, y, add.AlphaAt(x, y))
			}
		}
	}
	return out
}

func ClampEditedCrop(original image.Image, edited image.Image, mask *image.Alpha, threshold uint8) (*image.RGBA, error) {
	originalRGBA := ToRGBA(original)
	editedRGBA := ToRGBA(edited)
	if originalRGBA.Bounds().Dx() != editedRGBA.Bounds().Dx() || originalRGBA.Bounds().Dy() != editedRGBA.Bounds().Dy() {
		return nil, fmt.Errorf("original and edited crop sizes differ")
	}
	if mask == nil {
		return nil, fmt.Errorf("mask is required")
	}
	if mask.Bounds().Dx() != originalRGBA.Bounds().Dx() || mask.Bounds().Dy() != originalRGBA.Bounds().Dy() {
		return nil, fmt.Errorf("mask and crop sizes differ")
	}

	out := image.NewRGBA(originalRGBA.Bounds())
	bounds := out.Bounds()
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			if mask.AlphaAt(x, y).A > threshold {
				out.SetRGBA(x, y, editedRGBA.RGBAAt(x, y))
				continue
			}
			out.SetRGBA(x, y, originalRGBA.RGBAAt(x, y))
		}
	}
	return out, nil
}

func DiffMask(left image.Image, right image.Image, threshold uint32) (*image.Alpha, error) {
	leftRGBA := ToRGBA(left)
	rightRGBA := ToRGBA(right)
	if leftRGBA.Bounds().Dx() != rightRGBA.Bounds().Dx() || leftRGBA.Bounds().Dy() != rightRGBA.Bounds().Dy() {
		return nil, fmt.Errorf("image sizes differ: left=%v right=%v", leftRGBA.Bounds(), rightRGBA.Bounds())
	}
	out := image.NewAlpha(leftRGBA.Bounds())
	bounds := leftRGBA.Bounds()
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			l := leftRGBA.RGBAAt(x, y)
			r := rightRGBA.RGBAAt(x, y)
			if rgbDelta(l, r) > threshold {
				out.SetAlpha(x, y, color.Alpha{A: 255})
			}
		}
	}
	return out, nil
}

func DiffComponents(left image.Image, right image.Image, opts DiffOptions) ([]schema.Component, *image.Alpha, error) {
	mask, err := DiffMask(left, right, opts.Threshold)
	if err != nil {
		return nil, nil, err
	}
	if opts.CloseRadius > 0 {
		mask = Close(mask, opts.CloseRadius)
	}
	components := Components(mask, opts.MinArea)
	return components, mask, nil
}

func Components(mask *image.Alpha, minArea int) []schema.Component {
	if mask == nil {
		return nil
	}
	bounds := mask.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()
	visited := make([]bool, width*height)
	components := []schema.Component{}
	nextID := 1

	index := func(x, y int) int {
		return (y-bounds.Min.Y)*width + (x - bounds.Min.X)
	}

	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			if visited[index(x, y)] || mask.AlphaAt(x, y).A == 0 {
				continue
			}
			component := floodComponent(mask, visited, index, x, y)
			if component.AreaPx < minArea {
				continue
			}
			component.ComponentID = nextID
			nextID++
			components = append(components, component)
		}
	}
	return components
}

func BBoxesFromComponents(components []schema.Component, rightOffsetX int, hitPadding int, bounds schema.Size) []schema.RuntimeBBox {
	out := make([]schema.RuntimeBBox, 0, len(components))
	for _, component := range components {
		box := component.BBox.Expand(hitPadding, bounds).Shift(rightOffsetX, 0)
		out = append(out, schema.RuntimeBBox{X: box.X, Y: box.Y, W: box.W, H: box.H})
	}
	return out
}

func Close(mask *image.Alpha, radius int) *image.Alpha {
	return Erode(Dilate(mask, radius), radius)
}

func Dilate(mask *image.Alpha, radius int) *image.Alpha {
	if mask == nil || radius <= 0 {
		return cloneAlpha(mask)
	}
	bounds := mask.Bounds()
	out := image.NewAlpha(bounds)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			if hasNeighbor(mask, x, y, radius) {
				out.SetAlpha(x, y, color.Alpha{A: 255})
			}
		}
	}
	return out
}

func Erode(mask *image.Alpha, radius int) *image.Alpha {
	if mask == nil || radius <= 0 {
		return cloneAlpha(mask)
	}
	bounds := mask.Bounds()
	out := image.NewAlpha(bounds)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			if allNeighbors(mask, x, y, radius) {
				out.SetAlpha(x, y, color.Alpha{A: 255})
			}
		}
	}
	return out
}

func MaskBBox(mask *image.Alpha) schema.BBox {
	if mask == nil {
		return schema.BBox{}
	}
	bounds := mask.Bounds()
	minX, minY := bounds.Max.X, bounds.Max.Y
	maxX, maxY := bounds.Min.X, bounds.Min.Y
	found := false
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			if mask.AlphaAt(x, y).A == 0 {
				continue
			}
			found = true
			if x < minX {
				minX = x
			}
			if y < minY {
				minY = y
			}
			if x+1 > maxX {
				maxX = x + 1
			}
			if y+1 > maxY {
				maxY = y + 1
			}
		}
	}
	if !found {
		return schema.BBox{}
	}
	return schema.BBox{X: minX, Y: minY, W: maxX - minX, H: maxY - minY}
}

func floodComponent(mask *image.Alpha, visited []bool, index func(int, int) int, startX, startY int) schema.Component {
	bounds := mask.Bounds()
	queue := []image.Point{{X: startX, Y: startY}}
	visited[index(startX, startY)] = true

	minX, minY := startX, startY
	maxX, maxY := startX+1, startY+1
	area := 0

	for len(queue) > 0 {
		p := queue[0]
		queue = queue[1:]
		area++
		if p.X < minX {
			minX = p.X
		}
		if p.Y < minY {
			minY = p.Y
		}
		if p.X+1 > maxX {
			maxX = p.X + 1
		}
		if p.Y+1 > maxY {
			maxY = p.Y + 1
		}

		for _, next := range []image.Point{
			{X: p.X + 1, Y: p.Y},
			{X: p.X - 1, Y: p.Y},
			{X: p.X, Y: p.Y + 1},
			{X: p.X, Y: p.Y - 1},
		} {
			if !next.In(bounds) || visited[index(next.X, next.Y)] || mask.AlphaAt(next.X, next.Y).A == 0 {
				continue
			}
			visited[index(next.X, next.Y)] = true
			queue = append(queue, next)
		}
	}

	return schema.Component{
		BBox:   schema.BBox{X: minX, Y: minY, W: maxX - minX, H: maxY - minY},
		AreaPx: area,
	}
}

func hasNeighbor(mask *image.Alpha, x, y, radius int) bool {
	bounds := mask.Bounds()
	for dy := -radius; dy <= radius; dy++ {
		for dx := -radius; dx <= radius; dx++ {
			p := image.Pt(x+dx, y+dy)
			if p.In(bounds) && mask.AlphaAt(p.X, p.Y).A > 0 {
				return true
			}
		}
	}
	return false
}

func allNeighbors(mask *image.Alpha, x, y, radius int) bool {
	bounds := mask.Bounds()
	for dy := -radius; dy <= radius; dy++ {
		for dx := -radius; dx <= radius; dx++ {
			p := image.Pt(x+dx, y+dy)
			if !p.In(bounds) || mask.AlphaAt(p.X, p.Y).A == 0 {
				return false
			}
		}
	}
	return true
}

func cloneAlpha(src *image.Alpha) *image.Alpha {
	if src == nil {
		return nil
	}
	dst := image.NewAlpha(src.Bounds())
	copy(dst.Pix, src.Pix)
	return dst
}

func rgbDelta(left color.RGBA, right color.RGBA) uint32 {
	return absDiff(left.R, right.R) + absDiff(left.G, right.G) + absDiff(left.B, right.B)
}

func absDiff(left, right uint8) uint32 {
	if left > right {
		return uint32(left - right)
	}
	return uint32(right - left)
}
