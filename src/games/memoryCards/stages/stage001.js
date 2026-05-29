import { defineMemoryCardsStage, MEMORY_MATCH_MODES } from "./schema";

const animalPairs = [
  {
    id: "cat",
    word: "cat",
    meaning: "고양이",
    phonetic: "/kæt/",
    sentence: "The cat is cute.",
    translation: "고양이가 귀여워요.",
    image: "/assets/memory-animal-cat.svg",
  },
  {
    id: "dog",
    word: "dog",
    meaning: "강아지",
    phonetic: "/dɔːɡ/",
    sentence: "The dog is happy.",
    translation: "강아지가 행복해요.",
    image: "/assets/memory-animal-dog.svg",
  },
  {
    id: "bird",
    word: "bird",
    meaning: "새",
    phonetic: "/bɜːrd/",
    sentence: "The bird can fly.",
    translation: "새가 날 수 있어요.",
    image: "/assets/memory-animal-bird.svg",
  },
  {
    id: "fish",
    word: "fish",
    meaning: "물고기",
    phonetic: "/fɪʃ/",
    sentence: "The fish can swim.",
    translation: "물고기가 헤엄칠 수 있어요.",
    image: "/assets/memory-animal-fish.svg",
  },
];

export const memoryAnimalsStage = defineMemoryCardsStage({
  id: "memory_animals_001",
  title: "Animal Match",
  titleKo: "동물 카드",
  theme: "animals",
  level: 1,
  estimatedMinutes: 3,
  matchMode: MEMORY_MATCH_MODES.IMAGE_IMAGE,
  previewImage: "/assets/memory-animals-001.svg",
  pairs: animalPairs.map((pair) => ({
    ...pair,
    cardFaces: [
      {
        id: `${pair.id}-a`,
        type: "image",
        image: pair.image,
        alt: pair.word,
      },
      {
        id: `${pair.id}-b`,
        type: "image",
        image: pair.image,
        alt: pair.word,
      },
    ],
  })),
});

export const defaultMemoryCardsStage = memoryAnimalsStage;
