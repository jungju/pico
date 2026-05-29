# Pico V1 Content Set

이 문서는 v1에 포함되는 최소 playable content set을 기록한다.

## Required Set

V1 requires at least one polished playable stage for each game type.

## Current Stages

| Game Type | Stage ID | Theme | Level | Targets/Pairs |
| --- | --- | --- | --- | --- |
| Spot the Difference | `spot_kids_bedroom_001` | bedroom | 3 | 10 differences |
| Spot the Difference | `spot_picnic_playground_002` | picnic | 3 | 10 differences |
| Spot the Difference | `spot_playground_picnic_001` | playground | 3 | 10 differences |
| Hidden Objects | `hidden_picnic_001` | picnic | 1 | 6 targets |
| Maze | `maze_garden_001` | garden | 1 | start, goal, 2 collectibles |
| Memory Cards | `memory_animals_001` | animals | 1 | 4 image-image pairs |

## Asset Coverage

- Hidden Objects uses `public/assets/hidden-picnic-001.png`.
- Maze uses `public/assets/maze-garden-001.svg`.
- Memory Cards uses `public/assets/memory-animals-001.svg` and
  `public/assets/memory-animal-*.svg` card images.
- Spot the Difference content image assets live in `contents/`.

## V1 Acceptance

- Every v1 game type has at least one playable stage.
- Every stage has a stable route through `/games/<game-type>/<stage-id>`.
- Every new v1 game type has a preview image in the selector.
- Level and theme metadata are present for the current v1 stages.
