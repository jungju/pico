# Pico Content Compiler

`pico-content` compiles Spot the Difference content from a scene prompt into
`contents/<stage-id>.jpg` and `contents/<stage-id>.json`.

The tool is an AI content compiler, not a gameplay engine. AI creates and edits
images, while Go controls the generation loop and exports runtime data from
actual pixel differences.

```text
prompt
  -> service-grade base prompt
  -> OpenAI image generation for leftPanel
  -> OpenAI vision planning for large isolated candidates
  -> rightPanel starts as an exact copy of leftPanel
  -> one masked edit per candidate
  -> hard clamp outside each mask
  -> pixel diff components
  -> OpenAI verifier
  -> combined image + content JSON + artifacts
```

## Generate

Dry run without calling OpenAI:

```sh
go run ./cmd/pico-content generate-stage \
  --stage-id spot_toy_room_021 \
  --prompt "a cozy toy room with large colorful toys on shelves, clean background, children's picture book style" \
  --theme toys \
  --title "Toy Room" \
  --title-ko "장난감 방" \
  --dry-run
```

Generate real content. The command reads `OPENAI_API_KEY` from the environment
or from a local `.env` file in the current working directory.

```sh
go run ./cmd/pico-content generate-stage \
  --stage-id spot_toy_room_021 \
  --prompt "a cozy toy room with six large colorful toys, clean shelves, simple floor, no text, no tiny clutter" \
  --theme toys \
  --title "Toy Room" \
  --title-ko "장난감 방" \
  --count 6 \
  --out ../../contents \
  --artifacts artifacts/spot_toy_room_021 \
  --report artifacts/spot_toy_room_021/summary.json
```

Useful defaults:

- Image model: `OPENAI_IMAGE_MODEL`, default `gpt-image-2`
- Vision model: `OPENAI_VISION_MODEL`, default `gpt-4o`
- Base URL: `OPENAI_BASE_URL`, default `https://api.openai.com`
- Panel size: `1024x1024`

## Debug Commands

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

Analyze an existing `contents` stage by splitting its combined image with the
JSON panel coordinates:

```sh
go run ./cmd/pico-content analyze-stage \
  --stage ../../contents/spot_beach_day_001.json \
  --image ../../contents/spot_beach_day_001.jpg \
  --out /tmp/spot_beach_day_001-analysis.json
```

Rebuild a legacy stage from the left panel plus local right-panel patches:

```sh
go run ./cmd/pico-content rebuild-stage \
  --stage ../../contents/spot_beach_day_001.json \
  --image ../../contents/spot_beach_day_001.jpg \
  --out-image /tmp/spot_beach_day_001-rebuilt.jpg \
  --full-rect \
  --patch shell_natural=1210,1007,75,70
```

## Package Map

- `internal/generator`: prompt-to-stage compiler, export flow, service prompts.
- `internal/openai`: raw OpenAI HTTP boundary for image generation, image edits,
  and Responses-based planner/verifier calls.
- `internal/imageops`: crop, mask, hard clamp, diff mask, morphology,
  connected components, and bbox conversion.
- `internal/contentstage`: Pico `contents/*.json` stage schema helpers and
  legacy stage analysis/rebuild utilities.
- `internal/artifacts`: manifest and hash helpers for reproducible outputs.
