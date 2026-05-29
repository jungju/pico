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

Optional audio uses the stage or vocabulary word:

```text
public/assets/audio/<stage-id>-intro.mp3
public/assets/audio/<word>.mp3
```

## File Type Defaults

- Generated or illustrated scene images: `.png` or `.webp`
- Deterministic card/maze preview assets: `.svg`
- Photos or rich raster art: `.jpg`, `.png`, or `.webp`
- Audio: `.mp3`

## Commit Rules

- Commit only assets referenced by committed stage data or UI.
- Do not commit temporary screenshots, generated variants, or unused source
  images.
- Keep asset filenames lowercase with hyphens, except existing content JSON
  stage IDs that already use underscores.
