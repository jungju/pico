package pipeline

import (
	"context"
	"fmt"
	"image"
	"sort"

	"pico-content/internal/imageops"
	"pico-content/internal/openai"
	"pico-content/internal/schema"
)

type State string

const (
	StateInit          State = "INIT"
	StateBaseLoaded    State = "BASE_LOADED"
	StatePlanCreated   State = "PLAN_CREATED"
	StateDiffEditing   State = "DIFF_EDITING"
	StateDiffAnalyzed  State = "DIFF_ANALYZED"
	StateRepairing     State = "REPAIRING"
	StateVerified      State = "VERIFIED"
	StateExportPlanned State = "EXPORT_PLANNED"
)

var OrderedStates = []State{
	StateInit,
	StateBaseLoaded,
	StatePlanCreated,
	StateDiffEditing,
	StateDiffAnalyzed,
	StateRepairing,
	StateVerified,
	StateExportPlanned,
}

type Options struct {
	CloseRadius int
}

type Result struct {
	Request        schema.StageRequest      `json:"request"`
	States         []State                  `json:"states"`
	Plan           schema.PlanResult        `json:"plan"`
	Analysis       schema.ComponentAnalysis `json:"analysis"`
	VerifierResult schema.VerifierResult    `json:"verifierResult"`
	RuntimeStage   schema.RuntimeStage      `json:"runtimeStage"`
	RightPanel     *image.RGBA              `json:"-"`
}

type Compiler struct {
	AI      openai.Client
	Options Options
}

func (c Compiler) Compile(ctx context.Context, request schema.StageRequest, leftPanel image.Image) (*Result, error) {
	if c.AI == nil {
		return nil, fmt.Errorf("openai client is required")
	}
	request = request.WithDefaults()
	if err := request.Validate(); err != nil {
		return nil, err
	}
	if err := validatePanelSize(leftPanel, request.PanelSize); err != nil {
		return nil, err
	}

	result := &Result{
		Request: request,
		States:  []State{StateInit, StateBaseLoaded},
	}

	plan, err := c.AI.PlanDifferences(ctx, request, leftPanel)
	if err != nil {
		return nil, fmt.Errorf("plan differences: %w", err)
	}
	result.Plan = plan
	result.States = append(result.States, StatePlanCreated)

	candidates, err := selectCandidates(request, plan.Candidates)
	if err != nil {
		return nil, err
	}

	rightPanel := imageops.Clone(leftPanel)
	acceptedMask := image.NewAlpha(image.Rect(0, 0, request.PanelSize.W, request.PanelSize.H))

	for _, candidate := range candidates {
		result.States = append(result.States, StateDiffEditing)
		cropBox := candidate.ApproxBox.Expand(request.MaskPadding, request.PanelSize)
		crop, err := imageops.Crop(leftPanel, cropBox)
		if err != nil {
			return nil, fmt.Errorf("crop %s: %w", candidate.CandidateID, err)
		}
		localMask := imageops.MaskFromBox(
			schema.Size{W: cropBox.W, H: cropBox.H},
			candidate.ApproxBox.Shift(-cropBox.X, -cropBox.Y),
		)
		edited, err := c.AI.EditCandidate(ctx, request, candidate, crop, localMask)
		if err != nil {
			return nil, fmt.Errorf("edit %s: %w", candidate.CandidateID, err)
		}
		clamped, err := imageops.ClampEditedCrop(crop, edited, localMask, 0)
		if err != nil {
			return nil, fmt.Errorf("clamp %s: %w", candidate.CandidateID, err)
		}
		if err := imageops.Composite(rightPanel, clamped, image.Pt(cropBox.X, cropBox.Y)); err != nil {
			return nil, fmt.Errorf("composite %s: %w", candidate.CandidateID, err)
		}

		candidateMask := imageops.MaskFromBox(request.PanelSize, candidate.ApproxBox)
		acceptedMask = imageops.MaskUnion(acceptedMask, candidateMask)
		result.States = append(result.States, StateDiffAnalyzed)
		if err := validateNoLeak(leftPanel, rightPanel, acceptedMask, request); err != nil {
			return nil, fmt.Errorf("%s: %w", candidate.CandidateID, err)
		}
	}

	components, mask, err := imageops.DiffComponents(leftPanel, rightPanel, imageops.DiffOptions{
		Threshold:   request.PixelDiffThreshold,
		MinArea:     request.MinComponentArea,
		CloseRadius: c.Options.CloseRadius,
	})
	if err != nil {
		return nil, err
	}
	assigned := assignComponentsToCandidates(components, candidates)
	result.Analysis = schema.ComponentAnalysis{
		Components:         assigned,
		TotalChangedAreaPx: changedArea(mask),
	}

	verifier, err := c.AI.VerifyStage(ctx, request, leftPanel, rightPanel, assigned)
	if err != nil {
		return nil, fmt.Errorf("verify stage: %w", err)
	}
	result.VerifierResult = verifier
	result.States = append(result.States, StateVerified)
	if err := validateAcceptance(request, assigned, verifier); err != nil {
		return nil, err
	}

	result.RuntimeStage = buildRuntimeStage(request, assigned, verifier)
	result.RightPanel = rightPanel
	result.States = append(result.States, StateExportPlanned)
	return result, nil
}

func selectCandidates(request schema.StageRequest, candidates []schema.DiffCandidate) ([]schema.DiffCandidate, error) {
	filtered := make([]schema.DiffCandidate, 0, len(candidates))
	for _, candidate := range candidates {
		if candidate.CandidateID == "" || candidate.ApproxBox.Empty() {
			continue
		}
		if !contains(request.AllowedDiffTypes, candidate.DiffType) {
			continue
		}
		filtered = append(filtered, candidate)
	}
	sort.SliceStable(filtered, func(i, j int) bool {
		left := filtered[i]
		right := filtered[j]
		leftScore := left.VisibilityScore + left.IsolationScore + left.ChildFriendlyScore - left.EditRiskScore - left.ChildDifficultyScore
		rightScore := right.VisibilityScore + right.IsolationScore + right.ChildFriendlyScore - right.EditRiskScore - right.ChildDifficultyScore
		return leftScore > rightScore
	})
	if len(filtered) < request.TargetDifferenceCount {
		return nil, fmt.Errorf("not enough candidates: got %d want %d", len(filtered), request.TargetDifferenceCount)
	}
	return filtered[:request.TargetDifferenceCount], nil
}

func assignComponentsToCandidates(components []schema.Component, candidates []schema.DiffCandidate) []schema.Component {
	assigned := make([]schema.Component, len(components))
	copy(assigned, components)
	for i := range assigned {
		bestID := ""
		bestArea := 0
		for _, candidate := range candidates {
			area := assigned[i].BBox.Intersection(candidate.ApproxBox).Area()
			if area > bestArea {
				bestArea = area
				bestID = candidate.CandidateID
			}
		}
		assigned[i].AssignedCandidateID = bestID
	}
	return assigned
}

func validateNoLeak(leftPanel image.Image, rightPanel image.Image, acceptedMask *image.Alpha, request schema.StageRequest) error {
	diffMask, err := imageops.DiffMask(leftPanel, rightPanel, request.PixelDiffThreshold)
	if err != nil {
		return err
	}
	bounds := diffMask.Bounds()
	totalArea := 0
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			if diffMask.AlphaAt(x, y).A == 0 {
				continue
			}
			if acceptedMask.AlphaAt(x, y).A == 0 {
				totalArea++
			}
		}
	}
	if totalArea > request.VisibleLeakAreaTolerance {
		return fmt.Errorf("%s: %d px outside accepted regions", schema.RejectEditLeak, totalArea)
	}
	return nil
}

func validateAcceptance(request schema.StageRequest, components []schema.Component, verifier schema.VerifierResult) error {
	if len(components) != request.TargetDifferenceCount {
		return fmt.Errorf("%s: component count %d does not match target %d", schema.RejectExtraVisibleDiff, len(components), request.TargetDifferenceCount)
	}
	for _, component := range components {
		if component.AreaPx < request.MinVisibleAreaPerDiff {
			return fmt.Errorf("%s: component %d area %d", schema.RejectTooSmall, component.ComponentID, component.AreaPx)
		}
		if component.BBox.W < request.MinBBoxWidth || component.BBox.H < request.MinBBoxHeight {
			return fmt.Errorf("%s: component %d bbox %+v", schema.RejectTooSmall, component.ComponentID, component.BBox)
		}
		if component.AssignedCandidateID == "" {
			return fmt.Errorf("%s: component %d has no candidate assignment", schema.RejectSemanticMismatch, component.ComponentID)
		}
	}
	if verifier.VisibleDifferenceCount != request.TargetDifferenceCount {
		return fmt.Errorf("%s: verifier count %d does not match target %d", schema.RejectSemanticMismatch, verifier.VisibleDifferenceCount, request.TargetDifferenceCount)
	}
	if verifier.HasUnlistedVisibleDiff || verifier.HasAmbiguousDifference || len(verifier.RepairRequests) > 0 {
		return fmt.Errorf("%s: verifier requested repair", schema.RejectRepairFailed)
	}
	return nil
}

func buildRuntimeStage(request schema.StageRequest, components []schema.Component, verifier schema.VerifierResult) schema.RuntimeStage {
	labels := map[int]string{}
	for _, diff := range verifier.Differences {
		for _, componentID := range diff.ComponentIDs {
			labels[componentID] = diff.Label
		}
	}
	differences := make([]schema.RuntimeDifference, 0, len(components))
	for _, component := range components {
		box := component.BBox.Expand(request.HitPadding, request.PanelSize).Shift(request.RightOffsetX, 0)
		label := labels[component.ComponentID]
		if label == "" {
			label = component.AssignedCandidateID
		}
		differences = append(differences, schema.RuntimeDifference{
			ID:         component.AssignedCandidateID,
			Label:      label,
			BBox:       schema.RuntimeBBox{X: box.X, Y: box.Y, W: box.W, H: box.H},
			HitPadding: request.HitPadding,
			ComponentIDs: []int{
				component.ComponentID,
			},
		})
	}
	return schema.RuntimeStage{
		ID:         request.StageID,
		Type:       "spot_the_difference",
		TargetSide: "right",
		Panels: schema.RuntimePanels{
			Left:  schema.RuntimePanel{X: 0, Y: 0, W: request.PanelSize.W, H: request.PanelSize.H},
			Right: schema.RuntimePanel{X: request.RightOffsetX, Y: 0, W: request.PanelSize.W, H: request.PanelSize.H},
		},
		Differences: differences,
		HitPadding:  request.HitPadding,
	}
}

func validatePanelSize(img image.Image, size schema.Size) error {
	bounds := img.Bounds()
	if bounds.Dx() != size.W || bounds.Dy() != size.H {
		return fmt.Errorf("left panel size = %dx%d, want %dx%d", bounds.Dx(), bounds.Dy(), size.W, size.H)
	}
	return nil
}

func changedArea(mask *image.Alpha) int {
	if mask == nil {
		return 0
	}
	bounds := mask.Bounds()
	area := 0
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			if mask.AlphaAt(x, y).A > 0 {
				area++
			}
		}
	}
	return area
}

func contains(values []string, needle string) bool {
	for _, value := range values {
		if value == needle {
			return true
		}
	}
	return false
}
