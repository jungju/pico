import { defineMemoryCardsStage } from "./schema.js";

const generatedMemoryStageDefinitions = [
  {
    "id": "memory_classroom_001",
    "title": "Classroom Cards",
    "titleKo": "교실 카드",
    "theme": "classroom",
    "level": 1,
    "estimatedMinutes": 3,
    "matchMode": "image_image",
    "previewImage": "/assets/memory_classroom_001.svg",
    "pairs": [
      {
        "id": "pencil",
        "word": "pencil",
        "meaning": "연필",
        "sentence": "I matched the pencil.",
        "translation": "연필 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "pencil-a",
            "type": "image",
            "image": "/assets/memory-word-pencil.svg",
            "alt": "pencil"
          },
          {
            "id": "pencil-b",
            "type": "image",
            "image": "/assets/memory-word-pencil.svg",
            "alt": "pencil"
          }
        ]
      },
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I matched the book.",
        "translation": "책 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "book-a",
            "type": "image",
            "image": "/assets/memory-word-book.svg",
            "alt": "book"
          },
          {
            "id": "book-b",
            "type": "image",
            "image": "/assets/memory-word-book.svg",
            "alt": "book"
          }
        ]
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I matched the star.",
        "translation": "별 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "star-a",
            "type": "image",
            "image": "/assets/memory-word-star.svg",
            "alt": "star"
          },
          {
            "id": "star-b",
            "type": "image",
            "image": "/assets/memory-word-star.svg",
            "alt": "star"
          }
        ]
      },
      {
        "id": "apple",
        "word": "apple",
        "meaning": "사과",
        "sentence": "I matched the apple.",
        "translation": "사과 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "apple-a",
            "type": "image",
            "image": "/assets/memory-word-apple.svg",
            "alt": "apple"
          },
          {
            "id": "apple-b",
            "type": "image",
            "image": "/assets/memory-word-apple.svg",
            "alt": "apple"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_kitchen_001",
    "title": "Kitchen Cards",
    "titleKo": "부엌 카드",
    "theme": "kitchen",
    "level": 1,
    "estimatedMinutes": 3,
    "matchMode": "image_image",
    "previewImage": "/assets/memory_kitchen_001.svg",
    "pairs": [
      {
        "id": "apple",
        "word": "apple",
        "meaning": "사과",
        "sentence": "I matched the apple.",
        "translation": "사과 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "apple-a",
            "type": "image",
            "image": "/assets/memory-word-apple.svg",
            "alt": "apple"
          },
          {
            "id": "apple-b",
            "type": "image",
            "image": "/assets/memory-word-apple.svg",
            "alt": "apple"
          }
        ]
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I matched the cup.",
        "translation": "컵 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "cup-a",
            "type": "image",
            "image": "/assets/memory-word-cup.svg",
            "alt": "cup"
          },
          {
            "id": "cup-b",
            "type": "image",
            "image": "/assets/memory-word-cup.svg",
            "alt": "cup"
          }
        ]
      },
      {
        "id": "cupcake",
        "word": "cupcake",
        "meaning": "컵케이크",
        "sentence": "I matched the cupcake.",
        "translation": "컵케이크 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "cupcake-a",
            "type": "image",
            "image": "/assets/memory-word-cupcake.svg",
            "alt": "cupcake"
          },
          {
            "id": "cupcake-b",
            "type": "image",
            "image": "/assets/memory-word-cupcake.svg",
            "alt": "cupcake"
          }
        ]
      },
      {
        "id": "spoon",
        "word": "spoon",
        "meaning": "숟가락",
        "sentence": "I matched the spoon.",
        "translation": "숟가락 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "spoon-a",
            "type": "image",
            "image": "/assets/memory-word-spoon.svg",
            "alt": "spoon"
          },
          {
            "id": "spoon-b",
            "type": "image",
            "image": "/assets/memory-word-spoon.svg",
            "alt": "spoon"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_garden_001",
    "title": "Garden Cards",
    "titleKo": "정원 카드",
    "theme": "garden",
    "level": 1,
    "estimatedMinutes": 3,
    "matchMode": "image_image",
    "previewImage": "/assets/memory_garden_001.svg",
    "pairs": [
      {
        "id": "flower",
        "word": "flower",
        "meaning": "꽃",
        "sentence": "I matched the flower.",
        "translation": "꽃 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "flower-a",
            "type": "image",
            "image": "/assets/memory-word-flower.svg",
            "alt": "flower"
          },
          {
            "id": "flower-b",
            "type": "image",
            "image": "/assets/memory-word-flower.svg",
            "alt": "flower"
          }
        ]
      },
      {
        "id": "butterfly",
        "word": "butterfly",
        "meaning": "나비",
        "sentence": "I matched the butterfly.",
        "translation": "나비 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "butterfly-a",
            "type": "image",
            "image": "/assets/memory-word-butterfly.svg",
            "alt": "butterfly"
          },
          {
            "id": "butterfly-b",
            "type": "image",
            "image": "/assets/memory-word-butterfly.svg",
            "alt": "butterfly"
          }
        ]
      },
      {
        "id": "watering_can",
        "word": "watering can",
        "meaning": "물뿌리개",
        "sentence": "I matched the watering can.",
        "translation": "물뿌리개 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "watering_can-a",
            "type": "image",
            "image": "/assets/memory-word-watering-can.svg",
            "alt": "watering can"
          },
          {
            "id": "watering_can-b",
            "type": "image",
            "image": "/assets/memory-word-watering-can.svg",
            "alt": "watering can"
          }
        ]
      },
      {
        "id": "bird",
        "word": "bird",
        "meaning": "새",
        "sentence": "I matched the bird.",
        "translation": "새 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "bird-a",
            "type": "image",
            "image": "/assets/memory-word-bird.svg",
            "alt": "bird"
          },
          {
            "id": "bird-b",
            "type": "image",
            "image": "/assets/memory-word-bird.svg",
            "alt": "bird"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_toy_room_001",
    "title": "Toy Room Cards",
    "titleKo": "장난감 방 카드",
    "theme": "toys",
    "level": 1,
    "estimatedMinutes": 3,
    "matchMode": "image_image",
    "previewImage": "/assets/memory_toy_room_001.svg",
    "pairs": [
      {
        "id": "robot",
        "word": "robot",
        "meaning": "로봇",
        "sentence": "I matched the robot.",
        "translation": "로봇 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "robot-a",
            "type": "image",
            "image": "/assets/memory-word-robot.svg",
            "alt": "robot"
          },
          {
            "id": "robot-b",
            "type": "image",
            "image": "/assets/memory-word-robot.svg",
            "alt": "robot"
          }
        ]
      },
      {
        "id": "car",
        "word": "toy car",
        "meaning": "장난감 자동차",
        "sentence": "I matched the toy car.",
        "translation": "장난감 자동차 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "car-a",
            "type": "image",
            "image": "/assets/memory-word-car.svg",
            "alt": "toy car"
          },
          {
            "id": "car-b",
            "type": "image",
            "image": "/assets/memory-word-car.svg",
            "alt": "toy car"
          }
        ]
      },
      {
        "id": "ball",
        "word": "ball",
        "meaning": "공",
        "sentence": "I matched the ball.",
        "translation": "공 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "ball-a",
            "type": "image",
            "image": "/assets/memory-word-ball.svg",
            "alt": "ball"
          },
          {
            "id": "ball-b",
            "type": "image",
            "image": "/assets/memory-word-ball.svg",
            "alt": "ball"
          }
        ]
      },
      {
        "id": "blocks",
        "word": "blocks",
        "meaning": "블록",
        "sentence": "I matched the blocks.",
        "translation": "블록 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "blocks-a",
            "type": "image",
            "image": "/assets/memory-word-blocks.svg",
            "alt": "blocks"
          },
          {
            "id": "blocks-b",
            "type": "image",
            "image": "/assets/memory-word-blocks.svg",
            "alt": "blocks"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_zoo_001",
    "title": "Zoo Cards",
    "titleKo": "동물원 카드",
    "theme": "zoo",
    "level": 1,
    "estimatedMinutes": 3,
    "matchMode": "image_image",
    "previewImage": "/assets/memory_zoo_001.svg",
    "pairs": [
      {
        "id": "bird",
        "word": "bird",
        "meaning": "새",
        "sentence": "I matched the bird.",
        "translation": "새 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "bird-a",
            "type": "image",
            "image": "/assets/memory-word-bird.svg",
            "alt": "bird"
          },
          {
            "id": "bird-b",
            "type": "image",
            "image": "/assets/memory-word-bird.svg",
            "alt": "bird"
          }
        ]
      },
      {
        "id": "fish",
        "word": "fish",
        "meaning": "물고기",
        "sentence": "I matched the fish.",
        "translation": "물고기 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "fish-a",
            "type": "image",
            "image": "/assets/memory-word-fish.svg",
            "alt": "fish"
          },
          {
            "id": "fish-b",
            "type": "image",
            "image": "/assets/memory-word-fish.svg",
            "alt": "fish"
          }
        ]
      },
      {
        "id": "leaf",
        "word": "leaf",
        "meaning": "잎",
        "sentence": "I matched the leaf.",
        "translation": "잎 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "leaf-a",
            "type": "image",
            "image": "/assets/memory-word-leaf.svg",
            "alt": "leaf"
          },
          {
            "id": "leaf-b",
            "type": "image",
            "image": "/assets/memory-word-leaf.svg",
            "alt": "leaf"
          }
        ]
      },
      {
        "id": "hat",
        "word": "hat",
        "meaning": "모자",
        "sentence": "I matched the hat.",
        "translation": "모자 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "hat-a",
            "type": "image",
            "image": "/assets/memory-word-hat.svg",
            "alt": "hat"
          },
          {
            "id": "hat-b",
            "type": "image",
            "image": "/assets/memory-word-hat.svg",
            "alt": "hat"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_beach_001",
    "title": "Beach Cards",
    "titleKo": "해변 카드",
    "theme": "beach",
    "level": 1,
    "estimatedMinutes": 3,
    "matchMode": "image_image",
    "previewImage": "/assets/memory_beach_001.svg",
    "pairs": [
      {
        "id": "umbrella",
        "word": "umbrella",
        "meaning": "우산",
        "sentence": "I matched the umbrella.",
        "translation": "우산 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "umbrella-a",
            "type": "image",
            "image": "/assets/memory-word-umbrella.svg",
            "alt": "umbrella"
          },
          {
            "id": "umbrella-b",
            "type": "image",
            "image": "/assets/memory-word-umbrella.svg",
            "alt": "umbrella"
          }
        ]
      },
      {
        "id": "ball",
        "word": "ball",
        "meaning": "공",
        "sentence": "I matched the ball.",
        "translation": "공 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "ball-a",
            "type": "image",
            "image": "/assets/memory-word-ball.svg",
            "alt": "ball"
          },
          {
            "id": "ball-b",
            "type": "image",
            "image": "/assets/memory-word-ball.svg",
            "alt": "ball"
          }
        ]
      },
      {
        "id": "boat",
        "word": "boat",
        "meaning": "배",
        "sentence": "I matched the boat.",
        "translation": "배 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "boat-a",
            "type": "image",
            "image": "/assets/memory-word-boat.svg",
            "alt": "boat"
          },
          {
            "id": "boat-b",
            "type": "image",
            "image": "/assets/memory-word-boat.svg",
            "alt": "boat"
          }
        ]
      },
      {
        "id": "shell",
        "word": "shell",
        "meaning": "조개",
        "sentence": "I matched the shell.",
        "translation": "조개 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "shell-a",
            "type": "image",
            "image": "/assets/memory-word-shell.svg",
            "alt": "shell"
          },
          {
            "id": "shell-b",
            "type": "image",
            "image": "/assets/memory-word-shell.svg",
            "alt": "shell"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_space_001",
    "title": "Space Cards",
    "titleKo": "우주 카드",
    "theme": "space",
    "level": 1,
    "estimatedMinutes": 3,
    "matchMode": "image_image",
    "previewImage": "/assets/memory_space_001.svg",
    "pairs": [
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I matched the star.",
        "translation": "별 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "star-a",
            "type": "image",
            "image": "/assets/memory-word-star.svg",
            "alt": "star"
          },
          {
            "id": "star-b",
            "type": "image",
            "image": "/assets/memory-word-star.svg",
            "alt": "star"
          }
        ]
      },
      {
        "id": "rocket",
        "word": "rocket",
        "meaning": "로켓",
        "sentence": "I matched the rocket.",
        "translation": "로켓 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "rocket-a",
            "type": "image",
            "image": "/assets/memory-word-rocket.svg",
            "alt": "rocket"
          },
          {
            "id": "rocket-b",
            "type": "image",
            "image": "/assets/memory-word-rocket.svg",
            "alt": "rocket"
          }
        ]
      },
      {
        "id": "moon",
        "word": "moon",
        "meaning": "달",
        "sentence": "I matched the moon.",
        "translation": "달 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "moon-a",
            "type": "image",
            "image": "/assets/memory-word-moon.svg",
            "alt": "moon"
          },
          {
            "id": "moon-b",
            "type": "image",
            "image": "/assets/memory-word-moon.svg",
            "alt": "moon"
          }
        ]
      },
      {
        "id": "planet",
        "word": "planet",
        "meaning": "행성",
        "sentence": "I matched the planet.",
        "translation": "행성 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "planet-a",
            "type": "image",
            "image": "/assets/memory-word-planet.svg",
            "alt": "planet"
          },
          {
            "id": "planet-b",
            "type": "image",
            "image": "/assets/memory-word-planet.svg",
            "alt": "planet"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_museum_001",
    "title": "Museum Cards",
    "titleKo": "박물관 카드",
    "theme": "museum",
    "level": 1,
    "estimatedMinutes": 3,
    "matchMode": "image_image",
    "previewImage": "/assets/memory_museum_001.svg",
    "pairs": [
      {
        "id": "dinosaur",
        "word": "dinosaur",
        "meaning": "공룡",
        "sentence": "I matched the dinosaur.",
        "translation": "공룡 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "dinosaur-a",
            "type": "image",
            "image": "/assets/memory-word-dinosaur.svg",
            "alt": "dinosaur"
          },
          {
            "id": "dinosaur-b",
            "type": "image",
            "image": "/assets/memory-word-dinosaur.svg",
            "alt": "dinosaur"
          }
        ]
      },
      {
        "id": "leaf",
        "word": "leaf",
        "meaning": "잎",
        "sentence": "I matched the leaf.",
        "translation": "잎 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "leaf-a",
            "type": "image",
            "image": "/assets/memory-word-leaf.svg",
            "alt": "leaf"
          },
          {
            "id": "leaf-b",
            "type": "image",
            "image": "/assets/memory-word-leaf.svg",
            "alt": "leaf"
          }
        ]
      },
      {
        "id": "bone",
        "word": "bone",
        "meaning": "뼈",
        "sentence": "I matched the bone.",
        "translation": "뼈 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "bone-a",
            "type": "image",
            "image": "/assets/memory-word-bone.svg",
            "alt": "bone"
          },
          {
            "id": "bone-b",
            "type": "image",
            "image": "/assets/memory-word-bone.svg",
            "alt": "bone"
          }
        ]
      },
      {
        "id": "hat",
        "word": "hat",
        "meaning": "모자",
        "sentence": "I matched the hat.",
        "translation": "모자 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "hat-a",
            "type": "image",
            "image": "/assets/memory-word-hat.svg",
            "alt": "hat"
          },
          {
            "id": "hat-b",
            "type": "image",
            "image": "/assets/memory-word-hat.svg",
            "alt": "hat"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_rain_001",
    "title": "Rainy Day Cards",
    "titleKo": "비 오는 날 카드",
    "theme": "rain",
    "level": 2,
    "estimatedMinutes": 4,
    "matchMode": "image_word",
    "previewImage": "/assets/memory_rain_001.svg",
    "pairs": [
      {
        "id": "umbrella",
        "word": "umbrella",
        "meaning": "우산",
        "sentence": "I matched the umbrella.",
        "translation": "우산 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "umbrella-image",
            "type": "image",
            "image": "/assets/memory-word-umbrella.svg",
            "alt": "umbrella"
          },
          {
            "id": "umbrella-word",
            "type": "word",
            "label": "umbrella"
          }
        ]
      },
      {
        "id": "boot",
        "word": "boot",
        "meaning": "장화",
        "sentence": "I matched the boot.",
        "translation": "장화 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "boot-image",
            "type": "image",
            "image": "/assets/memory-word-boot.svg",
            "alt": "boot"
          },
          {
            "id": "boot-word",
            "type": "word",
            "label": "boot"
          }
        ]
      },
      {
        "id": "cloud",
        "word": "cloud",
        "meaning": "구름",
        "sentence": "I matched the cloud.",
        "translation": "구름 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "cloud-image",
            "type": "image",
            "image": "/assets/memory-word-cloud.svg",
            "alt": "cloud"
          },
          {
            "id": "cloud-word",
            "type": "word",
            "label": "cloud"
          }
        ]
      },
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I matched the book.",
        "translation": "책 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "book-image",
            "type": "image",
            "image": "/assets/memory-word-book.svg",
            "alt": "book"
          },
          {
            "id": "book-word",
            "type": "word",
            "label": "book"
          }
        ]
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I matched the cup.",
        "translation": "컵 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "cup-image",
            "type": "image",
            "image": "/assets/memory-word-cup.svg",
            "alt": "cup"
          },
          {
            "id": "cup-word",
            "type": "word",
            "label": "cup"
          }
        ]
      },
      {
        "id": "sock",
        "word": "sock",
        "meaning": "양말",
        "sentence": "I matched the sock.",
        "translation": "양말 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "sock-image",
            "type": "image",
            "image": "/assets/memory-word-sock.svg",
            "alt": "sock"
          },
          {
            "id": "sock-word",
            "type": "word",
            "label": "sock"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_library_001",
    "title": "Library Cards",
    "titleKo": "도서관 카드",
    "theme": "library",
    "level": 2,
    "estimatedMinutes": 4,
    "matchMode": "image_word",
    "previewImage": "/assets/memory_library_001.svg",
    "pairs": [
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I matched the book.",
        "translation": "책 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "book-image",
            "type": "image",
            "image": "/assets/memory-word-book.svg",
            "alt": "book"
          },
          {
            "id": "book-word",
            "type": "word",
            "label": "book"
          }
        ]
      },
      {
        "id": "lamp",
        "word": "lamp",
        "meaning": "램프",
        "sentence": "I matched the lamp.",
        "translation": "램프 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "lamp-image",
            "type": "image",
            "image": "/assets/memory-word-lamp.svg",
            "alt": "lamp"
          },
          {
            "id": "lamp-word",
            "type": "word",
            "label": "lamp"
          }
        ]
      },
      {
        "id": "pencil",
        "word": "pencil",
        "meaning": "연필",
        "sentence": "I matched the pencil.",
        "translation": "연필 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "pencil-image",
            "type": "image",
            "image": "/assets/memory-word-pencil.svg",
            "alt": "pencil"
          },
          {
            "id": "pencil-word",
            "type": "word",
            "label": "pencil"
          }
        ]
      },
      {
        "id": "clock",
        "word": "clock",
        "meaning": "시계",
        "sentence": "I matched the clock.",
        "translation": "시계 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "clock-image",
            "type": "image",
            "image": "/assets/memory-word-clock.svg",
            "alt": "clock"
          },
          {
            "id": "clock-word",
            "type": "word",
            "label": "clock"
          }
        ]
      },
      {
        "id": "backpack",
        "word": "backpack",
        "meaning": "가방",
        "sentence": "I matched the backpack.",
        "translation": "가방 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "backpack-image",
            "type": "image",
            "image": "/assets/memory-word-backpack.svg",
            "alt": "backpack"
          },
          {
            "id": "backpack-word",
            "type": "word",
            "label": "backpack"
          }
        ]
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I matched the star.",
        "translation": "별 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "star-image",
            "type": "image",
            "image": "/assets/memory-word-star.svg",
            "alt": "star"
          },
          {
            "id": "star-word",
            "type": "word",
            "label": "star"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_camping_001",
    "title": "Camping Cards",
    "titleKo": "캠핑 카드",
    "theme": "camping",
    "level": 2,
    "estimatedMinutes": 4,
    "matchMode": "image_word",
    "previewImage": "/assets/memory_camping_001.svg",
    "pairs": [
      {
        "id": "tent",
        "word": "tent",
        "meaning": "텐트",
        "sentence": "I matched the tent.",
        "translation": "텐트 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "tent-image",
            "type": "image",
            "image": "/assets/memory-word-tent.svg",
            "alt": "tent"
          },
          {
            "id": "tent-word",
            "type": "word",
            "label": "tent"
          }
        ]
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I matched the star.",
        "translation": "별 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "star-image",
            "type": "image",
            "image": "/assets/memory-word-star.svg",
            "alt": "star"
          },
          {
            "id": "star-word",
            "type": "word",
            "label": "star"
          }
        ]
      },
      {
        "id": "moon",
        "word": "moon",
        "meaning": "달",
        "sentence": "I matched the moon.",
        "translation": "달 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "moon-image",
            "type": "image",
            "image": "/assets/memory-word-moon.svg",
            "alt": "moon"
          },
          {
            "id": "moon-word",
            "type": "word",
            "label": "moon"
          }
        ]
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I matched the cup.",
        "translation": "컵 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "cup-image",
            "type": "image",
            "image": "/assets/memory-word-cup.svg",
            "alt": "cup"
          },
          {
            "id": "cup-word",
            "type": "word",
            "label": "cup"
          }
        ]
      },
      {
        "id": "fish",
        "word": "fish",
        "meaning": "물고기",
        "sentence": "I matched the fish.",
        "translation": "물고기 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "fish-image",
            "type": "image",
            "image": "/assets/memory-word-fish.svg",
            "alt": "fish"
          },
          {
            "id": "fish-word",
            "type": "word",
            "label": "fish"
          }
        ]
      },
      {
        "id": "flag",
        "word": "flag",
        "meaning": "깃발",
        "sentence": "I matched the flag.",
        "translation": "깃발 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "flag-image",
            "type": "image",
            "image": "/assets/memory-word-flag.svg",
            "alt": "flag"
          },
          {
            "id": "flag-word",
            "type": "word",
            "label": "flag"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_music_001",
    "title": "Music Room Cards",
    "titleKo": "음악 방 카드",
    "theme": "music",
    "level": 2,
    "estimatedMinutes": 4,
    "matchMode": "image_word",
    "previewImage": "/assets/memory_music_001.svg",
    "pairs": [
      {
        "id": "drum",
        "word": "drum",
        "meaning": "북",
        "sentence": "I matched the drum.",
        "translation": "북 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "drum-image",
            "type": "image",
            "image": "/assets/memory-word-drum.svg",
            "alt": "drum"
          },
          {
            "id": "drum-word",
            "type": "word",
            "label": "drum"
          }
        ]
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I matched the star.",
        "translation": "별 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "star-image",
            "type": "image",
            "image": "/assets/memory-word-star.svg",
            "alt": "star"
          },
          {
            "id": "star-word",
            "type": "word",
            "label": "star"
          }
        ]
      },
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I matched the book.",
        "translation": "책 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "book-image",
            "type": "image",
            "image": "/assets/memory-word-book.svg",
            "alt": "book"
          },
          {
            "id": "book-word",
            "type": "word",
            "label": "book"
          }
        ]
      },
      {
        "id": "balloon",
        "word": "balloon",
        "meaning": "풍선",
        "sentence": "I matched the balloon.",
        "translation": "풍선 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "balloon-image",
            "type": "image",
            "image": "/assets/memory-word-balloon.svg",
            "alt": "balloon"
          },
          {
            "id": "balloon-word",
            "type": "word",
            "label": "balloon"
          }
        ]
      },
      {
        "id": "robot",
        "word": "robot",
        "meaning": "로봇",
        "sentence": "I matched the robot.",
        "translation": "로봇 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "robot-image",
            "type": "image",
            "image": "/assets/memory-word-robot.svg",
            "alt": "robot"
          },
          {
            "id": "robot-word",
            "type": "word",
            "label": "robot"
          }
        ]
      },
      {
        "id": "guitar",
        "word": "guitar",
        "meaning": "기타",
        "sentence": "I matched the guitar.",
        "translation": "기타 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "guitar-image",
            "type": "image",
            "image": "/assets/memory-word-guitar.svg",
            "alt": "guitar"
          },
          {
            "id": "guitar-word",
            "type": "word",
            "label": "guitar"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_snow_001",
    "title": "Snow Cards",
    "titleKo": "눈 놀이 카드",
    "theme": "snow",
    "level": 2,
    "estimatedMinutes": 4,
    "matchMode": "image_word",
    "previewImage": "/assets/memory_snow_001.svg",
    "pairs": [
      {
        "id": "snowman",
        "word": "snowman",
        "meaning": "눈사람",
        "sentence": "I matched the snowman.",
        "translation": "눈사람 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "snowman-image",
            "type": "image",
            "image": "/assets/memory-word-snowman.svg",
            "alt": "snowman"
          },
          {
            "id": "snowman-word",
            "type": "word",
            "label": "snowman"
          }
        ]
      },
      {
        "id": "hat",
        "word": "hat",
        "meaning": "모자",
        "sentence": "I matched the hat.",
        "translation": "모자 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "hat-image",
            "type": "image",
            "image": "/assets/memory-word-hat.svg",
            "alt": "hat"
          },
          {
            "id": "hat-word",
            "type": "word",
            "label": "hat"
          }
        ]
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I matched the star.",
        "translation": "별 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "star-image",
            "type": "image",
            "image": "/assets/memory-word-star.svg",
            "alt": "star"
          },
          {
            "id": "star-word",
            "type": "word",
            "label": "star"
          }
        ]
      },
      {
        "id": "boot",
        "word": "boot",
        "meaning": "장화",
        "sentence": "I matched the boot.",
        "translation": "장화 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "boot-image",
            "type": "image",
            "image": "/assets/memory-word-boot.svg",
            "alt": "boot"
          },
          {
            "id": "boot-word",
            "type": "word",
            "label": "boot"
          }
        ]
      },
      {
        "id": "scarf",
        "word": "scarf",
        "meaning": "목도리",
        "sentence": "I matched the scarf.",
        "translation": "목도리 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "scarf-image",
            "type": "image",
            "image": "/assets/memory-word-scarf.svg",
            "alt": "scarf"
          },
          {
            "id": "scarf-word",
            "type": "word",
            "label": "scarf"
          }
        ]
      },
      {
        "id": "tree",
        "word": "tree",
        "meaning": "나무",
        "sentence": "I matched the tree.",
        "translation": "나무 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "tree-image",
            "type": "image",
            "image": "/assets/memory-word-tree.svg",
            "alt": "tree"
          },
          {
            "id": "tree-word",
            "type": "word",
            "label": "tree"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_farm_001",
    "title": "Farm Cards",
    "titleKo": "농장 카드",
    "theme": "farm",
    "level": 2,
    "estimatedMinutes": 4,
    "matchMode": "image_word",
    "previewImage": "/assets/memory_farm_001.svg",
    "pairs": [
      {
        "id": "apple",
        "word": "apple",
        "meaning": "사과",
        "sentence": "I matched the apple.",
        "translation": "사과 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "apple-image",
            "type": "image",
            "image": "/assets/memory-word-apple.svg",
            "alt": "apple"
          },
          {
            "id": "apple-word",
            "type": "word",
            "label": "apple"
          }
        ]
      },
      {
        "id": "bird",
        "word": "bird",
        "meaning": "새",
        "sentence": "I matched the bird.",
        "translation": "새 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "bird-image",
            "type": "image",
            "image": "/assets/memory-word-bird.svg",
            "alt": "bird"
          },
          {
            "id": "bird-word",
            "type": "word",
            "label": "bird"
          }
        ]
      },
      {
        "id": "flower",
        "word": "flower",
        "meaning": "꽃",
        "sentence": "I matched the flower.",
        "translation": "꽃 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "flower-image",
            "type": "image",
            "image": "/assets/memory-word-flower.svg",
            "alt": "flower"
          },
          {
            "id": "flower-word",
            "type": "word",
            "label": "flower"
          }
        ]
      },
      {
        "id": "bucket",
        "word": "bucket",
        "meaning": "양동이",
        "sentence": "I matched the bucket.",
        "translation": "양동이 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "bucket-image",
            "type": "image",
            "image": "/assets/memory-word-bucket.svg",
            "alt": "bucket"
          },
          {
            "id": "bucket-word",
            "type": "word",
            "label": "bucket"
          }
        ]
      },
      {
        "id": "hat",
        "word": "hat",
        "meaning": "모자",
        "sentence": "I matched the hat.",
        "translation": "모자 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "hat-image",
            "type": "image",
            "image": "/assets/memory-word-hat.svg",
            "alt": "hat"
          },
          {
            "id": "hat-word",
            "type": "word",
            "label": "hat"
          }
        ]
      },
      {
        "id": "carrot",
        "word": "carrot",
        "meaning": "당근",
        "sentence": "I matched the carrot.",
        "translation": "당근 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "carrot-image",
            "type": "image",
            "image": "/assets/memory-word-carrot.svg",
            "alt": "carrot"
          },
          {
            "id": "carrot-word",
            "type": "word",
            "label": "carrot"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_party_001",
    "title": "Birthday Cards",
    "titleKo": "생일 카드",
    "theme": "party",
    "level": 2,
    "estimatedMinutes": 4,
    "matchMode": "image_word",
    "previewImage": "/assets/memory_party_001.svg",
    "pairs": [
      {
        "id": "cupcake",
        "word": "cupcake",
        "meaning": "컵케이크",
        "sentence": "I matched the cupcake.",
        "translation": "컵케이크 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "cupcake-image",
            "type": "image",
            "image": "/assets/memory-word-cupcake.svg",
            "alt": "cupcake"
          },
          {
            "id": "cupcake-word",
            "type": "word",
            "label": "cupcake"
          }
        ]
      },
      {
        "id": "balloon",
        "word": "balloon",
        "meaning": "풍선",
        "sentence": "I matched the balloon.",
        "translation": "풍선 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "balloon-image",
            "type": "image",
            "image": "/assets/memory-word-balloon.svg",
            "alt": "balloon"
          },
          {
            "id": "balloon-word",
            "type": "word",
            "label": "balloon"
          }
        ]
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I matched the star.",
        "translation": "별 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "star-image",
            "type": "image",
            "image": "/assets/memory-word-star.svg",
            "alt": "star"
          },
          {
            "id": "star-word",
            "type": "word",
            "label": "star"
          }
        ]
      },
      {
        "id": "gift",
        "word": "gift",
        "meaning": "선물",
        "sentence": "I matched the gift.",
        "translation": "선물 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "gift-image",
            "type": "image",
            "image": "/assets/memory-word-gift.svg",
            "alt": "gift"
          },
          {
            "id": "gift-word",
            "type": "word",
            "label": "gift"
          }
        ]
      },
      {
        "id": "hat",
        "word": "hat",
        "meaning": "모자",
        "sentence": "I matched the hat.",
        "translation": "모자 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "hat-image",
            "type": "image",
            "image": "/assets/memory-word-hat.svg",
            "alt": "hat"
          },
          {
            "id": "hat-word",
            "type": "word",
            "label": "hat"
          }
        ]
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I matched the cup.",
        "translation": "컵 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "cup-image",
            "type": "image",
            "image": "/assets/memory-word-cup.svg",
            "alt": "cup"
          },
          {
            "id": "cup-word",
            "type": "word",
            "label": "cup"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_ocean_001",
    "title": "Ocean Cards",
    "titleKo": "바다 카드",
    "theme": "ocean",
    "level": 2,
    "estimatedMinutes": 4,
    "matchMode": "image_word",
    "previewImage": "/assets/memory_ocean_001.svg",
    "pairs": [
      {
        "id": "fish",
        "word": "fish",
        "meaning": "물고기",
        "sentence": "I matched the fish.",
        "translation": "물고기 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "fish-image",
            "type": "image",
            "image": "/assets/memory-word-fish.svg",
            "alt": "fish"
          },
          {
            "id": "fish-word",
            "type": "word",
            "label": "fish"
          }
        ]
      },
      {
        "id": "shell",
        "word": "shell",
        "meaning": "조개",
        "sentence": "I matched the shell.",
        "translation": "조개 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "shell-image",
            "type": "image",
            "image": "/assets/memory-word-shell.svg",
            "alt": "shell"
          },
          {
            "id": "shell-word",
            "type": "word",
            "label": "shell"
          }
        ]
      },
      {
        "id": "boat",
        "word": "boat",
        "meaning": "배",
        "sentence": "I matched the boat.",
        "translation": "배 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "boat-image",
            "type": "image",
            "image": "/assets/memory-word-boat.svg",
            "alt": "boat"
          },
          {
            "id": "boat-word",
            "type": "word",
            "label": "boat"
          }
        ]
      },
      {
        "id": "starfish",
        "word": "starfish",
        "meaning": "불가사리",
        "sentence": "I matched the starfish.",
        "translation": "불가사리 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "starfish-image",
            "type": "image",
            "image": "/assets/memory-word-starfish.svg",
            "alt": "starfish"
          },
          {
            "id": "starfish-word",
            "type": "word",
            "label": "starfish"
          }
        ]
      },
      {
        "id": "bucket",
        "word": "bucket",
        "meaning": "양동이",
        "sentence": "I matched the bucket.",
        "translation": "양동이 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "bucket-image",
            "type": "image",
            "image": "/assets/memory-word-bucket.svg",
            "alt": "bucket"
          },
          {
            "id": "bucket-word",
            "type": "word",
            "label": "bucket"
          }
        ]
      },
      {
        "id": "crab",
        "word": "crab",
        "meaning": "게",
        "sentence": "I matched the crab.",
        "translation": "게 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "crab-image",
            "type": "image",
            "image": "/assets/memory-word-crab.svg",
            "alt": "crab"
          },
          {
            "id": "crab-word",
            "type": "word",
            "label": "crab"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_station_001",
    "title": "Station Cards",
    "titleKo": "기차역 카드",
    "theme": "station",
    "level": 3,
    "estimatedMinutes": 5,
    "matchMode": "image_word",
    "previewImage": "/assets/memory_station_001.svg",
    "pairs": [
      {
        "id": "train",
        "word": "train",
        "meaning": "기차",
        "sentence": "I matched the train.",
        "translation": "기차 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "train-image",
            "type": "image",
            "image": "/assets/memory-word-train.svg",
            "alt": "train"
          },
          {
            "id": "train-word",
            "type": "word",
            "label": "train"
          }
        ]
      },
      {
        "id": "clock",
        "word": "clock",
        "meaning": "시계",
        "sentence": "I matched the clock.",
        "translation": "시계 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "clock-image",
            "type": "image",
            "image": "/assets/memory-word-clock.svg",
            "alt": "clock"
          },
          {
            "id": "clock-word",
            "type": "word",
            "label": "clock"
          }
        ]
      },
      {
        "id": "backpack",
        "word": "backpack",
        "meaning": "가방",
        "sentence": "I matched the backpack.",
        "translation": "가방 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "backpack-image",
            "type": "image",
            "image": "/assets/memory-word-backpack.svg",
            "alt": "backpack"
          },
          {
            "id": "backpack-word",
            "type": "word",
            "label": "backpack"
          }
        ]
      },
      {
        "id": "flag",
        "word": "flag",
        "meaning": "깃발",
        "sentence": "I matched the flag.",
        "translation": "깃발 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "flag-image",
            "type": "image",
            "image": "/assets/memory-word-flag.svg",
            "alt": "flag"
          },
          {
            "id": "flag-word",
            "type": "word",
            "label": "flag"
          }
        ]
      },
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I matched the book.",
        "translation": "책 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "book-image",
            "type": "image",
            "image": "/assets/memory-word-book.svg",
            "alt": "book"
          },
          {
            "id": "book-word",
            "type": "word",
            "label": "book"
          }
        ]
      },
      {
        "id": "balloon",
        "word": "balloon",
        "meaning": "풍선",
        "sentence": "I matched the balloon.",
        "translation": "풍선 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "balloon-image",
            "type": "image",
            "image": "/assets/memory-word-balloon.svg",
            "alt": "balloon"
          },
          {
            "id": "balloon-word",
            "type": "word",
            "label": "balloon"
          }
        ]
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I matched the cup.",
        "translation": "컵 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "cup-image",
            "type": "image",
            "image": "/assets/memory-word-cup.svg",
            "alt": "cup"
          },
          {
            "id": "cup-word",
            "type": "word",
            "label": "cup"
          }
        ]
      },
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I matched the star.",
        "translation": "별 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "star-image",
            "type": "image",
            "image": "/assets/memory-word-star.svg",
            "alt": "star"
          },
          {
            "id": "star-word",
            "type": "word",
            "label": "star"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_doctor_001",
    "title": "Doctor Kit Cards",
    "titleKo": "병원 놀이 카드",
    "theme": "doctor",
    "level": 3,
    "estimatedMinutes": 5,
    "matchMode": "image_word",
    "previewImage": "/assets/memory_doctor_001.svg",
    "pairs": [
      {
        "id": "star",
        "word": "star",
        "meaning": "별",
        "sentence": "I matched the star.",
        "translation": "별 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "star-image",
            "type": "image",
            "image": "/assets/memory-word-star.svg",
            "alt": "star"
          },
          {
            "id": "star-word",
            "type": "word",
            "label": "star"
          }
        ]
      },
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I matched the book.",
        "translation": "책 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "book-image",
            "type": "image",
            "image": "/assets/memory-word-book.svg",
            "alt": "book"
          },
          {
            "id": "book-word",
            "type": "word",
            "label": "book"
          }
        ]
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I matched the cup.",
        "translation": "컵 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "cup-image",
            "type": "image",
            "image": "/assets/memory-word-cup.svg",
            "alt": "cup"
          },
          {
            "id": "cup-word",
            "type": "word",
            "label": "cup"
          }
        ]
      },
      {
        "id": "clock",
        "word": "clock",
        "meaning": "시계",
        "sentence": "I matched the clock.",
        "translation": "시계 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "clock-image",
            "type": "image",
            "image": "/assets/memory-word-clock.svg",
            "alt": "clock"
          },
          {
            "id": "clock-word",
            "type": "word",
            "label": "clock"
          }
        ]
      },
      {
        "id": "doctor_bag",
        "word": "doctor bag",
        "meaning": "의사 가방",
        "sentence": "I matched the doctor bag.",
        "translation": "의사 가방 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "doctor_bag-image",
            "type": "image",
            "image": "/assets/memory-word-doctor-bag.svg",
            "alt": "doctor bag"
          },
          {
            "id": "doctor_bag-word",
            "type": "word",
            "label": "doctor bag"
          }
        ]
      },
      {
        "id": "heart",
        "word": "heart",
        "meaning": "하트",
        "sentence": "I matched the heart.",
        "translation": "하트 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "heart-image",
            "type": "image",
            "image": "/assets/memory-word-heart.svg",
            "alt": "heart"
          },
          {
            "id": "heart-word",
            "type": "word",
            "label": "heart"
          }
        ]
      },
      {
        "id": "pencil",
        "word": "pencil",
        "meaning": "연필",
        "sentence": "I matched the pencil.",
        "translation": "연필 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "pencil-image",
            "type": "image",
            "image": "/assets/memory-word-pencil.svg",
            "alt": "pencil"
          },
          {
            "id": "pencil-word",
            "type": "word",
            "label": "pencil"
          }
        ]
      },
      {
        "id": "hat",
        "word": "hat",
        "meaning": "모자",
        "sentence": "I matched the hat.",
        "translation": "모자 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "hat-image",
            "type": "image",
            "image": "/assets/memory-word-hat.svg",
            "alt": "hat"
          },
          {
            "id": "hat-word",
            "type": "word",
            "label": "hat"
          }
        ]
      }
    ]
  },
  {
    "id": "memory_market_001",
    "title": "Market Cards",
    "titleKo": "시장 카드",
    "theme": "market",
    "level": 3,
    "estimatedMinutes": 5,
    "matchMode": "image_word",
    "previewImage": "/assets/memory_market_001.svg",
    "pairs": [
      {
        "id": "apple",
        "word": "apple",
        "meaning": "사과",
        "sentence": "I matched the apple.",
        "translation": "사과 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "apple-image",
            "type": "image",
            "image": "/assets/memory-word-apple.svg",
            "alt": "apple"
          },
          {
            "id": "apple-word",
            "type": "word",
            "label": "apple"
          }
        ]
      },
      {
        "id": "banana",
        "word": "banana",
        "meaning": "바나나",
        "sentence": "I matched the banana.",
        "translation": "바나나 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "banana-image",
            "type": "image",
            "image": "/assets/memory-word-banana.svg",
            "alt": "banana"
          },
          {
            "id": "banana-word",
            "type": "word",
            "label": "banana"
          }
        ]
      },
      {
        "id": "carrot",
        "word": "carrot",
        "meaning": "당근",
        "sentence": "I matched the carrot.",
        "translation": "당근 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "carrot-image",
            "type": "image",
            "image": "/assets/memory-word-carrot.svg",
            "alt": "carrot"
          },
          {
            "id": "carrot-word",
            "type": "word",
            "label": "carrot"
          }
        ]
      },
      {
        "id": "bag",
        "word": "bag",
        "meaning": "가방",
        "sentence": "I matched the bag.",
        "translation": "가방 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "bag-image",
            "type": "image",
            "image": "/assets/memory-word-bag.svg",
            "alt": "bag"
          },
          {
            "id": "bag-word",
            "type": "word",
            "label": "bag"
          }
        ]
      },
      {
        "id": "cup",
        "word": "cup",
        "meaning": "컵",
        "sentence": "I matched the cup.",
        "translation": "컵 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "cup-image",
            "type": "image",
            "image": "/assets/memory-word-cup.svg",
            "alt": "cup"
          },
          {
            "id": "cup-word",
            "type": "word",
            "label": "cup"
          }
        ]
      },
      {
        "id": "flower",
        "word": "flower",
        "meaning": "꽃",
        "sentence": "I matched the flower.",
        "translation": "꽃 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "flower-image",
            "type": "image",
            "image": "/assets/memory-word-flower.svg",
            "alt": "flower"
          },
          {
            "id": "flower-word",
            "type": "word",
            "label": "flower"
          }
        ]
      },
      {
        "id": "book",
        "word": "book",
        "meaning": "책",
        "sentence": "I matched the book.",
        "translation": "책 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "book-image",
            "type": "image",
            "image": "/assets/memory-word-book.svg",
            "alt": "book"
          },
          {
            "id": "book-word",
            "type": "word",
            "label": "book"
          }
        ]
      },
      {
        "id": "balloon",
        "word": "balloon",
        "meaning": "풍선",
        "sentence": "I matched the balloon.",
        "translation": "풍선 짝을 맞췄어요.",
        "cardFaces": [
          {
            "id": "balloon-image",
            "type": "image",
            "image": "/assets/memory-word-balloon.svg",
            "alt": "balloon"
          },
          {
            "id": "balloon-word",
            "type": "word",
            "label": "balloon"
          }
        ]
      }
    ]
  }
];

export const generatedMemoryCardStages = generatedMemoryStageDefinitions.map(defineMemoryCardsStage);
