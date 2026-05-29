import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Flag, Gem, MapPin } from "lucide-react";
import { GameShell } from "../GameShell";
import { POINT_EVENTS, POINT_VALUES } from "../points";
import {
  createMazeRunState,
  getCellFromPointerEvent,
  MAZE_DIRECTIONS,
  moveMazePlayer,
  moveMazePlayerToCell,
} from "./engine";
import { cellKey, isMazeCellBlocked, sameCell } from "./stages/schema";

const NUDGE_TIMEOUT_MS = 380;

export function MazeGame({ authState, authControl, stage, stageEntry, onBack, onNext, onPointEvent, onStageComplete }) {
  const [runState, setRunState] = useState(() => createMazeRunState(stage));
  const [message, setMessage] = useState(() => createReadyMessage(stage));
  const [completionNoticeOpen, setCompletionNoticeOpen] = useState(false);
  const [nudging, setNudging] = useState(false);
  const nudgeTimerRef = useRef(null);
  const startGoalDistance = useMemo(() => shortestPathDistance(stage, stage.start, stage.goal), [stage]);
  const currentGoalDistance = useMemo(() => shortestPathDistance(stage, runState.position, stage.goal), [stage, runState.position]);
  const completed = runState.completed;
  const progressPercent = goalProgressPercent(startGoalDistance, currentGoalDistance, completed);
  const score = calculateScore(stage, runState);
  const statusText = authState?.status === "authenticated" ? "Ready" : "Local play";
  const boardStyle = {
    "--maze-rows": stage.grid.rows,
    "--maze-columns": stage.grid.columns,
  };

  function move(direction) {
    applyMoveResult(moveMazePlayer(stage, runState, direction));
  }

  function moveToCell(cell) {
    applyMoveResult(moveMazePlayerToCell(stage, runState, cell));
  }

  function handleBoardPointerDown(event) {
    const cell = getCellFromPointerEvent(event, event.currentTarget, stage);
    moveToCell(cell);
  }

  function applyMoveResult(result) {
    if (result.moved) {
      setRunState(result.state);
    }

    setMessage({
      type: result.feedback.type,
      title: result.feedback.title,
      body: result.feedback.body,
    });

    if (result.feedback.speech) {
      speak(result.feedback.speech);
    }

    if (result.feedback.nudgeBack) {
      nudgePlayer();
    }

    if (result.collectible) {
      onPointEvent?.({ event: POINT_EVENTS.MAZE_COLLECTIBLE, itemId: result.collectible.id });
    }

    if (result.completed) {
      onPointEvent?.({ event: POINT_EVENTS.MAZE_COMPLETED, itemId: "goal" });
      onStageComplete?.();
      setCompletionNoticeOpen(true);
    }
  }

  function nudgePlayer() {
    window.clearTimeout(nudgeTimerRef.current);
    setNudging(true);
    nudgeTimerRef.current = window.setTimeout(() => setNudging(false), NUDGE_TIMEOUT_MS);
  }

  function resetGame() {
    window.clearTimeout(nudgeTimerRef.current);
    setRunState(createMazeRunState(stage));
    setMessage(createReadyMessage(stage));
    setCompletionNoticeOpen(false);
    setNudging(false);
  }

  return (
    <GameShell
      authControl={authControl}
      completed={completed}
      completionNotice={{
        hasNext: Boolean(onNext),
        open: completed && completionNoticeOpen,
        score,
        stageTitle: stage.titleKo || stage.title,
        onBack,
        onClose: () => setCompletionNoticeOpen(false),
        onNext,
      }}
      message={message}
      gameType={stageEntry?.gameType}
      onBack={onBack}
      onHint={() => setMessage(createHintMessage(stage))}
      onReset={resetGame}
      onSpeak={() => speak(message.body)}
      progressPercent={progressPercent}
      progressText={mazeProgressText(stage, runState)}
      score={score}
      stageSubtitle={stage.title}
      stageTitle={stage.titleKo || stage.title}
      statusText={statusText}
    >
      <section className="maze-stage" aria-label={stage.title}>
        <div className="maze-board" style={boardStyle} role="grid" onPointerDown={handleBoardPointerDown}>
          {stage.grid.cells.flatMap((row, rowIndex) =>
            [...row].map((value, colIndex) => {
              const cell = { row: rowIndex, col: colIndex };
              return (
                <MazeCell
                  cell={cell}
                  key={cellKey(cell)}
                  nudging={nudging}
                  runState={runState}
                  stage={stage}
                  value={value}
                />
              );
            }),
          )}
        </div>

        <div className="maze-controls" aria-label="Maze movement">
          <span className="maze-control-spacer" aria-hidden="true" />
          <button className="maze-control-up" type="button" onClick={() => move(MAZE_DIRECTIONS.UP)} aria-label="Move up" title="Move up">
            <ArrowUp aria-hidden="true" size={19} />
          </button>
          <span className="maze-control-spacer" aria-hidden="true" />
          <button className="maze-control-left" type="button" onClick={() => move(MAZE_DIRECTIONS.LEFT)} aria-label="Move left" title="Move left">
            <ArrowLeft aria-hidden="true" size={19} />
          </button>
          <span className="maze-control-center" aria-hidden="true" />
          <button className="maze-control-right" type="button" onClick={() => move(MAZE_DIRECTIONS.RIGHT)} aria-label="Move right" title="Move right">
            <ArrowRight aria-hidden="true" size={19} />
          </button>
          <span className="maze-control-spacer" aria-hidden="true" />
          <button className="maze-control-down" type="button" onClick={() => move(MAZE_DIRECTIONS.DOWN)} aria-label="Move down" title="Move down">
            <ArrowDown aria-hidden="true" size={19} />
          </button>
          <span className="maze-control-spacer" aria-hidden="true" />
        </div>
      </section>
    </GameShell>
  );
}

function MazeCell({ cell, nudging, runState, stage, value }) {
  const blocked = isMazeCellBlocked(stage, cell);
  const isStart = sameCell(stage.start, cell);
  const isGoal = sameCell(stage.goal, cell);
  const hasPlayer = sameCell(runState.position, cell);
  const visited = runState.visitedCells.includes(cellKey(cell));
  const collectible = stage.collectibles.find((item) => sameCell(item, cell));
  const collected = collectible ? runState.collectedIds.includes(collectible.id) : false;
  const nextStep = !blocked && !hasPlayer && isAdjacentMazeCell(runState.position, cell);
  const className = [
    "maze-cell",
    blocked ? "blocked" : "open",
    isStart ? "start" : "",
    isGoal ? "goal" : "",
    collectible && !collected ? "collectible" : "",
    nextStep ? "next-step" : "",
    visited ? "visited" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className} role="gridcell" aria-label={cellLabel(value, cell)}>
      {isStart ? <MapPin className="maze-cell-icon start-icon" aria-hidden="true" size={17} /> : null}
      {isGoal ? <Flag className="maze-cell-icon goal-icon" aria-hidden="true" size={17} /> : null}
      {collectible && !collected ? <Gem className="maze-cell-icon collectible-icon" aria-hidden="true" size={17} /> : null}
      {hasPlayer ? <span className={`maze-player${nudging ? " nudge" : ""}`} role="img" aria-label="Player" /> : null}
    </span>
  );
}

function createReadyMessage(stage) {
  return {
    type: "ready",
    title: stage.titleKo || stage.title,
    body: "Start to goal.",
  };
}

function createHintMessage(stage) {
  return {
    type: "word",
    title: "Hint",
    body: `Find a path to ${stage.titleKo || stage.title}.`,
  };
}

function calculateScore(stage, runState) {
  const collectiblePoints = runState.collectedIds.reduce((total, collectibleId) => {
    const collectible = stage.collectibles.find((item) => item.id === collectibleId);
    return total + (collectible?.points || POINT_VALUES.MAZE_COLLECTIBLE);
  }, 0);
  const completionPoints = runState.completed ? POINT_VALUES.MAZE_COMPLETED : 0;
  return collectiblePoints + completionPoints;
}

function goalProgressPercent(startGoalDistance, currentGoalDistance, completed) {
  if (completed) return 100;
  if (!Number.isFinite(startGoalDistance) || !Number.isFinite(currentGoalDistance) || startGoalDistance <= 0) return 0;

  const progress = ((startGoalDistance - currentGoalDistance) / startGoalDistance) * 100;
  return Math.max(0, Math.min(99, Math.round(progress)));
}

function mazeProgressText(stage, runState) {
  const gemCount = stage.collectibles.length;
  if (!gemCount) return "Goal";
  return `Goal · ${runState.collectedIds.length}/${gemCount} gems`;
}

function shortestPathDistance(stage, fromCell, toCell) {
  if (sameCell(fromCell, toCell)) return 0;

  const queue = [{ cell: fromCell, distance: 0 }];
  const seen = new Set([cellKey(fromCell)]);
  const deltas = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  for (let index = 0; index < queue.length; index += 1) {
    const item = queue[index];

    for (const delta of deltas) {
      const nextCell = {
        row: item.cell.row + delta.row,
        col: item.cell.col + delta.col,
      };
      const nextKey = cellKey(nextCell);

      if (seen.has(nextKey) || isMazeCellBlocked(stage, nextCell)) continue;
      if (sameCell(nextCell, toCell)) return item.distance + 1;

      seen.add(nextKey);
      queue.push({
        cell: nextCell,
        distance: item.distance + 1,
      });
    }
  }

  return Number.POSITIVE_INFINITY;
}

function cellLabel(value, cell) {
  return `Maze cell ${value} ${cell.row + 1}, ${cell.col + 1}`;
}

function isAdjacentMazeCell(fromCell, toCell) {
  return Math.abs(fromCell.row - toCell.row) + Math.abs(fromCell.col - toCell.col) === 1;
}

function speak(text) {
  if (!text || typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}
