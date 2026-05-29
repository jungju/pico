export const MAZE_SCHEMA_VERSION = 1;
export const MAZE_WALL = "#";
export const MAZE_PATH = ".";

export function defineMazeStage(stage) {
  return normalizeMazeStage(stage);
}

export function normalizeMazeStage(stage) {
  const grid = normalizeGrid(stage.grid);
  const start = normalizeCell(stage.start || findCell(grid, "S"), "start", grid);
  const goal = normalizeCell(stage.goal || findCell(grid, "G"), "goal", grid);
  const obstacles = normalizeObstacles(stage.obstacles, grid);

  return {
    schemaVersion: MAZE_SCHEMA_VERSION,
    id: requiredString(stage.id, "stage.id"),
    title: requiredString(stage.title, "stage.title"),
    titleKo: optionalString(stage.titleKo),
    theme: optionalString(stage.theme) || "general",
    level: positiveInteger(stage.level, 1),
    estimatedMinutes: positiveInteger(stage.estimatedMinutes, 3),
    themeImage: optionalString(stage.themeImage),
    grid,
    start,
    goal,
    obstacles,
    collectibles: normalizeCollectibles(stage.collectibles || [], grid, obstacles),
  };
}

export function cellKey(cell) {
  return `${cell.row}:${cell.col}`;
}

export function isMazeCellBlocked(stage, cell) {
  return !isCellInGrid(stage.grid, cell) || stage.obstacles.some((obstacle) => sameCell(obstacle, cell));
}

export function isCellInGrid(grid, cell) {
  return cell.row >= 0 && cell.row < grid.rows && cell.col >= 0 && cell.col < grid.columns;
}

export function sameCell(a, b) {
  return a.row === b.row && a.col === b.col;
}

function normalizeGrid(grid) {
  const rows = requiredArray(grid, "stage.grid").map((row, index) => {
    if (typeof row !== "string" || row.trim() === "") {
      throw new Error(`stage.grid[${index}] must be a non-empty string`);
    }

    return row.trim();
  });
  const columns = rows[0].length;

  if (rows.some((row) => row.length !== columns)) {
    throw new Error("stage.grid rows must have the same length");
  }

  return {
    rows: rows.length,
    columns,
    cells: rows,
  };
}

function normalizeObstacles(obstacles = [], grid) {
  const gridObstacles = [];

  grid.cells.forEach((row, rowIndex) => {
    [...row].forEach((cell, colIndex) => {
      if (cell === MAZE_WALL) {
        gridObstacles.push({ row: rowIndex, col: colIndex });
      }
    });
  });

  const explicitObstacles = obstacles.map((cell, index) => normalizeCell(cell, `obstacles[${index}]`, grid));
  const obstacleMap = new Map([...gridObstacles, ...explicitObstacles].map((cell) => [cellKey(cell), cell]));
  return [...obstacleMap.values()];
}

function normalizeCollectibles(collectibles, grid, obstacles) {
  return collectibles.map((collectible, index) => {
    const cell = normalizeCell(collectible, `collectibles[${index}]`, grid);

    if (obstacles.some((obstacle) => sameCell(obstacle, cell))) {
      throw new Error(`collectibles[${index}] cannot be on an obstacle`);
    }

    return {
      id: optionalString(collectible.id) || `collectible-${index + 1}`,
      row: cell.row,
      col: cell.col,
      word: optionalString(collectible.word),
      meaning: optionalString(collectible.meaning),
      points: positiveInteger(collectible.points, 50),
    };
  });
}

function normalizeCell(cell, label, grid) {
  const normalized = {
    row: nonNegativeInteger(cell?.row, `${label}.row`),
    col: nonNegativeInteger(cell?.col, `${label}.col`),
  };

  if (!isCellInGrid(grid, normalized)) {
    throw new Error(`${label} is outside the grid`);
  }

  return normalized;
}

function findCell(grid, marker) {
  for (let row = 0; row < grid.rows; row += 1) {
    const col = grid.cells[row].indexOf(marker);
    if (col >= 0) return { row, col };
  }

  return null;
}

function requiredString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} is required`);
  }

  return value.trim();
}

function optionalString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function requiredArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} must be a non-empty array`);
  }

  return value;
}

function nonNegativeInteger(value, label) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }

  return number;
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}
