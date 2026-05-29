import { defineMazeStage } from "./schema.js";

const generatedMazeStageDefinitions = [
  {
    "id": "maze_classroom_001",
    "title": "Classroom Maze",
    "titleKo": "교실 미로",
    "theme": "classroom",
    "level": 1,
    "estimatedMinutes": 3,
    "themeImage": "/assets/maze_classroom_001.svg",
    "grid": [
      "S....#.",
      "####.#.",
      ".....#.",
      ".#####.",
      ".#...#.",
      ".#.#.#.",
      "...#..G"
    ],
    "collectibles": [
      {
        "id": "star-1",
        "row": 2,
        "col": 2,
        "word": "star",
        "meaning": "별",
        "points": 50
      },
      {
        "id": "gem-2",
        "row": 5,
        "col": 0,
        "word": "gem",
        "meaning": "보석",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_kitchen_001",
    "title": "Kitchen Maze",
    "titleKo": "부엌 미로",
    "theme": "kitchen",
    "level": 1,
    "estimatedMinutes": 3,
    "themeImage": "/assets/maze_kitchen_001.svg",
    "grid": [
      "S......",
      "######.",
      ".#.....",
      ".#.####",
      ".#.#...",
      ".#.#.#.",
      ".....#G"
    ],
    "collectibles": [
      {
        "id": "gem-1",
        "row": 2,
        "col": 4,
        "word": "gem",
        "meaning": "보석",
        "points": 50
      },
      {
        "id": "key-2",
        "row": 5,
        "col": 2,
        "word": "key",
        "meaning": "열쇠",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_playground_001",
    "title": "Playground Maze",
    "titleKo": "놀이터 미로",
    "theme": "playground",
    "level": 1,
    "estimatedMinutes": 3,
    "themeImage": "/assets/maze_playground_001.svg",
    "grid": [
      "S......",
      "######.",
      ".....#.",
      ".#.###.",
      ".#...#.",
      ".###.#.",
      "...#..G"
    ],
    "collectibles": [
      {
        "id": "key-1",
        "row": 2,
        "col": 4,
        "word": "key",
        "meaning": "열쇠",
        "points": 50
      },
      {
        "id": "coin-2",
        "row": 5,
        "col": 4,
        "word": "coin",
        "meaning": "동전",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_toy_room_001",
    "title": "Toy Room Maze",
    "titleKo": "장난감 방 미로",
    "theme": "toys",
    "level": 1,
    "estimatedMinutes": 3,
    "themeImage": "/assets/maze_toy_room_001.svg",
    "grid": [
      "S..#...",
      "##.#.#.",
      ".#.#.#.",
      ".#.###.",
      ".#.#...",
      ".#.#.#.",
      ".....#G"
    ],
    "collectibles": [
      {
        "id": "coin-1",
        "row": 3,
        "col": 0,
        "word": "coin",
        "meaning": "동전",
        "points": 50
      },
      {
        "id": "heart-2",
        "row": 5,
        "col": 6,
        "word": "heart",
        "meaning": "하트",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_zoo_001",
    "title": "Zoo Maze",
    "titleKo": "동물원 미로",
    "theme": "zoo",
    "level": 1,
    "estimatedMinutes": 3,
    "themeImage": "/assets/maze_zoo_001.svg",
    "grid": [
      "S....#.",
      "####.#.",
      "...#...",
      "##.###.",
      "...#...",
      ".###.##",
      "......G"
    ],
    "collectibles": [
      {
        "id": "heart-1",
        "row": 3,
        "col": 2,
        "word": "heart",
        "meaning": "하트",
        "points": 50
      },
      {
        "id": "leaf-2",
        "row": 6,
        "col": 1,
        "word": "leaf",
        "meaning": "잎",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_beach_001",
    "title": "Beach Maze",
    "titleKo": "해변 미로",
    "theme": "beach",
    "level": 1,
    "estimatedMinutes": 3,
    "themeImage": "/assets/maze_beach_001.svg",
    "grid": [
      "S....#.",
      "####.#.",
      "...#.#.",
      "##.#.#.",
      "...#.#.",
      ".###.#.",
      "......G"
    ],
    "collectibles": [
      {
        "id": "leaf-1",
        "row": 3,
        "col": 6,
        "word": "leaf",
        "meaning": "잎",
        "points": 50
      },
      {
        "id": "star-2",
        "row": 6,
        "col": 2,
        "word": "star",
        "meaning": "별",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_space_001",
    "title": "Space Maze",
    "titleKo": "우주 미로",
    "theme": "space",
    "level": 1,
    "estimatedMinutes": 3,
    "themeImage": "/assets/maze_space_001.svg",
    "grid": [
      "S..#...",
      "##.###.",
      ".#.....",
      ".#####.",
      ".......",
      ".######",
      "......G"
    ],
    "collectibles": [
      {
        "id": "star-1",
        "row": 4,
        "col": 0,
        "word": "star",
        "meaning": "별",
        "points": 50
      },
      {
        "id": "gem-2",
        "row": 6,
        "col": 3,
        "word": "gem",
        "meaning": "보석",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_museum_001",
    "title": "Museum Maze",
    "titleKo": "박물관 미로",
    "theme": "museum",
    "level": 1,
    "estimatedMinutes": 3,
    "themeImage": "/assets/maze_museum_001.svg",
    "grid": [
      "S....#.",
      "####.#.",
      "...#.#.",
      ".#.#.#.",
      ".#.#...",
      ".#.###.",
      ".#....G"
    ],
    "collectibles": [
      {
        "id": "gem-1",
        "row": 4,
        "col": 0,
        "word": "gem",
        "meaning": "보석",
        "points": 50
      },
      {
        "id": "key-2",
        "row": 6,
        "col": 4,
        "word": "key",
        "meaning": "열쇠",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_rainy_day_001",
    "title": "Rainy Day Maze",
    "titleKo": "비 오는 날 미로",
    "theme": "rain",
    "level": 2,
    "estimatedMinutes": 4,
    "themeImage": "/assets/maze_rainy_day_001.svg",
    "grid": [
      "S....#...",
      "####.###.",
      "...#.#...",
      ".###.#.##",
      ".....#...",
      ".#######.",
      ".#.....#.",
      ".###.#.#.",
      ".....#..G"
    ],
    "collectibles": [
      {
        "id": "key-1",
        "row": 4,
        "col": 4,
        "word": "key",
        "meaning": "열쇠",
        "points": 50
      },
      {
        "id": "coin-2",
        "row": 8,
        "col": 0,
        "word": "coin",
        "meaning": "동전",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_library_001",
    "title": "Library Maze",
    "titleKo": "도서관 미로",
    "theme": "library",
    "level": 2,
    "estimatedMinutes": 4,
    "themeImage": "/assets/maze_library_001.svg",
    "grid": [
      "S..#.....",
      "##.#####.",
      ".#.....#.",
      ".#####.#.",
      ".....#...",
      ".#.#####.",
      ".#.#...#.",
      ".###.#.#.",
      ".....#..G"
    ],
    "collectibles": [
      {
        "id": "coin-1",
        "row": 4,
        "col": 6,
        "word": "coin",
        "meaning": "동전",
        "points": 50
      },
      {
        "id": "heart-2",
        "row": 8,
        "col": 1,
        "word": "heart",
        "meaning": "하트",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_camping_001",
    "title": "Camping Maze",
    "titleKo": "캠핑 미로",
    "theme": "camping",
    "level": 2,
    "estimatedMinutes": 4,
    "themeImage": "/assets/maze_camping_001.svg",
    "grid": [
      "S..#.....",
      "##.#.###.",
      "...#.#.#.",
      ".###.#.#.",
      ".#...#...",
      ".#.###.##",
      ".#.#.#.#.",
      ".#.#.#.#.",
      "...#....G"
    ],
    "collectibles": [
      {
        "id": "heart-1",
        "row": 4,
        "col": 7,
        "word": "heart",
        "meaning": "하트",
        "points": 50
      },
      {
        "id": "leaf-2",
        "row": 8,
        "col": 2,
        "word": "leaf",
        "meaning": "잎",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_music_room_001",
    "title": "Music Room Maze",
    "titleKo": "음악 방 미로",
    "theme": "music",
    "level": 2,
    "estimatedMinutes": 4,
    "themeImage": "/assets/maze_music_room_001.svg",
    "grid": [
      "S........",
      "########.",
      ".......#.",
      ".#######.",
      ".........",
      ".########",
      ".#...#...",
      ".#.#.###.",
      "...#....G"
    ],
    "collectibles": [
      {
        "id": "leaf-1",
        "row": 4,
        "col": 7,
        "word": "leaf",
        "meaning": "잎",
        "points": 50
      },
      {
        "id": "star-2",
        "row": 8,
        "col": 4,
        "word": "star",
        "meaning": "별",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_snow_001",
    "title": "Snow Maze",
    "titleKo": "눈 놀이 미로",
    "theme": "snow",
    "level": 2,
    "estimatedMinutes": 4,
    "themeImage": "/assets/maze_snow_001.svg",
    "grid": [
      "S........",
      "########.",
      "...#...#.",
      ".#.#.#.#.",
      ".#...#.#.",
      ".#####.#.",
      "...#.#.#.",
      "##.#.#.#.",
      ".....#..G"
    ],
    "collectibles": [
      {
        "id": "star-1",
        "row": 5,
        "col": 0,
        "word": "star",
        "meaning": "별",
        "points": 50
      },
      {
        "id": "gem-2",
        "row": 8,
        "col": 4,
        "word": "gem",
        "meaning": "보석",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_farm_001",
    "title": "Farm Maze",
    "titleKo": "농장 미로",
    "theme": "farm",
    "level": 2,
    "estimatedMinutes": 4,
    "themeImage": "/assets/maze_farm_001.svg",
    "grid": [
      "S........",
      "########.",
      ".......#.",
      ".#######.",
      "...#.....",
      ".#.#.####",
      ".#.#.#...",
      ".#.#.#.#.",
      ".#.....#G"
    ],
    "collectibles": [
      {
        "id": "gem-1",
        "row": 5,
        "col": 2,
        "word": "gem",
        "meaning": "보석",
        "points": 50
      },
      {
        "id": "key-2",
        "row": 8,
        "col": 5,
        "word": "key",
        "meaning": "열쇠",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_birthday_001",
    "title": "Birthday Maze",
    "titleKo": "생일 미로",
    "theme": "party",
    "level": 2,
    "estimatedMinutes": 4,
    "themeImage": "/assets/maze_birthday_001.svg",
    "grid": [
      "S........",
      "########.",
      "...#.....",
      ".#.#.####",
      ".#.#.....",
      "##.#####.",
      "...#.....",
      ".###.####",
      "........G"
    ],
    "collectibles": [
      {
        "id": "key-1",
        "row": 6,
        "col": 0,
        "word": "key",
        "meaning": "열쇠",
        "points": 50
      },
      {
        "id": "coin-2",
        "row": 8,
        "col": 7,
        "word": "coin",
        "meaning": "동전",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_ocean_001",
    "title": "Ocean Maze",
    "titleKo": "바다 미로",
    "theme": "ocean",
    "level": 2,
    "estimatedMinutes": 4,
    "themeImage": "/assets/maze_ocean_001.svg",
    "grid": [
      "S....#...",
      "####.#.#.",
      "...#.#.#.",
      ".#.#.###.",
      ".#.#.#...",
      ".###.#.#.",
      ".....#.#.",
      ".#####.#.",
      ".......#G"
    ],
    "collectibles": [
      {
        "id": "coin-1",
        "row": 6,
        "col": 0,
        "word": "coin",
        "meaning": "동전",
        "points": 50
      },
      {
        "id": "heart-2",
        "row": 8,
        "col": 6,
        "word": "heart",
        "meaning": "하트",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_station_001",
    "title": "Station Maze",
    "titleKo": "기차역 미로",
    "theme": "station",
    "level": 3,
    "estimatedMinutes": 4,
    "themeImage": "/assets/maze_station_001.svg",
    "grid": [
      "S........",
      "########.",
      "...#...#.",
      ".#.#.#.#.",
      ".#.#.#.#.",
      ".#.#.#.#.",
      ".#.#.#...",
      ".#.#.####",
      ".#......G"
    ],
    "collectibles": [
      {
        "id": "heart-1",
        "row": 5,
        "col": 6,
        "word": "heart",
        "meaning": "하트",
        "points": 50
      },
      {
        "id": "leaf-2",
        "row": 8,
        "col": 2,
        "word": "leaf",
        "meaning": "잎",
        "points": 50
      },
      {
        "id": "star-3",
        "row": 8,
        "col": 7,
        "word": "star",
        "meaning": "별",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_doctor_001",
    "title": "Doctor Kit Maze",
    "titleKo": "병원 놀이 미로",
    "theme": "doctor",
    "level": 3,
    "estimatedMinutes": 4,
    "themeImage": "/assets/maze_doctor_001.svg",
    "grid": [
      "S....#...",
      "####.#.#.",
      "...#...#.",
      ".#.#####.",
      ".#.#...#.",
      ".#.#.#.#.",
      ".#...#.#.",
      ".#####.#.",
      ".....#..G"
    ],
    "collectibles": [
      {
        "id": "leaf-1",
        "row": 5,
        "col": 8,
        "word": "leaf",
        "meaning": "잎",
        "points": 50
      },
      {
        "id": "star-2",
        "row": 8,
        "col": 2,
        "word": "star",
        "meaning": "별",
        "points": 50
      },
      {
        "id": "gem-3",
        "row": 8,
        "col": 7,
        "word": "gem",
        "meaning": "보석",
        "points": 50
      }
    ]
  },
  {
    "id": "maze_market_001",
    "title": "Market Maze",
    "titleKo": "시장 미로",
    "theme": "market",
    "level": 3,
    "estimatedMinutes": 4,
    "themeImage": "/assets/maze_market_001.svg",
    "grid": [
      "S........",
      "########.",
      ".........",
      ".########",
      ".........",
      "########.",
      "...#...#.",
      ".###.#.#.",
      ".....#..G"
    ],
    "collectibles": [
      {
        "id": "star-1",
        "row": 6,
        "col": 2,
        "word": "star",
        "meaning": "별",
        "points": 50
      },
      {
        "id": "gem-2",
        "row": 8,
        "col": 3,
        "word": "gem",
        "meaning": "보석",
        "points": 50
      },
      {
        "id": "key-3",
        "row": 8,
        "col": 7,
        "word": "key",
        "meaning": "열쇠",
        "points": 50
      }
    ]
  }
];

export const generatedMazeStages = generatedMazeStageDefinitions.map(defineMazeStage);
