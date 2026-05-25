# Pico Specification

## 1. Overview

Pico is a static collection of small English learning games. It stays narrow so
one person can operate it without a service-specific backend.

The first game is Find & Learn:

- Spot the differences between two pictures.
- Click objects to see and hear English words.
- Run on GitHub Pages as a static web game.

## 2. Runtime

- React SPA
- Vite build
- GitHub Pages deployment
- Custom domain: `https://pico.jjgo.io`
- Web Speech API for English audio
- ohmesh registration for future login and progress storage

## 3. Find & Learn Click Contract

The game must not create transparent DOM click layers such as `hit-zone` or
`object-zone`.

Clicking works by:

1. Listening for clicks on each picture container.
2. Converting the click to image-relative percent coordinates.
3. Checking stage `differences` first.
4. Checking stage `objects` second.
5. Treating the click as wrong when neither matches.

Required priority:

```text
difference -> object -> wrong
```

## 4. Stage Data

Stage data is kept separate from rendering and hit testing so it can become JSON
later without changing the game engine.

Current entrypoint:

```text
src/games/findLearn/stages/stage001.js
```

Shape:

```js
{
  id: "stage-001",
  images: {
    original: "/assets/stage-001-original.svg",
    changed: "/assets/stage-001-changed.svg"
  },
  differences: [
    {
      id: "door-color",
      label: "The door is different.",
      marker: { x: 51, y: 67 },
      area: { type: "rect", x: 45, y: 59, w: 12, h: 16 }
    }
  ],
  objects: [
    {
      id: "cat",
      word: "cat",
      meaning: "고양이",
      phonetic: "/kæt/",
      sentence: "The cat is sitting on the grass.",
      translation: "고양이가 잔디 위에 앉아 있어요.",
      area: { type: "rect", x: 8, y: 62, w: 22, h: 20 }
    }
  ]
}
```

All coordinates are 0-100 image-relative percent coordinates:

- `x`
- `y`
- `w`
- `h`
- `r`
- `points`

Supported `area.type` values:

- `circle`
- `rect`
- `polygon`

## 5. Hit Testing

Hit testing functions live in:

```text
src/games/findLearn/hitTesting.js
```

Required functions:

- `getRelativePoint(event, pictureElement)`
- `isPointInArea(point, area)`
- `findDifferenceAt(point, stage, foundDifferenceIds)`
- `findObjectAt(point, stage)`

The React game component keeps wrapper functions named around the requested
flow and calls them from `handlePictureClick(event)`.

## 6. Screen Contract

- Two pictures stay large.
- No original/changed/left/right labels are shown.
- Progress is one row above the pictures.
- Progress text is numeric only, such as `0/6`.
- The English word/dialog panel sits in one compact row below the pictures.
- Correct and wrong markers may be DOM elements.
- Correct and hint markers use `difference.marker`.
- `DEBUG_AREAS` defaults to `false`.
- Debug areas, when enabled, are non-clickable SVG overlays only.

## 7. Operation Rules

- User-facing behavior changes must update this file and `README.md`.
- GitHub Pages deploys from `main` through `.github/workflows/deploy-pages.yml`.
