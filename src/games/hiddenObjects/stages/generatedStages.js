import { defineHiddenObjectsStage } from "./schema.js";

const generatedHiddenStageDefinitions = [
  {
    "id": "hidden_classroom_001",
    "title": "Classroom Hunt",
    "titleKo": "교실 찾기",
    "theme": "classroom",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_classroom_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Classroom Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "pencil",
        "word": "pencil",
        "meaning": "연필",
        "sentence": "I found the pencil.",
        "translation": "연필 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I found the book.",
        "translation": "책 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I found the star.",
        "translation": "별 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "apple",
        "word": "apple",
        "meaning": "사과",
        "sentence": "I found the apple.",
        "translation": "사과 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "backpack",
        "word": "backpack",
        "meaning": "가방",
        "sentence": "I found the backpack.",
        "translation": "가방 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "paintbrush",
        "word": "paint brush",
        "meaning": "붓",
        "sentence": "I found the paint brush.",
        "translation": "붓 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_kitchen_001",
    "title": "Kitchen Hunt",
    "titleKo": "부엌 찾기",
    "theme": "kitchen",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_kitchen_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Kitchen Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "apple",
        "word": "apple",
        "meaning": "사과",
        "sentence": "I found the apple.",
        "translation": "사과 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I found the cup.",
        "translation": "컵 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "cupcake",
        "word": "cupcake",
        "meaning": "컵케이크",
        "sentence": "I found the cupcake.",
        "translation": "컵케이크 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "spoon",
        "word": "spoon",
        "meaning": "숟가락",
        "sentence": "I found the spoon.",
        "translation": "숟가락 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "plate",
        "word": "plate",
        "meaning": "접시",
        "sentence": "I found the plate.",
        "translation": "접시 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "banana",
        "word": "banana",
        "meaning": "바나나",
        "sentence": "I found the banana.",
        "translation": "바나나 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_garden_001",
    "title": "Garden Hunt",
    "titleKo": "정원 찾기",
    "theme": "garden",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_garden_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Garden Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "flower",
        "word": "flower",
        "meaning": "꽃",
        "sentence": "I found the flower.",
        "translation": "꽃 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "butterfly",
        "word": "butterfly",
        "meaning": "나비",
        "sentence": "I found the butterfly.",
        "translation": "나비 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "watering-can",
        "word": "watering can",
        "meaning": "물뿌리개",
        "sentence": "I found the watering can.",
        "translation": "물뿌리개 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "bird",
        "word": "bird",
        "meaning": "새",
        "sentence": "I found the bird.",
        "translation": "새 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "boot",
        "word": "boot",
        "meaning": "장화",
        "sentence": "I found the boot.",
        "translation": "장화 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "bug",
        "word": "bug",
        "meaning": "벌레",
        "sentence": "I found the bug.",
        "translation": "벌레 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_toy_room_001",
    "title": "Toy Room Hunt",
    "titleKo": "장난감 방 찾기",
    "theme": "toys",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_toy_room_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Toy Room Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "robot",
        "word": "robot",
        "meaning": "로봇",
        "sentence": "I found the robot.",
        "translation": "로봇 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "car",
        "word": "toy car",
        "meaning": "장난감 자동차",
        "sentence": "I found the toy car.",
        "translation": "장난감 자동차 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "ball",
        "word": "ball",
        "meaning": "공",
        "sentence": "I found the ball.",
        "translation": "공 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "blocks",
        "word": "blocks",
        "meaning": "블록",
        "sentence": "I found the blocks.",
        "translation": "블록 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "drum",
        "word": "drum",
        "meaning": "북",
        "sentence": "I found the drum.",
        "translation": "북 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "teddy",
        "word": "teddy bear",
        "meaning": "곰인형",
        "sentence": "I found the teddy bear.",
        "translation": "곰인형 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_zoo_001",
    "title": "Zoo Hunt",
    "titleKo": "동물원 찾기",
    "theme": "zoo",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_zoo_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Zoo Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "bird",
        "word": "bird",
        "meaning": "새",
        "sentence": "I found the bird.",
        "translation": "새 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "fish",
        "word": "fish",
        "meaning": "물고기",
        "sentence": "I found the fish.",
        "translation": "물고기 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "leaf",
        "word": "leaf",
        "meaning": "잎",
        "sentence": "I found the leaf.",
        "translation": "잎 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "hat",
        "word": "hat",
        "meaning": "모자",
        "sentence": "I found the hat.",
        "translation": "모자 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "balloon",
        "word": "balloon",
        "meaning": "풍선",
        "sentence": "I found the balloon.",
        "translation": "풍선 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "camera",
        "word": "camera",
        "meaning": "카메라",
        "sentence": "I found the camera.",
        "translation": "카메라 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_beach_001",
    "title": "Beach Hunt",
    "titleKo": "해변 찾기",
    "theme": "beach",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_beach_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Beach Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "umbrella",
        "word": "umbrella",
        "meaning": "우산",
        "sentence": "I found the umbrella.",
        "translation": "우산 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "ball",
        "word": "beach ball",
        "meaning": "비치볼",
        "sentence": "I found the beach ball.",
        "translation": "비치볼 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "boat",
        "word": "boat",
        "meaning": "배",
        "sentence": "I found the boat.",
        "translation": "배 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "shell",
        "word": "shell",
        "meaning": "조개",
        "sentence": "I found the shell.",
        "translation": "조개 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "bucket",
        "word": "bucket",
        "meaning": "양동이",
        "sentence": "I found the bucket.",
        "translation": "양동이 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "fish",
        "word": "fish",
        "meaning": "물고기",
        "sentence": "I found the fish.",
        "translation": "물고기 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_space_room_001",
    "title": "Space Room Hunt",
    "titleKo": "우주 방 찾기",
    "theme": "space",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_space_room_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Space Room Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I found the star.",
        "translation": "별 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "rocket",
        "word": "rocket",
        "meaning": "로켓",
        "sentence": "I found the rocket.",
        "translation": "로켓 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "moon",
        "word": "moon",
        "meaning": "달",
        "sentence": "I found the moon.",
        "translation": "달 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "planet",
        "word": "planet",
        "meaning": "행성",
        "sentence": "I found the planet.",
        "translation": "행성 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "robot",
        "word": "robot",
        "meaning": "로봇",
        "sentence": "I found the robot.",
        "translation": "로봇 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I found the book.",
        "translation": "책 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_museum_001",
    "title": "Museum Hunt",
    "titleKo": "박물관 찾기",
    "theme": "museum",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_museum_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Museum Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "dinosaur",
        "word": "dinosaur",
        "meaning": "공룡",
        "sentence": "I found the dinosaur.",
        "translation": "공룡 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "leaf",
        "word": "leaf",
        "meaning": "잎",
        "sentence": "I found the leaf.",
        "translation": "잎 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "bone",
        "word": "bone",
        "meaning": "뼈",
        "sentence": "I found the bone.",
        "translation": "뼈 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "hat",
        "word": "hat",
        "meaning": "모자",
        "sentence": "I found the hat.",
        "translation": "모자 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "flag",
        "word": "flag",
        "meaning": "깃발",
        "sentence": "I found the flag.",
        "translation": "깃발 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "clock",
        "word": "clock",
        "meaning": "시계",
        "sentence": "I found the clock.",
        "translation": "시계 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_rainy_day_001",
    "title": "Rainy Day Hunt",
    "titleKo": "비 오는 날 찾기",
    "theme": "rain",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_rainy_day_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Rainy Day Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "umbrella",
        "word": "umbrella",
        "meaning": "우산",
        "sentence": "I found the umbrella.",
        "translation": "우산 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "boot",
        "word": "boot",
        "meaning": "장화",
        "sentence": "I found the boot.",
        "translation": "장화 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "cloud",
        "word": "cloud",
        "meaning": "구름",
        "sentence": "I found the cloud.",
        "translation": "구름 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I found the book.",
        "translation": "책 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I found the cup.",
        "translation": "컵 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "sock",
        "word": "sock",
        "meaning": "양말",
        "sentence": "I found the sock.",
        "translation": "양말 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_library_001",
    "title": "Library Hunt",
    "titleKo": "도서관 찾기",
    "theme": "library",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_library_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Library Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I found the book.",
        "translation": "책 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "lamp",
        "word": "lamp",
        "meaning": "램프",
        "sentence": "I found the lamp.",
        "translation": "램프 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "pencil",
        "word": "pencil",
        "meaning": "연필",
        "sentence": "I found the pencil.",
        "translation": "연필 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "clock",
        "word": "clock",
        "meaning": "시계",
        "sentence": "I found the clock.",
        "translation": "시계 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "backpack",
        "word": "backpack",
        "meaning": "가방",
        "sentence": "I found the backpack.",
        "translation": "가방 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I found the star.",
        "translation": "별 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_camping_001",
    "title": "Camping Hunt",
    "titleKo": "캠핑 찾기",
    "theme": "camping",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_camping_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Camping Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "tent",
        "word": "tent",
        "meaning": "텐트",
        "sentence": "I found the tent.",
        "translation": "텐트 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I found the star.",
        "translation": "별 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "moon",
        "word": "moon",
        "meaning": "달",
        "sentence": "I found the moon.",
        "translation": "달 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I found the cup.",
        "translation": "컵 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "fish",
        "word": "fish",
        "meaning": "물고기",
        "sentence": "I found the fish.",
        "translation": "물고기 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "flag",
        "word": "flag",
        "meaning": "깃발",
        "sentence": "I found the flag.",
        "translation": "깃발 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_music_room_001",
    "title": "Music Room Hunt",
    "titleKo": "음악 방 찾기",
    "theme": "music",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_music_room_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Music Room Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "drum",
        "word": "drum",
        "meaning": "북",
        "sentence": "I found the drum.",
        "translation": "북 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I found the star.",
        "translation": "별 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "book",
        "word": "music book",
        "meaning": "악보책",
        "sentence": "I found the music book.",
        "translation": "악보책 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "balloon",
        "word": "balloon",
        "meaning": "풍선",
        "sentence": "I found the balloon.",
        "translation": "풍선 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "robot",
        "word": "robot",
        "meaning": "로봇",
        "sentence": "I found the robot.",
        "translation": "로봇 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "guitar",
        "word": "guitar",
        "meaning": "기타",
        "sentence": "I found the guitar.",
        "translation": "기타 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_snow_001",
    "title": "Snow Hunt",
    "titleKo": "눈 놀이 찾기",
    "theme": "snow",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_snow_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Snow Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "snowman",
        "word": "snowman",
        "meaning": "눈사람",
        "sentence": "I found the snowman.",
        "translation": "눈사람 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "hat",
        "word": "hat",
        "meaning": "모자",
        "sentence": "I found the hat.",
        "translation": "모자 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I found the star.",
        "translation": "별 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "boot",
        "word": "boot",
        "meaning": "장화",
        "sentence": "I found the boot.",
        "translation": "장화 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "scarf",
        "word": "scarf",
        "meaning": "목도리",
        "sentence": "I found the scarf.",
        "translation": "목도리 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "tree",
        "word": "tree",
        "meaning": "나무",
        "sentence": "I found the tree.",
        "translation": "나무 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_farm_001",
    "title": "Farm Hunt",
    "titleKo": "농장 찾기",
    "theme": "farm",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_farm_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Farm Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "apple",
        "word": "apple",
        "meaning": "사과",
        "sentence": "I found the apple.",
        "translation": "사과 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "bird",
        "word": "bird",
        "meaning": "새",
        "sentence": "I found the bird.",
        "translation": "새 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "flower",
        "word": "flower",
        "meaning": "꽃",
        "sentence": "I found the flower.",
        "translation": "꽃 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "bucket",
        "word": "bucket",
        "meaning": "양동이",
        "sentence": "I found the bucket.",
        "translation": "양동이 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "hat",
        "word": "hat",
        "meaning": "모자",
        "sentence": "I found the hat.",
        "translation": "모자 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "carrot",
        "word": "carrot",
        "meaning": "당근",
        "sentence": "I found the carrot.",
        "translation": "당근 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_birthday_001",
    "title": "Birthday Hunt",
    "titleKo": "생일 찾기",
    "theme": "party",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_birthday_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Birthday Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "cupcake",
        "word": "cupcake",
        "meaning": "컵케이크",
        "sentence": "I found the cupcake.",
        "translation": "컵케이크 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "balloon",
        "word": "balloon",
        "meaning": "풍선",
        "sentence": "I found the balloon.",
        "translation": "풍선 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I found the star.",
        "translation": "별 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "gift",
        "word": "gift",
        "meaning": "선물",
        "sentence": "I found the gift.",
        "translation": "선물 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "hat",
        "word": "party hat",
        "meaning": "파티 모자",
        "sentence": "I found the party hat.",
        "translation": "파티 모자 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I found the cup.",
        "translation": "컵 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_ocean_001",
    "title": "Ocean Hunt",
    "titleKo": "바다 찾기",
    "theme": "ocean",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_ocean_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Ocean Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "fish",
        "word": "fish",
        "meaning": "물고기",
        "sentence": "I found the fish.",
        "translation": "물고기 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "shell",
        "word": "shell",
        "meaning": "조개",
        "sentence": "I found the shell.",
        "translation": "조개 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "boat",
        "word": "boat",
        "meaning": "배",
        "sentence": "I found the boat.",
        "translation": "배 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "star",
        "word": "starfish",
        "meaning": "불가사리",
        "sentence": "I found the starfish.",
        "translation": "불가사리 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "bucket",
        "word": "bucket",
        "meaning": "양동이",
        "sentence": "I found the bucket.",
        "translation": "양동이 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "crab",
        "word": "crab",
        "meaning": "게",
        "sentence": "I found the crab.",
        "translation": "게 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_station_001",
    "title": "Station Hunt",
    "titleKo": "기차역 찾기",
    "theme": "station",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_station_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Station Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "train",
        "word": "train",
        "meaning": "기차",
        "sentence": "I found the train.",
        "translation": "기차 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "clock",
        "word": "clock",
        "meaning": "시계",
        "sentence": "I found the clock.",
        "translation": "시계 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "backpack",
        "word": "backpack",
        "meaning": "가방",
        "sentence": "I found the backpack.",
        "translation": "가방 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "flag",
        "word": "flag",
        "meaning": "깃발",
        "sentence": "I found the flag.",
        "translation": "깃발 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I found the book.",
        "translation": "책 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "balloon",
        "word": "balloon",
        "meaning": "풍선",
        "sentence": "I found the balloon.",
        "translation": "풍선 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_doctor_001",
    "title": "Doctor Kit Hunt",
    "titleKo": "병원 놀이 찾기",
    "theme": "doctor",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_doctor_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Doctor Kit Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I found the star.",
        "translation": "별 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I found the book.",
        "translation": "책 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I found the cup.",
        "translation": "컵 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "clock",
        "word": "clock",
        "meaning": "시계",
        "sentence": "I found the clock.",
        "translation": "시계 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "bag",
        "word": "doctor bag",
        "meaning": "의사 가방",
        "sentence": "I found the doctor bag.",
        "translation": "의사 가방 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "heart",
        "word": "heart",
        "meaning": "하트",
        "sentence": "I found the heart.",
        "translation": "하트 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  },
  {
    "id": "hidden_market_001",
    "title": "Market Hunt",
    "titleKo": "시장 찾기",
    "theme": "market",
    "level": 1,
    "estimatedMinutes": 3,
    "scene": {
      "image": "/assets/hidden_market_001.svg",
      "width": 1200,
      "height": 800,
      "alt": "Market Hunt scene with six hidden objects."
    },
    "targets": [
      {
        "id": "apple",
        "word": "apple",
        "meaning": "사과",
        "sentence": "I found the apple.",
        "translation": "사과 찾았어요.",
        "area": {
          "type": "rect",
          "x": 12,
          "y": 18,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper left."
      },
      {
        "id": "banana",
        "word": "banana",
        "meaning": "바나나",
        "sentence": "I found the banana.",
        "translation": "바나나 찾았어요.",
        "area": {
          "type": "rect",
          "x": 42,
          "y": 15,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the top middle."
      },
      {
        "id": "carrot",
        "word": "carrot",
        "meaning": "당근",
        "sentence": "I found the carrot.",
        "translation": "당근 찾았어요.",
        "area": {
          "type": "rect",
          "x": 73,
          "y": 20,
          "w": 12,
          "h": 15
        },
        "hint": "Look near the upper right."
      },
      {
        "id": "bag",
        "word": "bag",
        "meaning": "가방",
        "sentence": "I found the bag.",
        "translation": "가방 찾았어요.",
        "area": {
          "type": "rect",
          "x": 18,
          "y": 56,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the lower left."
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I found the cup.",
        "translation": "컵 찾았어요.",
        "area": {
          "type": "rect",
          "x": 48,
          "y": 57,
          "w": 13,
          "h": 16
        },
        "hint": "Look near the middle."
      },
      {
        "id": "flower",
        "word": "flower",
        "meaning": "꽃",
        "sentence": "I found the flower.",
        "translation": "꽃 찾았어요.",
        "area": {
          "type": "rect",
          "x": 77,
          "y": 66,
          "w": 12,
          "h": 16
        },
        "hint": "Look near the lower right."
      }
    ]
  }
];

export const generatedHiddenObjectStages = generatedHiddenStageDefinitions.map(defineHiddenObjectsStage);
