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
- `docs/v1-assets.md`: v1 stage data and asset naming convention
- `docs/v1-content.md`: v1 target stage count and current seed stage inventory
- `docs/v1-vocabulary-qa.md`: v1 vocabulary and sentence QA checklist
- `docs/v1-visual-qa.md`: v1 visual asset, hit area, and viewport QA
  checklist
- `docs/v1-korean-copy.md`: v1 Korean helper copy review
- `docs/v1-manual-qa.md`: v1 stage route and completion QA results
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
- `src/ohmeshProgress.js`: ohmesh user-scoped v1 Pico progress helpers and
  Find & Learn legacy progress helpers
- `src/games/findLearn/FindLearnGame.jsx`: Find & Learn rendering, click flow,
  markers, and speech feedback
- `src/games/findLearn/hitTesting.js`: coordinate conversion and area collision
  logic
- `src/games/findLearn/stages/contentStages.js`: content JSON/image loader and
  normalizer
- `src/games/findLearn/stages/stage001.js`: current stage data shape and
  built-in fallback content
- `src/games/hiddenObjects/HiddenObjectsGame.jsx`: Hidden Objects scene,
  target list, marker UI, and completion flow
- `src/games/hiddenObjects/hitTesting.js`: Hidden Objects target collision
  helpers
- `src/games/hiddenObjects/stages/schema.js`: Hidden Objects stage schema and
  normalizer
- `src/games/hiddenObjects/stages/stage001.js`: v1 Hidden Objects picnic stage
  content
- `src/games/maze/MazeGame.jsx`: Maze grid board, player marker, movement
  buttons, and completion UI
- `src/games/maze/engine.js`: Maze movement, pointer/touch cell conversion,
  collectible pickup, and completion helpers
- `src/games/maze/stages/schema.js`: grid-based Maze stage schema and
  normalizer
- `src/games/maze/stages/stage001.js`: v1 Maze garden stage content
- `src/games/memoryCards/MemoryCardsGame.jsx`: Memory Cards responsive card
  grid, face rendering, matching UI, and completion flow
- `src/games/memoryCards/engine.js`: Memory Cards deck creation, flipping,
  matching, mismatch delay state, attempts, and completion helpers
- `src/games/memoryCards/stages/schema.js`: Memory Cards stage schema and
  normalizer
- `src/games/memoryCards/stages/stage001.js`: v1 Memory Cards animal
  image-image stage content
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
streak rewards, and cross-game progress persistence for logged-in users. The v1
release content target is 20 stages per game type, 80 playable stages total.

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
- The game selection page shows one card per loaded stage.
- The game selection page includes v1 Hidden Objects, Maze, and Memory Cards
  stages.
- Selecting a stage card opens the game screen for that stage.
- Each stage game screen URL is `/games/<game-type>/<stage-id>`.
- The first Hidden Objects stage URL is
  `/games/hidden_objects/hidden_picnic_001`.
- The first Maze stage URL is `/games/maze/maze_garden_001`.
- The first Memory Cards stage URL is
  `/games/memory_cards/memory_animals_001`.
- Legacy `/games/<stage-id>` URLs remain recoverable.
- Browser back/forward navigation must keep the selected screen in sync with the
  URL.
- The game screen shows the current ohmesh login state and can return to the
  game selection page.
- Game screen actions use visible command labels for game list navigation,
  hints, reset, login, and logout.
- When a player is idle on an unfinished stage, the hint action is gently
  emphasized without blocking play.
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
- Correct, match, collectible, and completion feedback uses short visual and/or
  speech responses.
- V1 game screens do not show countdown timers or time-pressure UI.
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

## Hidden Objects Stage Data

Hidden Objects stages use a single scene image and a list of targets. Target
areas use 0-100 image-relative percent coordinates so the game can stay
responsive across viewport sizes.

Shape:

```js
{
  id: "hidden_picnic_001",
  title: "Picnic Search",
  titleKo: "소풍 숨은그림",
  theme: "picnic",
  level: 1,
  estimatedMinutes: 3,
  scene: {
    image: "/assets/hidden-picnic-001.png",
    width: 1200,
    height: 800,
    alt: "A bright picnic scene"
  },
  targets: [
    {
      id: "apple",
      word: "apple",
      meaning: "사과",
      phonetic: "/ˈæpəl/",
      sentence: "I found an apple.",
      translation: "사과를 찾았어요.",
      area: { type: "rect", x: 22, y: 62, w: 8, h: 9 },
      marker: { x: 26, y: 66.5 },
      hint: "Look near the picnic blanket."
    }
  ]
}
```

Supported target `area.type` values:

- `circle`
- `rect`
- `polygon`

Hidden Objects hit testing uses `getRelativePoint` and `isPointInArea` from the
Find & Learn coordinate helpers. `findHiddenTargetAt(point, stage,
foundTargetIds)` returns the first un-found target whose area contains the
point, or `null`.

The Hidden Objects UI must provide one large clickable scene, a target list,
found markers, hint markers, progress text, score, reset, learning feedback,
and the shared completion dialog.

Hidden Objects hints emphasize one remaining target in the scene and target
list without marking it as found.

Hidden Objects scoring uses 100 points per found target, plus a 200 point
completion bonus when every target in the stage is found.

The v1 Hidden Objects content set includes `hidden_picnic_001`, a level 1
picnic scene with apple, kite, book, spoon, duck, and ball targets.

## Maze Stage Data

Maze stages use grid data for movement and completion. `#` means blocked, `.`
means walkable, and `S`/`G` can mark start and goal cells.

Shape:

```js
{
  id: "maze_garden_001",
  title: "Garden Maze",
  titleKo: "정원 미로",
  theme: "garden",
  level: 1,
  estimatedMinutes: 3,
  themeImage: "/assets/maze-garden-001.png",
  grid: [
    "S....",
    ".###.",
    "...#.",
    ".#...",
    "...#G"
  ],
  start: { row: 0, col: 0 },
  goal: { row: 4, col: 4 },
  obstacles: [{ row: 1, col: 1 }],
  collectibles: [
    { id: "star", row: 2, col: 1, word: "star", meaning: "별", points: 50 }
  ]
}
```

The schema normalizer exposes `grid.rows`, `grid.columns`, normalized
`obstacles`, and normalized `collectibles`.

Maze movement is handled by `src/games/maze/engine.js`. The engine supports
directional movement, adjacent-cell pointer/touch movement, blocked move
results, collectible pickup, visited cell tracking, and completion when the
player reaches the goal cell.

Blocked maze moves are soft failures. The player state stays on the previous
cell, and the result includes feedback that can nudge the player to try another
path.

The Maze UI must provide a grid board, start cell, goal cell, player marker,
optional collectibles, progress text, score, reset, learning feedback, movement
buttons, pointer/touch adjacent-cell movement, and the shared completion dialog.

Maze scoring uses 300 points when the player reaches the goal, plus 50 points
per collected item by default. A collectible may override its own `points`.

The v1 Maze content set includes `maze_garden_001`, a level 1 garden maze with
a clear start, goal, and two optional collectible cells.

## Memory Cards Stage Data

Memory Cards stages use card pairs. Each pair has two card faces and shared
vocabulary metadata.

Shape:

```js
{
  id: "memory_animals_001",
  title: "Animal Match",
  titleKo: "동물 카드",
  theme: "animals",
  level: 1,
  estimatedMinutes: 3,
  matchMode: "image_image",
  pairs: [
    {
      id: "cat",
      word: "cat",
      meaning: "고양이",
      phonetic: "/kæt/",
      sentence: "The cat is cute.",
      translation: "고양이가 귀여워요.",
      cardFaces: [
        { id: "cat-a", type: "image", emoji: "cat", alt: "Cat card" },
        { id: "cat-b", type: "image", emoji: "cat", alt: "Cat card" }
      ]
    }
  ]
}
```

Supported match modes:

- `image_image`
- `image_word`
- `word_audio`

Memory Cards engine behavior:

- Creates a deterministic shuffled deck from stage pairs.
- Opens one card at a time.
- Records one attempt when the second card is opened.
- Adds a pair to `matchedPairIds` when the two open cards share `pairId`.
- Keeps mismatched cards open and returns `needsMismatchDelay` so UI can close
  them after a short delay.
- Sets `completed` when every pair is matched.

The Memory Cards UI uses a responsive square-card grid that supports 4, 6, 8,
and 12 pairs without changing card aspect ratio.

Opening a Memory card speaks the English word and optional sentence. Matching a
pair speaks a short English match or completion feedback.

Memory Cards scoring uses 100 points per matched pair, plus a 200 point
completion bonus when every pair in the stage is matched.

The v1 Memory Cards content set includes `memory_animals_001`, a level 1
image-image animal matching stage with cat, dog, bird, and fish pairs.

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
- V1 cross-game progress storage uses one `pico-progress` record scoped to the
  current ohmesh user and app.
- The v1 progress record stores `totalPoints`, `streak`, game summaries, stage
  scores, completed state, awarded point events, and completion bonus state.
- Find & Learn still writes one legacy `find-learn-progress` record so existing
  found difference IDs and detailed progress remain readable.
- The legacy Find & Learn progress record shape is:

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
      hintUsed: false,
      hintCount: 0,
      lastHintAt: null,
      completedAt: null,
      updatedAt: "2026-05-25T00:00:00.000Z"
    }
  }
}
```

- Pico must not store OAuth tokens, refresh tokens, raw session tokens, or OAuth
  secrets.
- Logged-out progress remains local React state only.
- Find & Learn hint usage is recorded as `hintUsed`, `hintCount`, and
  `lastHintAt` without reducing the stage score.
- OAuth secrets do not belong in this repository.

V1 game events award points through `src/games/points.js`. Logged-in point
events and stage completion update `pico-progress`, qualify the daily visit
when appropriate, and award the daily streak reward at most once per local day.
The existing `find-learn-progress` record remains readable and can be merged
into the v2 shape.

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
