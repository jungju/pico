import { cellKey, isMazeCellBlocked, sameCell } from "./stages/schema";

export const MAZE_DIRECTIONS = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

const DIRECTION_DELTAS = {
  [MAZE_DIRECTIONS.UP]: { row: -1, col: 0 },
  [MAZE_DIRECTIONS.DOWN]: { row: 1, col: 0 },
  [MAZE_DIRECTIONS.LEFT]: { row: 0, col: -1 },
  [MAZE_DIRECTIONS.RIGHT]: { row: 0, col: 1 },
};

export function createMazeRunState(stage) {
  return {
    position: { ...stage.start },
    visitedCells: [cellKey(stage.start)],
    collectedIds: [],
    completed: sameCell(stage.start, stage.goal),
  };
}

export function moveMazePlayer(stage, state, direction) {
  const delta = DIRECTION_DELTAS[direction];
  if (!delta) return blockedResult(state, "unknown-direction");

  const nextCell = {
    row: state.position.row + delta.row,
    col: state.position.col + delta.col,
  };

  return moveMazePlayerToCell(stage, state, nextCell);
}

export function moveMazePlayerToCell(stage, state, nextCell) {
  if (!isAdjacentCell(state.position, nextCell)) {
    return blockedResult(state, "not-adjacent", nextCell);
  }

  if (isMazeCellBlocked(stage, nextCell)) {
    return blockedResult(state, "blocked", nextCell);
  }

  const collectible = findCollectibleAt(stage, state, nextCell);
  const nextCollectedIds = collectible ? [...state.collectedIds, collectible.id] : state.collectedIds;
  const nextVisitedKey = cellKey(nextCell);
  const nextVisitedCells = state.visitedCells.includes(nextVisitedKey)
    ? state.visitedCells
    : [...state.visitedCells, nextVisitedKey];
  const completed = sameCell(nextCell, stage.goal);

  return {
    moved: true,
    blocked: false,
    reason: "",
    cell: nextCell,
    collectible,
    completed,
    state: {
      position: nextCell,
      visitedCells: nextVisitedCells,
      collectedIds: nextCollectedIds,
      completed,
    },
  };
}

export function getCellFromPointerEvent(event, boardElement, stage) {
  const point = clientPointFromEvent(event);
  return getCellFromClientPoint(point, boardElement, stage);
}

export function getCellFromClientPoint(point, boardElement, stage) {
  const rect = boardElement.getBoundingClientRect();
  const col = Math.floor(((point.clientX - rect.left) / rect.width) * stage.grid.columns);
  const row = Math.floor(((point.clientY - rect.top) / rect.height) * stage.grid.rows);

  return {
    row: clamp(row, 0, stage.grid.rows - 1),
    col: clamp(col, 0, stage.grid.columns - 1),
  };
}

export function directionFromCells(fromCell, toCell) {
  const rowDelta = toCell.row - fromCell.row;
  const colDelta = toCell.col - fromCell.col;

  if (rowDelta === -1 && colDelta === 0) return MAZE_DIRECTIONS.UP;
  if (rowDelta === 1 && colDelta === 0) return MAZE_DIRECTIONS.DOWN;
  if (rowDelta === 0 && colDelta === -1) return MAZE_DIRECTIONS.LEFT;
  if (rowDelta === 0 && colDelta === 1) return MAZE_DIRECTIONS.RIGHT;
  return "";
}

function findCollectibleAt(stage, state, cell) {
  return (
    stage.collectibles.find((collectible) => {
      return !state.collectedIds.includes(collectible.id) && sameCell(collectible, cell);
    }) || null
  );
}

function blockedResult(state, reason, cell = null) {
  return {
    moved: false,
    blocked: true,
    reason,
    cell,
    collectible: null,
    completed: state.completed,
    state,
  };
}

function isAdjacentCell(fromCell, toCell) {
  return Math.abs(fromCell.row - toCell.row) + Math.abs(fromCell.col - toCell.col) === 1;
}

function clientPointFromEvent(event) {
  const touch = event.changedTouches?.[0] || event.touches?.[0];
  if (touch) {
    return {
      clientX: touch.clientX,
      clientY: touch.clientY,
    };
  }

  return {
    clientX: event.clientX,
    clientY: event.clientY,
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}
