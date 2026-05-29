import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_ASSET_DIR = path.join(ROOT, "public", "assets");
const GENERATED_STAGE_FILE = path.join(ROOT, "src", "games", "maze", "stages", "generatedStages.js");

const STAGE_SPECS = [
  ["maze_classroom_001", "Classroom Maze", "교실 미로", "classroom", 4, 4, 101],
  ["maze_kitchen_001", "Kitchen Maze", "부엌 미로", "kitchen", 4, 4, 102],
  ["maze_playground_001", "Playground Maze", "놀이터 미로", "playground", 4, 4, 103],
  ["maze_toy_room_001", "Toy Room Maze", "장난감 방 미로", "toys", 4, 4, 104],
  ["maze_zoo_001", "Zoo Maze", "동물원 미로", "zoo", 4, 4, 105],
  ["maze_beach_001", "Beach Maze", "해변 미로", "beach", 4, 4, 106],
  ["maze_space_001", "Space Maze", "우주 미로", "space", 4, 4, 107],
  ["maze_museum_001", "Museum Maze", "박물관 미로", "museum", 4, 4, 108],
  ["maze_rainy_day_001", "Rainy Day Maze", "비 오는 날 미로", "rain", 5, 5, 201],
  ["maze_library_001", "Library Maze", "도서관 미로", "library", 5, 5, 202],
  ["maze_camping_001", "Camping Maze", "캠핑 미로", "camping", 5, 5, 203],
  ["maze_music_room_001", "Music Room Maze", "음악 방 미로", "music", 5, 5, 204],
  ["maze_snow_001", "Snow Maze", "눈 놀이 미로", "snow", 5, 5, 205],
  ["maze_farm_001", "Farm Maze", "농장 미로", "farm", 5, 5, 206],
  ["maze_birthday_001", "Birthday Maze", "생일 미로", "party", 5, 5, 207],
  ["maze_ocean_001", "Ocean Maze", "바다 미로", "ocean", 5, 5, 208],
  ["maze_station_001", "Station Maze", "기차역 미로", "station", 5, 5, 209],
  ["maze_doctor_001", "Doctor Kit Maze", "병원 놀이 미로", "doctor", 5, 5, 210],
  ["maze_market_001", "Market Maze", "시장 미로", "market", 5, 5, 211],
];

const COLLECTIBLE_WORDS = [
  ["star", "별"],
  ["gem", "보석"],
  ["key", "열쇠"],
  ["coin", "동전"],
  ["heart", "하트"],
  ["leaf", "잎"],
];

mkdirSync(PUBLIC_ASSET_DIR, { recursive: true });

const stageDefinitions = STAGE_SPECS.map(([id, title, titleKo, theme, cellRows, cellCols, seed], index) => {
  const maze = createMaze(cellRows, cellCols, seed);
  const level = cellRows <= 4 ? 1 : index < 16 ? 2 : 3;
  const collectibles = pickCollectibles(maze.pathCells, index, level >= 3 ? 3 : 2);
  const assetName = `${id}.svg`;

  writeFileSync(path.join(PUBLIC_ASSET_DIR, assetName), `${renderMazePreview({ title, theme, grid: maze.grid, collectibles })}\n`);

  return {
    id,
    title,
    titleKo,
    theme,
    level,
    estimatedMinutes: level === 1 ? 3 : 4,
    themeImage: `/assets/${assetName}`,
    grid: maze.grid,
    collectibles,
  };
});

writeFileSync(
  GENERATED_STAGE_FILE,
  `import { defineMazeStage } from "./schema.js";\n\nconst generatedMazeStageDefinitions = ${JSON.stringify(stageDefinitions, null, 2)};\n\nexport const generatedMazeStages = generatedMazeStageDefinitions.map(defineMazeStage);\n`,
);

console.log(`Generated ${STAGE_SPECS.length} Maze stages.`);

function createMaze(cellRows, cellCols, seed) {
  const rows = cellRows * 2 - 1;
  const cols = cellCols * 2 - 1;
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => "#"));
  const visited = Array.from({ length: cellRows }, () => Array.from({ length: cellCols }, () => false));
  const random = createRandom(seed);

  function carve(row, col) {
    visited[row][col] = true;
    grid[row * 2][col * 2] = ".";

    for (const [dr, dc] of shuffle(
      [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ],
      random,
    )) {
      const nextRow = row + dr;
      const nextCol = col + dc;

      if (nextRow < 0 || nextRow >= cellRows || nextCol < 0 || nextCol >= cellCols || visited[nextRow][nextCol]) {
        continue;
      }

      grid[row * 2 + dr][col * 2 + dc] = ".";
      carve(nextRow, nextCol);
    }
  }

  carve(0, 0);
  grid[0][0] = "S";
  grid[rows - 1][cols - 1] = "G";

  return {
    grid: grid.map((row) => row.join("")),
    pathCells: grid.flatMap((row, rowIndex) =>
      row
        .map((cell, colIndex) => ({ cell, row: rowIndex, col: colIndex }))
        .filter(({ cell }) => cell === ".")
        .map(({ row: cellRow, col }) => ({ row: cellRow, col })),
    ),
  };
}

function pickCollectibles(pathCells, stageIndex, count) {
  const indexes = count === 3 ? [0.28, 0.52, 0.76] : [0.34, 0.68];
  const used = new Set();

  return indexes.map((ratio, index) => {
    let pathIndex = Math.min(pathCells.length - 1, Math.max(0, Math.floor(pathCells.length * ratio) + stageIndex + index));

    while (used.has(pathIndex)) {
      pathIndex = (pathIndex + 1) % pathCells.length;
    }

    used.add(pathIndex);
    const cell = pathCells[pathIndex];
    const [word, meaning] = COLLECTIBLE_WORDS[(stageIndex + index) % COLLECTIBLE_WORDS.length];

    return {
      id: `${word}-${index + 1}`,
      row: cell.row,
      col: cell.col,
      word,
      meaning,
      points: 50,
    };
  });
}

function renderMazePreview({ title, theme, grid, collectibles }) {
  const palette = themePalette(theme);
  const rows = grid.length;
  const cols = grid[0].length;
  const size = 700;
  const padding = 54;
  const cellSize = (size - padding * 2) / Math.max(rows, cols);
  const boardWidth = cellSize * cols;
  const boardHeight = cellSize * rows;
  const boardX = (size - boardWidth) / 2;
  const boardY = (size - boardHeight) / 2 + 18;
  const collectibleKeys = new Map(collectibles.map((item) => [`${item.row}:${item.col}`, item]));

  const cells = grid
    .flatMap((row, rowIndex) =>
      [...row].map((cell, colIndex) => {
        const x = boardX + colIndex * cellSize;
        const y = boardY + rowIndex * cellSize;
        const key = `${rowIndex}:${colIndex}`;
        const collectible = collectibleKeys.get(key);
        const isWall = cell === "#";
        const fill = isWall ? palette.wall : cell === "S" ? palette.start : cell === "G" ? palette.goal : palette.path;
        const icon = cell === "S" ? playerIcon(x, y, cellSize) : cell === "G" ? flagIcon(x, y, cellSize) : collectible ? gemIcon(x, y, cellSize) : "";
        return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${fill}" stroke="#143c56" stroke-opacity="0.22" stroke-width="2"/>${icon}`;
      }),
    )
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${escapeXml(title)} preview">
  <rect width="${size}" height="${size}" rx="42" fill="${palette.background}"/>
  <circle cx="112" cy="118" r="44" fill="${palette.accent}" opacity="0.8"/>
  <path d="M0 520 C120 460 230 540 350 492 C500 432 585 528 700 470 V700 H0Z" fill="${palette.ground}" opacity="0.95"/>
  <rect x="${boardX - 16}" y="${boardY - 16}" width="${boardWidth + 32}" height="${boardHeight + 32}" rx="26" fill="#ffffff" stroke="#143c56" stroke-width="10"/>
  ${cells}
  <text x="350" y="62" text-anchor="middle" font-size="36" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#143c56">${escapeXml(title)}</text>
</svg>`;
}

function playerIcon(x, y, size) {
  return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size * 0.22}" fill="#ff8069" stroke="#143c56" stroke-width="4"/>`;
}

function flagIcon(x, y, size) {
  return `<path d="M${x + size * 0.38} ${y + size * 0.72} V${y + size * 0.22} H${x + size * 0.75} L${x + size * 0.62} ${y + size * 0.4} H${x + size * 0.38}" fill="#ffe1e5" stroke="#793046" stroke-width="4" stroke-linejoin="round"/>`;
}

function gemIcon(x, y, size) {
  return `<path d="M${x + size * 0.5} ${y + size * 0.2} L${x + size * 0.78} ${y + size * 0.46} L${x + size * 0.5} ${y + size * 0.8} L${x + size * 0.22} ${y + size * 0.46}Z" fill="#ffd45a" stroke="#d18c00" stroke-width="4" stroke-linejoin="round"/>`;
}

function themePalette(theme) {
  const palettes = {
    beach: ["#c5f2ff", "#ffe6a7", "#2f536b", "#fff8df", "#baf1d4", "#ffd45a"],
    camping: ["#2e4f6d", "#294f3b", "#17324a", "#f9f0d0", "#baf1d4", "#ffd45a"],
    space: ["#27385f", "#17233f", "#10223d", "#fff8df", "#bde6ff", "#ffd45a"],
    ocean: ["#c5f2ff", "#8eddf4", "#23516c", "#fff8df", "#baf1d4", "#ffd45a"],
    snow: ["#eef8ff", "#dceff8", "#31506a", "#fff8df", "#bde6ff", "#ffd45a"],
  };
  const fallback = ["#fff4d7", "#dff7f2", "#31506a", "#fff8df", "#baf1d4", "#ffd45a"];
  const [background, ground, wall, path, start, accent] = palettes[theme] || fallback;
  return {
    background,
    ground,
    wall,
    path,
    start,
    accent,
    goal: "#ffe1e5",
  };
}

function createRandom(seed) {
  let value = seed || 1;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function shuffle(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
