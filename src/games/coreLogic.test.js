import assert from "node:assert/strict";
import test from "node:test";
import { findDifferenceAt } from "./findLearn/hitTesting.js";
import { findHiddenTargetAt } from "./hiddenObjects/hitTesting.js";
import { hiddenPicnicStage } from "./hiddenObjects/stages/stage001.js";
import { createMazeRunState, MAZE_DIRECTIONS, moveMazePlayer } from "./maze/engine.js";
import { gardenMazeStage } from "./maze/stages/stage001.js";
import { createMemoryRunState, flipMemoryCard } from "./memoryCards/engine.js";
import { memoryAnimalsStage } from "./memoryCards/stages/stage001.js";

test("spot the difference hit testing skips already found differences", () => {
  const stage = {
    differences: [
      {
        id: "apple",
        area: { type: "rect", x: 10, y: 10, w: 20, h: 20 },
      },
    ],
  };

  assert.equal(findDifferenceAt({ x: 15, y: 15 }, stage)?.id, "apple");
  assert.equal(findDifferenceAt({ x: 15, y: 15 }, stage, new Set(["apple"])), null);
});

test("hidden objects hit testing finds only un-found targets", () => {
  const applePoint = { x: 30, y: 62 };

  assert.equal(findHiddenTargetAt(applePoint, hiddenPicnicStage)?.id, "apple");
  assert.equal(findHiddenTargetAt(applePoint, hiddenPicnicStage, new Set(["apple"])), null);
});

test("maze engine blocks walls, collects items, and completes at the goal", () => {
  let state = createMazeRunState(gardenMazeStage);

  const blocked = moveMazePlayer(gardenMazeStage, state, MAZE_DIRECTIONS.DOWN);
  assert.equal(blocked.moved, false);
  assert.equal(blocked.feedback.nudgeBack, true);
  assert.deepEqual(blocked.state.position, gardenMazeStage.start);

  for (const direction of [
    MAZE_DIRECTIONS.RIGHT,
    MAZE_DIRECTIONS.RIGHT,
    MAZE_DIRECTIONS.DOWN,
    MAZE_DIRECTIONS.DOWN,
    MAZE_DIRECTIONS.LEFT,
    MAZE_DIRECTIONS.LEFT,
  ]) {
    state = moveMazePlayer(gardenMazeStage, state, direction).state;
  }

  assert.deepEqual(state.position, { row: 2, col: 0 });
  assert.deepEqual(state.collectedIds, ["star"]);

  for (const direction of [
    MAZE_DIRECTIONS.DOWN,
    MAZE_DIRECTIONS.DOWN,
    MAZE_DIRECTIONS.DOWN,
    MAZE_DIRECTIONS.DOWN,
    MAZE_DIRECTIONS.RIGHT,
    MAZE_DIRECTIONS.RIGHT,
    MAZE_DIRECTIONS.RIGHT,
    MAZE_DIRECTIONS.RIGHT,
    MAZE_DIRECTIONS.RIGHT,
    MAZE_DIRECTIONS.RIGHT,
  ]) {
    state = moveMazePlayer(gardenMazeStage, state, direction).state;
  }

  assert.equal(state.completed, true);
  assert.deepEqual(state.collectedIds, ["star", "gem"]);
});

test("memory engine records mismatch delay and matched pairs", () => {
  let state = createMemoryRunState(memoryAnimalsStage);
  const firstCard = state.deck[0];
  const mismatchCard = state.deck.find((card) => card.pairId !== firstCard.pairId);
  const matchCard = state.deck.find((card) => card.pairId === firstCard.pairId && card.id !== firstCard.id);

  state = flipMemoryCard(memoryAnimalsStage, state, firstCard.id).state;
  const mismatch = flipMemoryCard(memoryAnimalsStage, state, mismatchCard.id);

  assert.equal(mismatch.reason, "mismatch");
  assert.equal(mismatch.needsMismatchDelay, true);
  assert.equal(mismatch.state.attempts, 1);

  state = createMemoryRunState(memoryAnimalsStage);
  state = flipMemoryCard(memoryAnimalsStage, state, firstCard.id).state;
  const matched = flipMemoryCard(memoryAnimalsStage, state, matchCard.id);

  assert.equal(matched.reason, "matched");
  assert.deepEqual(matched.state.matchedPairIds, [firstCard.pairId]);
  assert.equal(matched.state.attempts, 1);
});
