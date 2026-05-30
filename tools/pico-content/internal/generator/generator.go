package generator

import (
	"context"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"sort"
	"strings"

	"pico-content/internal/contentstage"
	"pico-content/internal/imageops"
	"pico-content/internal/schema"
)

type AIClient interface {
	GenerateImage(ctx context.Context, prompt string, size schema.Size) (image.Image, error)
	PlanDifferences(ctx context.Context, prompt string, leftPanel image.Image, count int) ([]schema.DiffCandidate, error)
	EditImage(ctx context.Context, prompt string, currentRight image.Image, mask *image.Alpha, size schema.Size) (image.Image, error)
	VerifyStage(ctx context.Context, prompt string, leftPanel image.Image, rightPanel image.Image, components []schema.Component) (schema.VerifierResult, error)
}

type Request struct {
	StageID     string      `json:"stageId"`
	Prompt      string      `json:"prompt"`
	Title       string      `json:"title"`
	TitleKo     string      `json:"titleKo,omitempty"`
	Theme       string      `json:"theme,omitempty"`
	Level       int         `json:"level"`
	Count       int         `json:"count"`
	PanelSize   schema.Size `json:"panelSize"`
	HitPadding  int         `json:"hitPadding"`
	BBoxPadding int         `json:"bboxPadding"`
	MaskPadding int         `json:"maskPadding"`
	Threshold   uint32      `json:"threshold"`
	MinArea     int         `json:"minArea"`
}

type Result struct {
	Request        Request                `json:"request"`
	BasePrompt     string                 `json:"basePrompt"`
	EditPrompts    []EditPromptReport     `json:"editPrompts"`
	Candidates     []schema.DiffCandidate `json:"candidates"`
	Components     []schema.Component     `json:"components"`
	VerifierResult schema.VerifierResult  `json:"verifierResult"`
	Stage          contentstage.Stage     `json:"stage"`
	Warnings       []string               `json:"warnings,omitempty"`
	LeftPanel      *image.RGBA            `json:"-"`
	RightPanel     *image.RGBA            `json:"-"`
	Combined       *image.RGBA            `json:"-"`
}

type EditPromptReport struct {
	CandidateID string      `json:"candidateId"`
	Prompt      string      `json:"prompt"`
	MaskBox     schema.BBox `json:"maskBox"`
}

type Compiler struct {
	AI AIClient
}

func (c Compiler) Generate(ctx context.Context, request Request) (Result, error) {
	if c.AI == nil {
		return Result{}, fmt.Errorf("ai client is required")
	}
	request = request.withDefaults()
	if err := request.validate(); err != nil {
		return Result{}, err
	}

	basePrompt := BuildBasePrompt(request)
	left, err := c.AI.GenerateImage(ctx, basePrompt, request.PanelSize)
	if err != nil {
		return Result{}, fmt.Errorf("generate base image: %w", err)
	}
	leftPanel := imageops.Clone(left)
	if err := ensureSize(leftPanel, request.PanelSize, "generated left panel"); err != nil {
		return Result{}, err
	}

	candidates, err := c.AI.PlanDifferences(ctx, BuildPlannerPrompt(request), leftPanel, request.Count)
	if err != nil {
		return Result{}, fmt.Errorf("plan differences: %w", err)
	}
	candidates, err = selectCandidates(request, candidates)
	if err != nil {
		return Result{}, err
	}

	rightPanel := imageops.Clone(leftPanel)
	editPrompts := make([]EditPromptReport, 0, len(candidates))
	for _, candidate := range candidates {
		maskBox := candidate.ApproxBox.Expand(request.MaskPadding, request.PanelSize)
		mask := imageops.MaskFromBox(request.PanelSize, maskBox)
		editPrompt := BuildEditPrompt(request, candidate)
		edited, err := c.AI.EditImage(ctx, editPrompt, rightPanel, mask, request.PanelSize)
		if err != nil {
			return Result{}, fmt.Errorf("edit %s: %w", candidate.CandidateID, err)
		}
		if err := ensureSize(edited, request.PanelSize, "edited panel"); err != nil {
			return Result{}, err
		}
		clamped, err := imageops.ClampEditedCrop(rightPanel, edited, mask, 0)
		if err != nil {
			return Result{}, fmt.Errorf("clamp %s: %w", candidate.CandidateID, err)
		}
		rightPanel = clamped
		editPrompts = append(editPrompts, EditPromptReport{
			CandidateID: candidate.CandidateID,
			Prompt:      editPrompt,
			MaskBox:     maskBox,
		})
	}

	components, _, err := imageops.DiffComponents(leftPanel, rightPanel, imageops.DiffOptions{
		Threshold:   request.Threshold,
		MinArea:     request.MinArea,
		CloseRadius: 1,
	})
	if err != nil {
		return Result{}, err
	}
	components = assignComponents(components, candidates)
	if len(components) != request.Count {
		return Result{}, fmt.Errorf("generated %d pixel-diff components, want %d", len(components), request.Count)
	}

	verifier, err := c.AI.VerifyStage(ctx, BuildVerifierPrompt(request), leftPanel, rightPanel, components)
	if err != nil {
		return Result{}, fmt.Errorf("verify stage: %w", err)
	}
	if err := validateVerifier(request, verifier); err != nil {
		return Result{}, err
	}

	combined := combinePanels(leftPanel, rightPanel)
	stage := buildStage(request, components, verifier)
	return Result{
		Request:        request,
		BasePrompt:     basePrompt,
		EditPrompts:    editPrompts,
		Candidates:     candidates,
		Components:     components,
		VerifierResult: verifier,
		Stage:          stage,
		LeftPanel:      leftPanel,
		RightPanel:     rightPanel,
		Combined:       combined,
	}, nil
}

func BuildBasePrompt(request Request) string {
	parts := []string{
		"Create one original picture for a children's spot-the-difference game.",
		"Style: polished children's picture-book illustration, bright, friendly, clean shapes, high readability.",
		"Composition: one self-contained scene with large isolated objects, clear foreground, uncluttered background, no text, no letters, no logos.",
		"Avoid tiny texture details, noisy sand, dense leaves, repeating micro-patterns, subtle shadow-only changes, and photorealistic clutter.",
		"Leave enough space around each major object so local edits can be made safely.",
		"User scene prompt: " + request.Prompt,
	}
	return strings.Join(parts, "\n")
}

func BuildPlannerPrompt(request Request) string {
	return fmt.Sprintf(`Select %d large, isolated, child-friendly objects that can each become one obvious spot-the-difference edit.
Return JSON only. Use this shape:
{"candidates":[{"candidateId":"short_snake_id","objectName":"object","diffType":"color_change","visibilityScore":0.95,"isolationScore":0.9,"editRiskScore":0.1,"childDifficultyScore":0.2,"childFriendlyScore":0.95,"approxBox":{"x":10,"y":20,"w":120,"h":100},"editInstruction":"Change only this object's color from red to blue.","reason":"Large isolated object."}]}
Allowed diff types: color_change, add_large_object, remove_large_object, accessory_add_or_remove.
Do not choose faces, text, tiny objects, shadows, background texture, or anything touching image edges.
Panel size is %dx%d. Coordinates must be pixel coordinates in the single panel image.
Original user prompt: %s`, request.Count, request.PanelSize.W, request.PanelSize.H, request.Prompt)
}

func BuildEditPrompt(request Request, candidate schema.DiffCandidate) string {
	instruction := strings.TrimSpace(candidate.EditInstruction)
	if instruction == "" {
		instruction = "Create exactly one obvious visual change to this object."
	}
	return fmt.Sprintf(`Edit only the masked area for a children's spot-the-difference game.
Make exactly one visible, child-friendly difference: %s
Do not add text, letters, logos, faces, extra tiny details, extra objects outside the intended object, or shadow-only changes.
Keep the same picture-book style, lighting, perspective, and object boundaries.
The unmasked pixels will be restored by the compiler, so the change must be fully inside the mask.
User scene prompt: %s`, instruction, request.Prompt)
}

func BuildVerifierPrompt(request Request) string {
	return fmt.Sprintf(`Verify this spot-the-difference stage.
There must be exactly %d large, child-friendly visible differences.
Every visible difference must be covered by a generated pixel-diff bbox.
Reject tiny, ambiguous, shadow-only, text, face, or unlisted differences.
Return JSON only with visibleDifferenceCount, hasUnlistedVisibleDifference, hasAmbiguousDifference, differences, repairRequests, confidence.
Original user prompt: %s`, request.Count, request.Prompt)
}

func DryRun(request Request) Result {
	request = request.withDefaults()
	return Result{
		Request:    request,
		BasePrompt: BuildBasePrompt(request),
		EditPrompts: []EditPromptReport{
			{CandidateID: "example_candidate", Prompt: BuildEditPrompt(request, schema.DiffCandidate{CandidateID: "example_candidate", ObjectName: "large object", DiffType: "color_change", EditInstruction: "Change only the large object's color."})},
		},
		Stage: buildStage(request, nil, schema.VerifierResult{}),
		Warnings: []string{
			"dry run only: no OpenAI image generation, edit, verifier, or pixel diff was executed",
		},
	}
}

func (r Request) withDefaults() Request {
	if r.Count == 0 {
		r.Count = 6
	}
	if r.Level == 0 {
		r.Level = 2
	}
	if r.PanelSize.W == 0 || r.PanelSize.H == 0 {
		r.PanelSize = schema.Size{W: 1024, H: 1024}
	}
	if r.HitPadding == 0 {
		r.HitPadding = 16
	}
	if r.BBoxPadding == 0 {
		r.BBoxPadding = 18
	}
	if r.MaskPadding == 0 {
		r.MaskPadding = 24
	}
	if r.Threshold == 0 {
		r.Threshold = 36
	}
	if r.MinArea == 0 {
		r.MinArea = 500
	}
	if r.Title == "" {
		r.Title = titleFromStageID(r.StageID)
	}
	return r
}

func (r Request) validate() error {
	if r.StageID == "" {
		return fmt.Errorf("--stage-id is required")
	}
	if r.Prompt == "" {
		return fmt.Errorf("--prompt is required")
	}
	if r.Count <= 0 {
		return fmt.Errorf("--count must be positive")
	}
	if r.PanelSize.W <= 0 || r.PanelSize.H <= 0 {
		return fmt.Errorf("panel size must be positive")
	}
	return nil
}

func selectCandidates(request Request, candidates []schema.DiffCandidate) ([]schema.DiffCandidate, error) {
	filtered := make([]schema.DiffCandidate, 0, len(candidates))
	for _, candidate := range candidates {
		if candidate.CandidateID == "" || candidate.ApproxBox.Empty() {
			continue
		}
		if !allowedDiffType(candidate.DiffType) {
			continue
		}
		candidate.ApproxBox = candidate.ApproxBox.Clamp(request.PanelSize)
		if candidate.ApproxBox.Empty() {
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
	if len(filtered) < request.Count {
		return nil, fmt.Errorf("planner returned %d usable candidates, want %d", len(filtered), request.Count)
	}
	return filtered[:request.Count], nil
}

func allowedDiffType(diffType string) bool {
	switch diffType {
	case "color_change", "add_large_object", "remove_large_object", "accessory_add_or_remove":
		return true
	default:
		return false
	}
}

func assignComponents(components []schema.Component, candidates []schema.DiffCandidate) []schema.Component {
	out := make([]schema.Component, len(components))
	copy(out, components)
	for index := range out {
		bestID := ""
		bestOverlap := 0
		for _, candidate := range candidates {
			overlap := out[index].BBox.Intersection(candidate.ApproxBox).Area()
			if overlap > bestOverlap {
				bestOverlap = overlap
				bestID = candidate.CandidateID
			}
		}
		out[index].AssignedCandidateID = bestID
	}
	return out
}

func validateVerifier(request Request, verifier schema.VerifierResult) error {
	if verifier.VisibleDifferenceCount != 0 && verifier.VisibleDifferenceCount != request.Count {
		return fmt.Errorf("verifier saw %d differences, want %d", verifier.VisibleDifferenceCount, request.Count)
	}
	if verifier.HasUnlistedVisibleDiff {
		return fmt.Errorf("verifier found unlisted visible differences")
	}
	if verifier.HasAmbiguousDifference {
		return fmt.Errorf("verifier found ambiguous differences")
	}
	if len(verifier.RepairRequests) > 0 {
		return fmt.Errorf("verifier requested %d repairs", len(verifier.RepairRequests))
	}
	return nil
}

func buildStage(request Request, components []schema.Component, verifier schema.VerifierResult) contentstage.Stage {
	panel := contentstage.Panel{X: 0, Y: 0, Width: request.PanelSize.W, Height: request.PanelSize.H}
	right := contentstage.Panel{X: request.PanelSize.W, Y: 0, Width: request.PanelSize.W, Height: request.PanelSize.H}
	stage := contentstage.Stage{
		ID:               request.StageID,
		Title:            request.Title,
		TitleKo:          request.TitleKo,
		Type:             "spot_the_difference",
		Theme:            request.Theme,
		Level:            request.Level,
		EstimatedMinutes: 3,
		ImageWidth:       request.PanelSize.W * 2,
		ImageHeight:      request.PanelSize.H,
		HitPadding:       request.HitPadding,
		TotalDifferences: request.Count,
		Panels: contentstage.Panels{
			Left:  panel,
			Right: right,
		},
	}

	labels := verifierLabels(verifier)
	for index, component := range components {
		box := component.BBox.Expand(request.BBoxPadding, request.PanelSize).Shift(request.PanelSize.W, 0)
		label := labels[component.ComponentID]
		if label == "" {
			label = readableID(component.AssignedCandidateID)
		}
		id := component.AssignedCandidateID
		if id == "" {
			id = fmt.Sprintf("difference_%02d", index+1)
		}
		stage.Differences = append(stage.Differences, contentstage.Difference{
			ID:            id,
			Label:         label,
			LabelKo:       "",
			TargetSide:    "right",
			BBox:          contentstage.BBox{X: box.X, Y: box.Y, Width: box.W, Height: box.H},
			Description:   fmt.Sprintf("The %s is different.", label),
			DescriptionKo: fmt.Sprintf("%s 달라졌어요.", label),
			Action:        "changed",
			VoiceText:     fmt.Sprintf("The %s is different.", label),
			Translation:   fmt.Sprintf("%s 달라졌어요.", label),
		})
	}
	return stage
}

func verifierLabels(verifier schema.VerifierResult) map[int]string {
	labels := map[int]string{}
	for _, diff := range verifier.Differences {
		for _, componentID := range diff.ComponentIDs {
			labels[componentID] = diff.Label
		}
	}
	return labels
}

func combinePanels(left, right image.Image) *image.RGBA {
	leftRGBA := imageops.ToRGBA(left)
	rightRGBA := imageops.ToRGBA(right)
	combined := image.NewRGBA(image.Rect(0, 0, leftRGBA.Bounds().Dx()+rightRGBA.Bounds().Dx(), max(leftRGBA.Bounds().Dy(), rightRGBA.Bounds().Dy())))
	draw.Draw(combined, image.Rect(0, 0, leftRGBA.Bounds().Dx(), leftRGBA.Bounds().Dy()), leftRGBA, leftRGBA.Bounds().Min, draw.Src)
	draw.Draw(combined, image.Rect(leftRGBA.Bounds().Dx(), 0, leftRGBA.Bounds().Dx()+rightRGBA.Bounds().Dx(), rightRGBA.Bounds().Dy()), rightRGBA, rightRGBA.Bounds().Min, draw.Src)
	return combined
}

func ensureSize(img image.Image, size schema.Size, label string) error {
	bounds := img.Bounds()
	if bounds.Dx() != size.W || bounds.Dy() != size.H {
		return fmt.Errorf("%s size = %dx%d, want %dx%d", label, bounds.Dx(), bounds.Dy(), size.W, size.H)
	}
	return nil
}

func titleFromStageID(stageID string) string {
	parts := strings.Split(stageID, "_")
	words := make([]string, 0, len(parts))
	for _, part := range parts {
		if part == "" || allDigits(part) || part == "spot" {
			continue
		}
		words = append(words, strings.ToUpper(part[:1])+strings.ToLower(part[1:]))
	}
	if len(words) == 0 {
		return stageID
	}
	return strings.Join(words, " ")
}

func readableID(id string) string {
	return strings.ReplaceAll(id, "_", " ")
}

func allDigits(value string) bool {
	if value == "" {
		return false
	}
	for _, r := range value {
		if r < '0' || r > '9' {
			return false
		}
	}
	return true
}

func solidImage(size schema.Size, fill color.RGBA) *image.RGBA {
	img := image.NewRGBA(image.Rect(0, 0, size.W, size.H))
	draw.Draw(img, img.Bounds(), &image.Uniform{C: fill}, image.Point{}, draw.Src)
	return img
}
