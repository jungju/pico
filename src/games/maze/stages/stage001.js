import { defineMazeStage } from "./schema.js";

export const gardenMazeStage = defineMazeStage({
  id: "maze_garden_001",
  title: "Garden Maze",
  titleKo: "정원 미로",
  theme: "garden",
  level: 1,
  estimatedMinutes: 3,
  themeImage: "/assets/maze-garden-001.svg",
  grid: [
    "S..#...",
    "##.#.#.",
    "...#.#.",
    ".###.#.",
    ".#...#.",
    ".#.###.",
    "......G",
  ],
  collectibles: [
    {
      id: "star",
      row: 2,
      col: 0,
      word: "star",
      meaning: "별",
      points: 50,
    },
    {
      id: "gem",
      row: 6,
      col: 3,
      word: "gem",
      meaning: "보석",
      points: 50,
    },
  ],
});

export const defaultMazeStage = gardenMazeStage;
