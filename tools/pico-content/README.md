# Pico Content Compiler

`pico-content` is a Go CLI scaffold for compiling Spot the Difference content.
It is not the gameplay engine and it does not hand-author hitboxes.

The compiler algorithm keeps one rule fixed:

```text
The final pixel difference between leftPanel and rightPanel is the only ground truth.
```

AI may propose candidates, edit local crops, and verify the final scene, but the
runtime JSON bboxes must come from deterministic pixel-diff connected components.

## Pipeline

```text
request
  -> generate/load left panel
  -> AI vision planning
  -> copy left panel to right panel
  -> edit one candidate at a time
  -> hard-clamp every edited crop outside its mask
  -> pixel diff analysis
  -> connected component extraction
  -> semantic verification
  -> repair loop
  -> export combined image and runtime JSON
```

This first version contains the algorithm modules and deterministic image
operations. OpenAI calls are intentionally kept behind interfaces so the API
implementation can be added without changing the compiler state machine.

## Commands

Print the planned state machine:

```sh
go run ./cmd/pico-content describe
```

Analyze two same-size images and write connected diff components:

```sh
go run ./cmd/pico-content analyze-diff \
  --left left.png \
  --right right.png \
  --out components.json
```

## Package Map

- `internal/schema`: request, planner, verifier, component, and runtime JSON
  shapes.
- `internal/imageops`: crop, mask, hard clamp, diff mask, morphology,
  connected components, and bbox conversion.
- `internal/openai`: AI planner/editor/verifier interface boundary.
- `internal/pipeline`: closed-loop compiler state machine.
- `internal/artifacts`: manifest and hash helpers for reproducible outputs.
