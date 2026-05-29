# Pico V1 Content Set

이 문서는 v1 출시 목표 playable content 수량과 현재 seed stage set을
기록한다.

## Target Set

V1 release requires 20 polished playable stages for each game type.

| Game Type | Target Count | Current Count | Remaining |
| --- | ---: | ---: | ---: |
| Spot the Difference | 20 | 20 | 0 |
| Hidden Objects | 20 | 1 | 19 |
| Maze | 20 | 1 | 19 |
| Memory Cards | 20 | 1 | 19 |
| Total | 80 | 23 | 57 |

## Current Stages

| Game Type | Stage ID | Theme | Level | Targets/Pairs |
| --- | --- | --- | --- | --- |
| Spot the Difference | `spot_beach_day_001` | beach | 2 | 6 differences |
| Spot the Difference | `spot_birthday_table_001` | party | 2 | 6 differences |
| Spot the Difference | `spot_camping_night_001` | camping | 2 | 6 differences |
| Spot the Difference | `spot_classroom_art_001` | classroom | 2 | 6 differences |
| Spot the Difference | `spot_dinosaur_museum_001` | museum | 2 | 6 differences |
| Spot the Difference | `spot_farm_morning_001` | farm | 2 | 6 differences |
| Spot the Difference | `spot_garden_friends_001` | garden | 2 | 6 differences |
| Spot the Difference | `spot_kids_bedroom_001` | bedroom | 3 | 10 differences |
| Spot the Difference | `spot_kitchen_snack_001` | kitchen | 2 | 6 differences |
| Spot the Difference | `spot_library_corner_001` | library | 2 | 6 differences |
| Spot the Difference | `spot_music_room_001` | music | 2 | 6 differences |
| Spot the Difference | `spot_ocean_corner_001` | ocean | 2 | 6 differences |
| Spot the Difference | `spot_picnic_playground_002` | picnic | 3 | 10 differences |
| Spot the Difference | `spot_playground_picnic_001` | playground | 3 | 10 differences |
| Spot the Difference | `spot_rainy_window_001` | rain | 2 | 6 differences |
| Spot the Difference | `spot_snow_play_001` | snow | 2 | 6 differences |
| Spot the Difference | `spot_space_room_001` | space | 2 | 6 differences |
| Spot the Difference | `spot_toy_room_001` | toys | 2 | 6 differences |
| Spot the Difference | `spot_train_station_001` | station | 2 | 6 differences |
| Spot the Difference | `spot_zoo_path_001` | zoo | 2 | 6 differences |
| Hidden Objects | `hidden_picnic_001` | picnic | 1 | 6 targets |
| Maze | `maze_garden_001` | garden | 1 | start, goal, 2 collectibles |
| Memory Cards | `memory_animals_001` | animals | 1 | 4 image-image pairs |

## Asset Coverage

- Hidden Objects uses `public/assets/hidden-picnic-001.png`.
- Maze uses `public/assets/maze-garden-001.svg`.
- Memory Cards uses `public/assets/memory-animals-001.svg` and
  `public/assets/memory-animal-*.svg` card images.
- Spot the Difference content image assets live in `contents/` and may be
  raster images or deterministic SVG scene pairs.

## V1 Acceptance

- Every v1 game type has 20 playable stages.
- Every stage has a stable route through `/games/<game-type>/<stage-id>`.
- Every new v1 game type has a preview image in the selector.
- Level and theme metadata are present for the current v1 stages.
