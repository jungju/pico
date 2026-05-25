export const findLearnStage = {
  id: "stage-001",
  title: "Find & Learn",
  images: {
    original: "/assets/stage-001-original.svg",
    changed: "/assets/stage-001-changed.svg",
  },
  differences: [
    {
      id: "sun-position",
      label: "The sun is different.",
      marker: { x: 82, y: 19 },
      area: { type: "circle", x: 82, y: 19, r: 10 },
    },
    {
      id: "door-color",
      label: "The door is different.",
      marker: { x: 51, y: 67 },
      area: { type: "rect", x: 45, y: 59, w: 12, h: 16 },
    },
    {
      id: "cat-tail",
      label: "The cat tail is different.",
      marker: { x: 21, y: 74 },
      area: {
        type: "polygon",
        points: [
          [18, 68],
          [30, 69],
          [29, 80],
          [17, 80],
        ],
      },
    },
    {
      id: "window-shape",
      label: "The window is different.",
      marker: { x: 59, y: 48 },
      area: { type: "rect", x: 54, y: 42, w: 11, h: 12 },
    },
    {
      id: "tree-apple",
      label: "The apple is different.",
      marker: { x: 76, y: 47 },
      area: { type: "circle", x: 76, y: 47, r: 5 },
    },
    {
      id: "bird-direction",
      label: "The bird is different.",
      marker: { x: 36, y: 23 },
      area: {
        type: "polygon",
        points: [
          [29, 18],
          [42, 18],
          [44, 27],
          [32, 29],
        ],
      },
    },
  ],
  objects: [
    {
      id: "cat",
      word: "cat",
      meaning: "고양이",
      phonetic: "/kæt/",
      sentence: "The cat is sitting on the grass.",
      translation: "고양이가 잔디 위에 앉아 있어요.",
      area: { type: "rect", x: 8, y: 62, w: 22, h: 20 },
    },
    {
      id: "sun",
      word: "sun",
      meaning: "태양",
      phonetic: "/sʌn/",
      sentence: "The sun is bright.",
      translation: "태양이 밝아요.",
      area: { type: "circle", x: 82, y: 19, r: 13 },
    },
    {
      id: "house",
      word: "house",
      meaning: "집",
      phonetic: "/haʊs/",
      sentence: "The house has a red roof.",
      translation: "그 집에는 빨간 지붕이 있어요.",
      area: { type: "rect", x: 36, y: 36, w: 34, h: 39 },
    },
    {
      id: "tree",
      word: "tree",
      meaning: "나무",
      phonetic: "/triː/",
      sentence: "The tree is beside the house.",
      translation: "나무가 집 옆에 있어요.",
      area: { type: "circle", x: 78, y: 49, r: 15 },
    },
    {
      id: "flower",
      word: "flower",
      meaning: "꽃",
      phonetic: "/ˈflaʊər/",
      sentence: "The flower is small and yellow.",
      translation: "그 꽃은 작고 노란색이에요.",
      area: { type: "circle", x: 66, y: 83, r: 6 },
    },
  ],
};

export const DEBUG_AREAS = false;
