package openai

import (
	"context"
	"image"

	"pico-content/internal/schema"
)

// Client keeps AI calls replaceable. The compiler treats AI output as proposals,
// never as ground truth for runtime hitboxes.
type Client interface {
	PlanDifferences(ctx context.Context, request schema.StageRequest, leftPanel image.Image) (schema.PlanResult, error)
	EditCandidate(ctx context.Context, request schema.StageRequest, candidate schema.DiffCandidate, crop image.Image, mask *image.Alpha) (image.Image, error)
	VerifyStage(ctx context.Context, request schema.StageRequest, leftPanel image.Image, rightPanel image.Image, components []schema.Component) (schema.VerifierResult, error)
}

type NoopVerifier struct{}

func (NoopVerifier) VerifyStage(_ context.Context, request schema.StageRequest, _ image.Image, _ image.Image, components []schema.Component) (schema.VerifierResult, error) {
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
		VisibleDifferenceCount: len(components),
		HasUnlistedVisibleDiff: len(components) != request.TargetDifferenceCount,
		Differences:            differences,
		Confidence:             1,
	}, nil
}
