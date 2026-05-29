# Pico Specification

## Document Role

This file is the stable Codex entrypoint for Pico product scope, game contracts,
and deployment contracts. The README remains the human quick-start and
operation guide.

## Source Of Truth

- `README.md`: current user flow, local commands, git rules, and deployment
  guide
- `docs/v1-scope.md`: target scope for Pico v1 games, rewards, persistence,
  and explicit non-goals
- `docs/v1-tasks.md`: implementation backlog derived from the v1 scope
- `contents/*.json`: Find & Learn content stages loaded into the game selector
- `contents/*.{png,jpg,jpeg,webp}`: images paired with content JSON files by
  matching filename stem
- `src/App.jsx`: current game selection page and game registry
- `src/games/gameTypes.js`: stable v1 game type IDs and display metadata
- `src/games/GameShell.jsx`: shared v1 HUD, actions, learning panel, and
  completion dialog shell
- `src/games/points.js`: shared v1 point constants, point event awarding, and
  completion bonus helpers
- `src/games/stageRegistry.js`: shared v1 stage registry with common stage
  metadata
- `src/games/streaks.js`: daily streak date and qualification helpers
- `src/ohmeshAuth.js`: ohmesh login/logout URLs and session checks
- `src/ohmeshProgress.js`: ohmesh user-scoped Find & Learn progress and score
  record helpers, plus v1 Pico progress helpers
- `src/games/findLearn/FindLearnGame.jsx`: Find & Learn rendering, click flow,
  markers, and speech feedback
- `src/games/findLearn/hitTesting.js`: coordinate conversion and area collision
  logic
- `src/games/findLearn/stages/contentStages.js`: content JSON/image loader and
  normalizer
- `src/games/findLearn/stages/stage001.js`: current stage data shape and
  built-in fallback content
- `.github/workflows/deploy-pages.yml`: GitHub Pages build and deployment flow
- `AGENTS.md`: agent workflow, validation, and commit rules

When these files disagree, use `README.md` for user-facing behavior and the
focused source file above for implemented runtime behavior.

## Product Scope

Pico is a static collection of small English learning games. It stays narrow so
one person can operate it without a service-specific backend.

The target v1 scope is documented in `docs/v1-scope.md`. V1 expands Pico from
the current Spot the Difference game into four game types: Spot the Difference,
Hidden Objects, Maze, and Memory Cards. V1 also adds shared points, daily
streak rewards, and cross-game progress persistence for logged-in users.

The first game is `Find & Learn`:

- Opened from the Pico game selection page.
- Loads one card per stage from `contents` when content stages exist.
- Spots the differences between two pictures.
- Lets the user click objects to see and hear English words.
- Runs on GitHub Pages as a static web game.

## Runtime

- React SPA
- Vite build
- GitHub Pages deployment
- Custom domain: `https://pico.jjgo.io`
- Web Speech API for English audio
- ohmesh login through app-scoped HttpOnly session cookies

## Locked User-Facing Behavior

- The first screen is the Pico game selection page.
- The game selection page URL is `/`.
- The game selection page shows the current ohmesh login state and a
  login/logout action.
- The game selection page shows total points and daily streak for logged-in
  users.
- The game selection page shows one card per loaded Find & Learn stage.
- Selecting a stage card opens the game screen for that stage.
- Each stage game screen URL is `/games/<game-type>/<stage-id>`.
- Legacy `/games/<stage-id>` URLs remain recoverable.
- Browser back/forward navigation must keep the selected screen in sync with the
  URL.
- The game screen shows the current ohmesh login state and can return to the
  game selection page.
- Game screen actions use visible command labels for game list navigation,
  hints, reset, login, and logout.
- The Find & Learn game screen uses a low-contrast illustrated background.
- The Find & Learn game screen uses a kid-friendly HUD with a stage badge,
  progress meter, and score chips.
- Two pictures stay side-by-side and shrink to fit the available viewport
  height.
- The picture frames keep a configured minimum size when the viewport allows it.
- No original/changed/left/right labels are shown.
- In content stages, a picture without a side-specific difference or object is
  rendered as a non-clickable reference frame.
- Progress and score are shown in one row above the pictures.
- Progress uses found/total text, such as `0/6`.
- Score uses 100 points per found difference, plus a 200 point completion
  bonus when every difference in the stage is found.
- When logged in, found differences, completion state, and score are saved to
  ohmesh.
- Logged-out game screens show `Local play` and keep progress only in the
  current local play state.
- When all differences are found, a success completion dialog is shown.
- The completion dialog offers `Next` when another stage exists, `Home` to
  return to the game selection page, and `Stay` to close the dialog.
- The English word/dialog panel sits in one compact row below the pictures.
- Correct and wrong markers may be DOM elements.
- Correct and hint markers use `difference.marker`.
- Correct difference clicks speak English feedback such as `Correct`.
- Wrong clicks speak English feedback such as `Wrong`.
- Object clicks speak the English word and sentence.
- `DEBUG_AREAS` defaults to `false`.
- Debug areas, when enabled, are non-clickable SVG overlays only.

## Find & Learn Click Contract

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

## Stage Data

Stage data is kept separate from rendering and hit testing so it can become JSON
later without changing the game engine.

Primary content entrypoint:

```text
contents/*.json
```

Each content JSON file must have a same-stem image beside it:

```text
contents/spot_playground_001.json
contents/spot_playground_001.png
```

Supported image extensions:

- `.png`
- `.jpg`
- `.jpeg`
- `.webp`

Content images may contain the two comparison panels in one image. The current
content contract uses a left and right panel inside the same bitmap.

Content shape:

```js
{
  id: "spot_playground_001",
  title: "Playground",
  titleKo: "놀이터",
  type: "spot_the_difference",
  imageWidth: 1448,
  imageHeight: 1086,
  hitPadding: 24,
  totalDifferences: 6,
  panels: {
    left: { x: 0, y: 0, width: 724, height: 1086 },
    right: { x: 724, y: 0, width: 724, height: 1086 }
  },
  differences: [
    {
      id: "tree_apples",
      label: "apple tree",
      labelKo: "사과나무",
      targetSide: "right",
      bbox: { x: 760, y: 90, width: 220, height: 250 },
      hitPadding: 24,
      description: "The tree has apples.",
      descriptionKo: "나무에 사과가 있어요.",
      voiceText: "Apples are growing on the tree.",
      translation: "사과가 나무에서 자라고 있어요."
    }
  ]
}
```

Content `bbox` coordinates are pixel coordinates against the full source image.
`targetSide` decides which panel can receive the correct click. At runtime,
`contentStages.js` converts `bbox` into panel-relative percent `areaBySide` and
`markerBySide` data for hit testing and markers.

Content hit testing expands each `bbox` by a default `24` pixels on every side,
clamped to the target panel. A numeric top-level `hitPadding` overrides the
stage default, and a numeric difference-level `hitPadding` overrides that
specific difference. Use `0` when a difference must be exact. Markers remain
centered on the original `bbox`, not the expanded hit area.

Built-in fallback entrypoint:

```text
src/games/findLearn/stages/stage001.js
```

Fallback shape:

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

Fallback coordinates are 0-100 image-relative percent coordinates:

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

## Hit Testing

Hit testing functions live in:

```text
src/games/findLearn/hitTesting.js
```

Required functions:

- `getRelativePoint(event, pictureElement)`
- `isPointInArea(point, area)`
- `findDifferenceAt(point, stage, foundDifferenceIds, side)`
- `findObjectAt(point, stage, side)`
- `getDifferenceArea(difference, side)`
- `getDifferenceMarker(difference, side)`

The React game component keeps wrapper functions named around the requested
flow and calls them from `handlePictureClick(event, side)`.

## Data Contract

- Current click state is React state during play.
- Logged-in Find & Learn progress is saved through ohmesh app records.
- App slug for ohmesh integration: `pico`
- Default ohmesh base URL: `https://ohmesh.jjgo.io`
- Login redirects to `GET /login?app=pico&redirect_url={current_app_url}`.
- Logout redirects to `GET /logout?app=pico&redirect_url={current_app_url}`.
- Session checks call `GET /auth/me?app=pico` with `credentials: "include"`.
- The current app URL used as `redirect_url` excludes hash fragments and removes
  ohmesh result query parameters before redirecting.
- Progress storage uses one `find-learn-progress` record scoped to the current
  ohmesh user and app.
- The progress record shape is:

```js
{
  version: 1,
  stages: {
    [stageId]: {
      stageId: "spot_playground_001",
      foundIds: ["tree_apples"],
      completed: false,
      score: 100,
      totalDifferences: 6,
      completedAt: null,
      updatedAt: "2026-05-25T00:00:00.000Z"
    }
  }
}
```

- Pico must not store OAuth tokens, refresh tokens, raw session tokens, or OAuth
  secrets.
- Logged-out progress remains local React state only.
- OAuth secrets do not belong in this repository.

V1 progress helpers also support a `pico-progress` record with `version: 2`,
`totalPoints`, `streak`, `games`, and `stages` fields. Until migration is
complete, the existing `find-learn-progress` record remains readable and can be
merged into the v2 shape.

## Git And Deployment Contract

- Default branch: `main`
- Commit format: Conventional Commits through `scripts/agent-commit.sh`
- Local validation: `npm run lint` and `npm run build`
- Do not commit `dist`, `node_modules`, `.env`, screenshots, or secret files.
- GitHub Pages source: GitHub Actions
- Workflow: `.github/workflows/deploy-pages.yml`
- Workflow triggers: `main` push and `workflow_dispatch`
- Workflow build steps: `npm ci`, `npm run lint`, `npm run build`
- Pages artifact path: `dist`
- Custom domain: `public/CNAME` with `pico.jjgo.io`
- SPA fallback: `public/404.html`
- Version metadata: `scripts/write-version.mjs` writes `dist/version.json`
- Local `gh-pages` branch publishing is not used.

## Update Rules

- User-facing flow, controls, speech behavior, or game rules must update this
  file and `README.md`.
- Stage data or hit testing changes must update the relevant contract sections.
- GitHub Pages, custom domain, version metadata, or fallback changes must update
  `README.md` and `AGENTS.md`.
