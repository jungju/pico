# Pico V1 Asset Naming

이 문서는 v1 stage data와 asset 파일 이름을 예측 가능하게 유지하기 위한
규칙이다.

## Directory Rules

- Find & Learn content JSON and paired images stay in `contents/`.
- Built-in v1 game data lives under `src/games/<game>/stages/`.
- Public preview, scene, card, and small game images live under
  `public/assets/`.
- Optional audio files live under `public/assets/audio/`.

## Stage IDs

Stage IDs use this shape:

```text
<game-prefix>_<theme>_<number>
```

Examples:

- `spot_playground_001`
- `hidden_picnic_001`
- `maze_garden_001`
- `memory_animals_001`

## Asset Names

Preview and primary scene assets use the stage ID:

```text
public/assets/<stage-id>.<ext>
public/assets/<stage-id>-preview.<ext>
```

Use specific suffixes when one stage needs multiple images:

```text
public/assets/<stage-id>-scene.png
public/assets/<stage-id>-card-<word>.svg
public/assets/<stage-id>-target-<word>.png
```

Small reusable card images may use a shared family prefix:

```text
public/assets/memory-animal-cat.svg
public/assets/memory-animal-dog.svg
```

Generated families may use an underscore stage ID stem when the stage ID already
uses underscores:

```text
public/assets/hidden_classroom_001.svg
public/assets/hidden_market_001.svg
public/assets/maze_classroom_001.svg
public/assets/maze_market_001.svg
public/assets/memory_classroom_001.svg
public/assets/memory-word-pencil.svg
```

Optional audio uses the stage or vocabulary word:

```text
public/assets/audio/<stage-id>-intro.mp3
public/assets/audio/<word>.mp3
```

## File Type Defaults

- Generated or illustrated scene images: `.png`, `.webp`, or `.svg`
- Deterministic card, maze preview, and reusable generated stage assets: `.svg`
- Photos or rich raster art: `.jpg`, `.png`, or `.webp`
- Audio: `.mp3`

## Home Thumbnail Standards

- Home stage thumbnails are square, framed with the shared Pico navy stroke,
  and must stay readable at both 86px mobile and 124px desktop sizes.
- Spot the Difference and Hidden Objects thumbnails use edge-to-edge scene
  framing with the main action kept near the center safe area.
- Maze thumbnails use an inset board preview on a light blue tray so paths,
  walls, start, and goal remain legible instead of looking like a generic
  scene.
- Memory Cards thumbnails use an inset card-table preview on a lavender tray.
  They should show multiple cards and at least one clear face/icon so the asset
  reads as a card game, not a single decorative icon.
- Avoid tiny instructional text in thumbnails. Labels inside the image must
  remain optional; the stage card text owns the title, level, and theme.

## Commit Rules

- Commit only assets referenced by committed stage data or UI.
- Do not commit temporary screenshots, generated variants, or unused source
  images.
- Keep asset filenames lowercase with hyphens, except existing content JSON
  stage IDs that already use underscores.
