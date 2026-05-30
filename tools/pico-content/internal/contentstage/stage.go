package contentstage

import (
	"encoding/json"
	"fmt"
	"image"
	"os"

	"pico-content/internal/imageops"
	"pico-content/internal/schema"
)

type Stage struct {
	ID                 string       `json:"id"`
	Title              string       `json:"title"`
	TitleKo            string       `json:"titleKo,omitempty"`
	Type               string       `json:"type"`
	Theme              string       `json:"theme,omitempty"`
	Level              int          `json:"level,omitempty"`
	EstimatedMinutes   int          `json:"estimatedMinutes,omitempty"`
	ImageWidth         int          `json:"imageWidth"`
	ImageHeight        int          `json:"imageHeight"`
	HitPadding         int          `json:"hitPadding,omitempty"`
	TotalDifferences   int          `json:"totalDifferences"`
	Panels             Panels       `json:"panels"`
	Differences        []Difference `json:"differences"`
	CompilerReportPath string       `json:"compilerReport,omitempty"`
}

type Panels struct {
	Left  Panel `json:"left"`
	Right Panel `json:"right"`
}

type Panel struct {
	X      int `json:"x"`
	Y      int `json:"y"`
	Width  int `json:"width"`
	Height int `json:"height"`
}

type Difference struct {
	ID            string `json:"id"`
	Label         string `json:"label"`
	LabelKo       string `json:"labelKo,omitempty"`
	TargetSide    string `json:"targetSide"`
	BBox          BBox   `json:"bbox"`
	Description   string `json:"description,omitempty"`
	DescriptionKo string `json:"descriptionKo,omitempty"`
	Action        string `json:"action,omitempty"`
	VoiceText     string `json:"voiceText,omitempty"`
	Translation   string `json:"translation,omitempty"`
	HitPadding    *int   `json:"hitPadding,omitempty"`
}

type BBox struct {
	X      int `json:"x"`
	Y      int `json:"y"`
	Width  int `json:"width"`
	Height int `json:"height"`
}

type AnalyzeOptions struct {
	Threshold         uint32
	MinArea           int
	CloseRadius       int
	AssignmentPadding int
	BBoxPadding       int
}

type AnalysisReport struct {
	StageID           string                 `json:"stageId"`
	ImagePath         string                 `json:"imagePath"`
	Threshold         uint32                 `json:"threshold"`
	MinArea           int                    `json:"minArea"`
	CloseRadius       int                    `json:"closeRadius"`
	AssignmentPadding int                    `json:"assignmentPadding"`
	BBoxPadding       int                    `json:"bboxPadding"`
	RawComponentCount int                    `json:"rawComponentCount"`
	RawComponents     []schema.Component     `json:"rawComponents"`
	Assignments       []DifferenceAssignment `json:"assignments"`
	Unassigned        []schema.Component     `json:"unassignedComponents"`
	Warnings          []string               `json:"warnings,omitempty"`
	Applied           bool                   `json:"applied"`
}

type DifferenceAssignment struct {
	DifferenceID string             `json:"differenceId"`
	Label        string             `json:"label"`
	OldBBox      BBox               `json:"oldBbox"`
	NewBBox      BBox               `json:"newBbox"`
	ComponentIDs []int              `json:"componentIds"`
	AreaPx       int                `json:"areaPx"`
	Components   []schema.Component `json:"components"`
}

func Load(path string) (Stage, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return Stage{}, err
	}
	var stage Stage
	if err := json.Unmarshal(data, &stage); err != nil {
		return Stage{}, err
	}
	return stage, nil
}

func Save(path string, stage Stage) error {
	data, err := json.MarshalIndent(stage, "", "  ")
	if err != nil {
		return err
	}
	data = append(data, '\n')
	return os.WriteFile(path, data, 0o644)
}

func Analyze(stage Stage, imagePath string, img image.Image, opts AnalyzeOptions) (Stage, AnalysisReport, error) {
	opts = opts.withDefaults()
	if err := validateStage(stage); err != nil {
		return stage, AnalysisReport{}, err
	}

	leftCrop, err := imageops.Crop(img, panelBBox(stage.Panels.Left))
	if err != nil {
		return stage, AnalysisReport{}, fmt.Errorf("crop left panel: %w", err)
	}
	rightCrop, err := imageops.Crop(img, panelBBox(stage.Panels.Right))
	if err != nil {
		return stage, AnalysisReport{}, fmt.Errorf("crop right panel: %w", err)
	}
	components, _, err := imageops.DiffComponents(leftCrop, rightCrop, imageops.DiffOptions{
		Threshold:   opts.Threshold,
		MinArea:     opts.MinArea,
		CloseRadius: opts.CloseRadius,
	})
	if err != nil {
		return stage, AnalysisReport{}, err
	}

	localGroups, unassigned := assignComponents(stage, components, opts.AssignmentPadding)
	assignments := make([]DifferenceAssignment, 0, len(stage.Differences))
	panelSize := schema.Size{W: stage.Panels.Right.Width, H: stage.Panels.Right.Height}
	for index, difference := range stage.Differences {
		group := localGroups[index]
		assignment := DifferenceAssignment{
			DifferenceID: difference.ID,
			Label:        difference.Label,
			OldBBox:      difference.BBox,
			ComponentIDs: componentIDs(group),
			AreaPx:       componentArea(group),
			Components:   toFullComponents(group, stage.Panels.Right),
		}
		if len(group) == 0 {
			assignment.NewBBox = difference.BBox
		} else {
			localBox := unionComponents(group).Expand(opts.BBoxPadding, panelSize)
			newBox := localBox.Shift(stage.Panels.Right.X, stage.Panels.Right.Y)
			assignment.NewBBox = fromSchemaBBox(newBox)
			stage.Differences[index].BBox = assignment.NewBBox
		}
		assignments = append(assignments, assignment)
	}

	fullComponents := toFullComponents(components, stage.Panels.Right)
	fullUnassigned := toFullComponents(unassigned, stage.Panels.Right)
	report := AnalysisReport{
		StageID:           stage.ID,
		ImagePath:         imagePath,
		Threshold:         opts.Threshold,
		MinArea:           opts.MinArea,
		CloseRadius:       opts.CloseRadius,
		AssignmentPadding: opts.AssignmentPadding,
		BBoxPadding:       opts.BBoxPadding,
		RawComponentCount: len(components),
		RawComponents:     fullComponents,
		Assignments:       assignments,
		Unassigned:        fullUnassigned,
		Warnings:          warnings(assignments, fullUnassigned),
	}
	return stage, report, nil
}

func (opts AnalyzeOptions) withDefaults() AnalyzeOptions {
	if opts.Threshold == 0 {
		opts.Threshold = 44
	}
	if opts.MinArea == 0 {
		opts.MinArea = 180
	}
	if opts.AssignmentPadding == 0 {
		opts.AssignmentPadding = 180
	}
	if opts.BBoxPadding == 0 {
		opts.BBoxPadding = 8
	}
	return opts
}

func validateStage(stage Stage) error {
	if stage.ID == "" {
		return fmt.Errorf("stage id is required")
	}
	if stage.Panels.Left.Width <= 0 || stage.Panels.Left.Height <= 0 {
		return fmt.Errorf("left panel size must be positive")
	}
	if stage.Panels.Right.Width <= 0 || stage.Panels.Right.Height <= 0 {
		return fmt.Errorf("right panel size must be positive")
	}
	if stage.Panels.Left.Width != stage.Panels.Right.Width || stage.Panels.Left.Height != stage.Panels.Right.Height {
		return fmt.Errorf("left and right panel sizes must match")
	}
	if len(stage.Differences) == 0 {
		return fmt.Errorf("stage has no differences")
	}
	return nil
}

func assignComponents(stage Stage, components []schema.Component, assignmentPadding int) ([][]schema.Component, []schema.Component) {
	groups := make([][]schema.Component, len(stage.Differences))
	unassigned := []schema.Component{}
	panelSize := schema.Size{W: stage.Panels.Right.Width, H: stage.Panels.Right.Height}
	for _, component := range components {
		bestIndex := -1
		bestOverlap := 0
		for index, difference := range stage.Differences {
			localBox := toLocalBBox(difference.BBox, stage.Panels.Right).Expand(assignmentPadding, panelSize)
			overlap := component.BBox.Intersection(localBox).Area()
			if overlap > bestOverlap {
				bestOverlap = overlap
				bestIndex = index
			}
		}
		if bestIndex < 0 {
			unassigned = append(unassigned, component)
			continue
		}
		component.AssignedCandidateID = stage.Differences[bestIndex].ID
		groups[bestIndex] = append(groups[bestIndex], component)
	}
	return groups, unassigned
}

func warnings(assignments []DifferenceAssignment, unassigned []schema.Component) []string {
	out := []string{}
	for _, assignment := range assignments {
		if len(assignment.ComponentIDs) == 0 {
			out = append(out, fmt.Sprintf("%s has no assigned pixel-diff component", assignment.DifferenceID))
		}
	}
	for _, component := range unassigned {
		if component.AreaPx >= 800 {
			out = append(out, fmt.Sprintf("unassigned component %d has visible area %d px at %+v", component.ComponentID, component.AreaPx, component.BBox))
		}
	}
	return out
}

func componentIDs(components []schema.Component) []int {
	ids := make([]int, 0, len(components))
	for _, component := range components {
		ids = append(ids, component.ComponentID)
	}
	return ids
}

func componentArea(components []schema.Component) int {
	area := 0
	for _, component := range components {
		area += component.AreaPx
	}
	return area
}

func unionComponents(components []schema.Component) schema.BBox {
	if len(components) == 0 {
		return schema.BBox{}
	}
	left := components[0].BBox.X
	top := components[0].BBox.Y
	right := components[0].BBox.Right()
	bottom := components[0].BBox.Bottom()
	for _, component := range components[1:] {
		if component.BBox.X < left {
			left = component.BBox.X
		}
		if component.BBox.Y < top {
			top = component.BBox.Y
		}
		if component.BBox.Right() > right {
			right = component.BBox.Right()
		}
		if component.BBox.Bottom() > bottom {
			bottom = component.BBox.Bottom()
		}
	}
	return schema.BBox{X: left, Y: top, W: right - left, H: bottom - top}
}

func toFullComponents(components []schema.Component, panel Panel) []schema.Component {
	out := make([]schema.Component, 0, len(components))
	for _, component := range components {
		component.BBox = component.BBox.Shift(panel.X, panel.Y)
		out = append(out, component)
	}
	return out
}

func panelBBox(panel Panel) schema.BBox {
	return schema.BBox{X: panel.X, Y: panel.Y, W: panel.Width, H: panel.Height}
}

func toLocalBBox(box BBox, panel Panel) schema.BBox {
	return schema.BBox{X: box.X - panel.X, Y: box.Y - panel.Y, W: box.Width, H: box.Height}
}

func fromSchemaBBox(box schema.BBox) BBox {
	return BBox{X: box.X, Y: box.Y, Width: box.W, Height: box.H}
}
