# Pico V1 Visual QA

Use this checklist for every v1 stage and any new asset.

## Image Quality

- Primary image is sharp at mobile and desktop sizes.
- Important objects are not blurred, cropped, or hidden by UI chrome.
- Colors have enough contrast for children to distinguish targets.
- No watermarks, random text, stray logos, or confusing symbols are visible.

## Click And Touch Areas

- Targets are large enough for touch input.
- Hit areas include a forgiving margin around small objects.
- Hit areas do not overlap unrelated targets in a confusing way.
- Wrong clicks provide feedback without punishing the player.

## Framing

- Mobile portrait and small widths keep the main play area visible.
- Desktop layout does not leave the primary game object feeling tiny.
- Stage preview images clearly show the game type and theme.
- Important game content is not covered by the HUD, controls, or dialogs.

## Game-Type Specific Checks

- Spot the Difference: both panels are aligned, visible, and comparable.
- Hidden Objects: every target object can be found without guessing.
- Maze: start, goal, walls, collectibles, and player marker are distinct.
- Memory Cards: card faces are clear and recognizable when opened.

## Required Viewports

- 320px wide mobile
- Common mobile width around 390px
- Tablet width around 768px
- Desktop width around 1280px

## Reusable Screen QA Checklist

Use this checklist when reviewing a route screenshot or a live viewport.

### Viewports

- `320x740`: no horizontal overflow, no clipped Korean/English labels.
- `390x844`: primary play area remains visible without excessive top chrome.
- `768x1024`: tablet layout keeps controls close to the play object.
- `1280x900`: desktop layout does not scatter controls into empty space.

### Routes

- Home selector `/`.
- Spot first stage `/games/spot_the_difference/spot_kids_bedroom_001`.
- Hidden first stage `/games/hidden_objects/hidden_picnic_001`.
- Maze first stage `/games/maze/maze_garden_001`.
- Memory first stage `/games/memory_cards/memory_animals_001`.
- One generated stage from each game type when content changes.

### Global UI

- Game List, Hint, Reset, account, Speak, and completion buttons are at least
  44px high.
- Button labels clearly say the action result.
- Reset requires confirmation and is visually lower priority than Hint.
- Save/local-play status does not compete with score or progress.
- Progress, score, status, and optional game info chips do not wrap awkwardly.
- `prefers-reduced-motion` keeps repeated pulse/pop/nudge motion still.

### Text And Overflow

- Korean titles use word-level wrapping, not character-by-character breaks.
- Long English words fit inside pills/cards/buttons or ellipsize cleanly.
- No text overlaps icons, thumbnails, game boards, or completion dialogs.
- Completion dialog actions remain visible on 320px mobile.

### Completion Dialog

- Celebration, score, primary action, Game List, and Keep Playing/Play Again
  hierarchy is clear.
- Dialog does not cover essential result information without showing a summary.
- Last-stage dialog uses Play Again as the primary action.

### Game-Type Interactions

- Spot: clickable/reference picture affordance is visible, markers scale to the
  target, focus view opens and closes.
- Hidden: target pills do not clip text, found/hint/wrong markers remain visible
  on bright scenes, 7-8 target lists show scroll affordance.
- Maze: start, goal, collectibles, player, walls, visited path, next-step cells,
  and D-pad are visually distinct.
- Memory: card grid rows are balanced, cards are large enough for the viewport,
  card backs look like game cards, match/hint/tries/completion feedback is clear.
