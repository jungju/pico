package schema

import "fmt"

type Size struct {
	W int `json:"w"`
	H int `json:"h"`
}

type BBox struct {
	X int `json:"x"`
	Y int `json:"y"`
	W int `json:"w"`
	H int `json:"h"`
}

func (b BBox) Empty() bool {
	return b.W <= 0 || b.H <= 0
}

func (b BBox) Area() int {
	if b.Empty() {
		return 0
	}
	return b.W * b.H
}

func (b BBox) Right() int {
	return b.X + b.W
}

func (b BBox) Bottom() int {
	return b.Y + b.H
}

func (b BBox) ContainsPoint(x, y int) bool {
	return x >= b.X && x < b.Right() && y >= b.Y && y < b.Bottom()
}

func (b BBox) Intersects(other BBox) bool {
	return b.X < other.Right() && b.Right() > other.X && b.Y < other.Bottom() && b.Bottom() > other.Y
}

func (b BBox) Intersection(other BBox) BBox {
	x1 := max(b.X, other.X)
	y1 := max(b.Y, other.Y)
	x2 := min(b.Right(), other.Right())
	y2 := min(b.Bottom(), other.Bottom())
	if x2 <= x1 || y2 <= y1 {
		return BBox{}
	}
	return BBox{X: x1, Y: y1, W: x2 - x1, H: y2 - y1}
}

func (b BBox) Expand(padding int, bounds Size) BBox {
	if padding <= 0 {
		return b.Clamp(bounds)
	}
	expanded := BBox{
		X: b.X - padding,
		Y: b.Y - padding,
		W: b.W + padding*2,
		H: b.H + padding*2,
	}
	return expanded.Clamp(bounds)
}

func (b BBox) Clamp(bounds Size) BBox {
	x1 := clamp(b.X, 0, bounds.W)
	y1 := clamp(b.Y, 0, bounds.H)
	x2 := clamp(b.Right(), 0, bounds.W)
	y2 := clamp(b.Bottom(), 0, bounds.H)
	if x2 <= x1 || y2 <= y1 {
		return BBox{}
	}
	return BBox{X: x1, Y: y1, W: x2 - x1, H: y2 - y1}
}

func (b BBox) Shift(dx, dy int) BBox {
	return BBox{X: b.X + dx, Y: b.Y + dy, W: b.W, H: b.H}
}

type StageRequest struct {
	StageID                  string   `json:"stageId"`
	Theme                    string   `json:"theme"`
	TargetDifferenceCount    int      `json:"targetDifferenceCount"`
	Difficulty               string   `json:"difficulty"`
	PanelSize                Size     `json:"panelSize"`
	CombinedSize             Size     `json:"combinedSize"`
	RightOffsetX             int      `json:"rightOffsetX"`
	AllowedDiffTypes         []string `json:"allowedDiffTypes"`
	ForbiddenDiffTypes       []string `json:"forbiddenDiffTypes"`
	PixelDiffThreshold       uint32   `json:"pixelDiffThreshold"`
	MinComponentArea         int      `json:"minComponentArea"`
	MinVisibleAreaPerDiff    int      `json:"minVisibleAreaPerDiff"`
	MinBBoxWidth             int      `json:"minBboxWidth"`
	MinBBoxHeight            int      `json:"minBboxHeight"`
	MaxBBoxToMaskAreaRatio   float64  `json:"maxBboxToMaskAreaRatio"`
	HitPadding               int      `json:"hitPadding"`
	MaskPadding              int      `json:"maskPadding"`
	MaxEditAttempts          int      `json:"maxEditAttempts"`
	MaxRepairAttempts        int      `json:"maxRepairAttempts"`
	MaxStageAttempts         int      `json:"maxStageAttempts"`
	VisibleLeakAreaTolerance int      `json:"visibleLeakAreaTolerance"`
}

func (r StageRequest) WithDefaults() StageRequest {
	if r.TargetDifferenceCount == 0 {
		r.TargetDifferenceCount = 6
	}
	if r.Difficulty == "" {
		r.Difficulty = "easy"
	}
	if r.PanelSize.W == 0 || r.PanelSize.H == 0 {
		r.PanelSize = Size{W: 768, H: 1152}
	}
	if r.RightOffsetX == 0 {
		r.RightOffsetX = r.PanelSize.W
	}
	if r.CombinedSize.W == 0 || r.CombinedSize.H == 0 {
		r.CombinedSize = Size{W: r.PanelSize.W * 2, H: r.PanelSize.H}
	}
	if len(r.AllowedDiffTypes) == 0 {
		r.AllowedDiffTypes = []string{"color_change", "add_large_object", "remove_large_object", "accessory_add_or_remove"}
	}
	if len(r.ForbiddenDiffTypes) == 0 {
		r.ForbiddenDiffTypes = []string{"tiny_texture_change", "background_noise_change", "text_change", "face_change", "random_small_object_change", "shadow_only_change"}
	}
	if r.PixelDiffThreshold == 0 {
		r.PixelDiffThreshold = 36
	}
	if r.MinComponentArea == 0 {
		r.MinComponentArea = 300
	}
	if r.MinVisibleAreaPerDiff == 0 {
		r.MinVisibleAreaPerDiff = 1200
	}
	if r.MinBBoxWidth == 0 {
		r.MinBBoxWidth = 50
	}
	if r.MinBBoxHeight == 0 {
		r.MinBBoxHeight = 50
	}
	if r.MaxBBoxToMaskAreaRatio == 0 {
		r.MaxBBoxToMaskAreaRatio = 6
	}
	if r.HitPadding == 0 {
		r.HitPadding = 24
	}
	if r.MaskPadding == 0 {
		r.MaskPadding = 18
	}
	if r.MaxEditAttempts == 0 {
		r.MaxEditAttempts = 3
	}
	if r.MaxRepairAttempts == 0 {
		r.MaxRepairAttempts = 3
	}
	if r.MaxStageAttempts == 0 {
		r.MaxStageAttempts = 5
	}
	return r
}

func (r StageRequest) Validate() error {
	if r.StageID == "" {
		return fmt.Errorf("stageId is required")
	}
	if r.TargetDifferenceCount <= 0 {
		return fmt.Errorf("targetDifferenceCount must be positive")
	}
	if r.PanelSize.W <= 0 || r.PanelSize.H <= 0 {
		return fmt.Errorf("panelSize must be positive")
	}
	if r.RightOffsetX < r.PanelSize.W {
		return fmt.Errorf("rightOffsetX must be at least panel width")
	}
	return nil
}

type DiffCandidate struct {
	CandidateID          string  `json:"candidateId"`
	ObjectName           string  `json:"objectName"`
	DiffType             string  `json:"diffType"`
	VisibilityScore      float64 `json:"visibilityScore"`
	IsolationScore       float64 `json:"isolationScore"`
	EditRiskScore        float64 `json:"editRiskScore"`
	ChildDifficultyScore float64 `json:"childDifficultyScore"`
	ChildFriendlyScore   float64 `json:"childFriendlyScore"`
	ApproxBox            BBox    `json:"approxBox"`
	EditInstruction      string  `json:"editInstruction"`
	Reason               string  `json:"reason"`
}

type PlanResult struct {
	Candidates []DiffCandidate `json:"candidates"`
}

type Component struct {
	ComponentID         int     `json:"componentId"`
	BBox                BBox    `json:"bbox"`
	AreaPx              int     `json:"areaPx"`
	MeanDelta           float64 `json:"meanDelta,omitempty"`
	MaxDelta            uint32  `json:"maxDelta,omitempty"`
	AssignedCandidateID string  `json:"assignedCandidateId,omitempty"`
}

type ComponentAnalysis struct {
	Components          []Component `json:"components"`
	OutsideLeaks        []Component `json:"outsideLeakComponents"`
	TotalChangedAreaPx  int         `json:"totalChangedAreaPx"`
	AcceptedChangedArea int         `json:"acceptedChangedAreaPx"`
}

type RuntimeBBox struct {
	X int `json:"x"`
	Y int `json:"y"`
	W int `json:"w"`
	H int `json:"h"`
}

type RuntimeDifference struct {
	ID           string      `json:"id"`
	Label        string      `json:"label"`
	BBox         RuntimeBBox `json:"bbox"`
	HitPadding   int         `json:"hitPadding,omitempty"`
	ComponentIDs []int       `json:"componentIds,omitempty"`
}

type RuntimeStage struct {
	ID             string              `json:"id"`
	Type           string              `json:"type"`
	Image          string              `json:"image"`
	TargetSide     string              `json:"targetSide"`
	Panels         RuntimePanels       `json:"panels"`
	Differences    []RuntimeDifference `json:"differences"`
	Objects        []RuntimeObject     `json:"objects,omitempty"`
	HitPadding     int                 `json:"hitPadding,omitempty"`
	CompilerReport string              `json:"compilerReport,omitempty"`
}

type RuntimePanels struct {
	Left  RuntimePanel `json:"left"`
	Right RuntimePanel `json:"right"`
}

type RuntimePanel struct {
	X int `json:"x"`
	Y int `json:"y"`
	W int `json:"w"`
	H int `json:"h"`
}

type RuntimeObject struct {
	ID       string      `json:"id"`
	Word     string      `json:"word"`
	Meaning  string      `json:"meaning"`
	BBox     RuntimeBBox `json:"bbox"`
	Sentence string      `json:"sentence,omitempty"`
}

type VerifierDifference struct {
	CandidateID     string  `json:"candidateId"`
	Label           string  `json:"label"`
	ComponentIDs    []int   `json:"componentIds"`
	IsChildFriendly bool    `json:"isChildFriendly"`
	IsCoveredByBBox bool    `json:"isCoveredByBbox"`
	Confidence      float64 `json:"confidence"`
}

type RepairRequest struct {
	Reason      RejectReason `json:"reason"`
	Description string       `json:"description"`
	BBox        BBox         `json:"bbox"`
}

type VerifierResult struct {
	VisibleDifferenceCount int                  `json:"visibleDifferenceCount"`
	HasUnlistedVisibleDiff bool                 `json:"hasUnlistedVisibleDifference"`
	HasAmbiguousDifference bool                 `json:"hasAmbiguousDifference"`
	Differences            []VerifierDifference `json:"differences"`
	RepairRequests         []RepairRequest      `json:"repairRequests"`
	Confidence             float64              `json:"confidence"`
}

type RejectReason string

const (
	RejectExtraVisibleDiff RejectReason = "REJECT_EXTRA_VISIBLE_DIFF"
	RejectTooSmall         RejectReason = "REJECT_TOO_SMALL"
	RejectTooAmbiguous     RejectReason = "REJECT_TOO_AMBIGUOUS"
	RejectBBoxTooLoose     RejectReason = "REJECT_BBOX_TOO_LOOSE"
	RejectDiffOverlap      RejectReason = "REJECT_DIFF_OVERLAP"
	RejectEditLeak         RejectReason = "REJECT_EDIT_LEAK"
	RejectLowContrast      RejectReason = "REJECT_LOW_CONTRAST"
	RejectSemanticMismatch RejectReason = "REJECT_SEMANTIC_MISMATCH"
	RejectRepairFailed     RejectReason = "REJECT_REPAIR_FAILED"
)

func clamp(value, low, high int) int {
	if value < low {
		return low
	}
	if value > high {
		return high
	}
	return value
}
