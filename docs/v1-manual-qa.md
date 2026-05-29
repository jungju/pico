# Pico V1 Manual QA

Date: 2026-05-30

## Commands

- `npm test`: passed, 7 tests.
- `npm run lint`: passed during task validation.
- `npm run build`: passed during task validation.

## Viewport Route Checks

Playwright screenshots were captured for every current v1 stage route at:

- Mobile: `390x844`
- Desktop: `1280x900`

Routes checked:

- `/games/spot_the_difference/spot_kids_bedroom_001`
- `/games/spot_the_difference/spot_picnic_playground_002`
- `/games/spot_the_difference/spot_playground_picnic_001`
- `/games/hidden_objects/hidden_picnic_001`
- `/games/maze/maze_garden_001`
- `/games/memory_cards/memory_animals_001`

Additional narrow viewport checks were captured at `320x740` during mobile
layout QA.

## Completion Coverage

- Spot the Difference hit testing and already-found exclusion are covered by
  `src/games/coreLogic.test.js`.
- Hidden Objects target hit testing and already-found exclusion are covered by
  `src/games/coreLogic.test.js`.
- Maze blocked path, collectible pickup, and goal completion are covered by
  `src/games/coreLogic.test.js`.
- Memory Cards mismatch delay and matched pair logic are covered by
  `src/games/coreLogic.test.js`.

## Result

All v1 stage routes rendered in the tested mobile and desktop viewports, and
core completion logic passed focused tests.

## Selector Library Check

Date: 2026-05-30

The home selector was checked with the full v1 target library of 80 cards.

- `390x844`: 80 cards, one-column list, `9825px` document height, no horizontal
  overflow, network-idle load measured at about `970ms` on the local dev server.
- `1280x900`: 80 cards, two-column grid, `6301px` document height, no horizontal
  overflow, network-idle load measured at about `895ms` on the local dev server.
- Keyboard focus order starts with login, save-progress CTA, Play Today, game
  type filters, Level/Theme/Status filters, then stage cards.
- Today and filter controls expose explicit focus labels such as
  `Show Memory stages, 20` and `Filter by theme`.

## Mobile Browser Chrome Resize Check

Date: 2026-05-30

Playwright viewport resize was used as a proxy for mobile browser chrome height
changes. Each first game route was loaded at `390x844`, then resized to
`390x640`, `390x740`, and `390x844`.

- Spot, Hidden, Maze, and Memory kept `.game-shell` inside the viewport for all
  tested heights.
- No route produced horizontal overflow.
- Learning panel bottom stayed inside the viewport at all tested heights.
- Play area stayed visible above the 80px smoke threshold. At `390x640`, play
  area heights were approximately Spot `285px`, Hidden `402px`, Maze `402px`,
  and Memory `394px`.
