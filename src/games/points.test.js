import assert from "node:assert/strict";
import test from "node:test";
import { GAME_TYPES } from "./gameTypes.js";
import {
  awardStageCompletionBonus,
  awardStageEventPoints,
  POINT_EVENTS,
  POINT_VALUES,
} from "./points.js";
import { awardDailyStreakReward, qualifyDailyVisit } from "./streaks.js";

const stage = {
  id: "spot-test",
  gameType: GAME_TYPES.SPOT_THE_DIFFERENCE,
  points: {
    completionBonus: POINT_VALUES.STAGE_COMPLETION_BONUS,
  },
};

test("awards stage event points once per event item", () => {
  const first = awardStageEventPoints(emptyProgress(), stage, {
    event: POINT_EVENTS.DIFFERENCE_FOUND,
    itemId: "apple",
    now: "2026-05-30T00:00:00.000Z",
  });

  assert.equal(first.awardedPoints, POINT_VALUES.DIFFERENCE_FOUND);
  assert.equal(first.progress.totalPoints, POINT_VALUES.DIFFERENCE_FOUND);
  assert.equal(first.progress.games[stage.gameType].points, POINT_VALUES.DIFFERENCE_FOUND);
  assert.equal(first.progress.stages[stage.id].score, POINT_VALUES.DIFFERENCE_FOUND);

  const duplicate = awardStageEventPoints(first.progress, stage, {
    event: POINT_EVENTS.DIFFERENCE_FOUND,
    itemId: "apple",
    now: "2026-05-30T00:01:00.000Z",
  });

  assert.equal(duplicate.awardedPoints, 0);
  assert.equal(duplicate.progress.totalPoints, POINT_VALUES.DIFFERENCE_FOUND);
});

test("awards completion bonus once per stage", () => {
  const first = awardStageCompletionBonus(emptyProgress(), stage, {
    now: "2026-05-30T00:00:00.000Z",
  });

  assert.equal(first.awardedPoints, POINT_VALUES.STAGE_COMPLETION_BONUS);
  assert.equal(first.progress.totalPoints, POINT_VALUES.STAGE_COMPLETION_BONUS);
  assert.equal(first.progress.stages[stage.id].completed, true);
  assert.equal(first.progress.stages[stage.id].completionBonusAwarded, true);

  const duplicate = awardStageCompletionBonus(first.progress, stage, {
    now: "2026-05-30T00:01:00.000Z",
  });

  assert.equal(duplicate.awardedPoints, 0);
  assert.equal(duplicate.progress.totalPoints, POINT_VALUES.STAGE_COMPLETION_BONUS);
});

test("qualifies daily visits and awards one streak reward per local date", () => {
  const firstVisit = qualifyDailyVisit(emptyProgress(), {
    now: new Date("2026-05-30T03:00:00"),
  });

  assert.equal(firstVisit.qualified, true);
  assert.equal(firstVisit.progress.streak.current, 1);

  const firstReward = awardDailyStreakReward(firstVisit.progress, {
    now: new Date("2026-05-30T03:01:00"),
  });

  assert.equal(firstReward.awardedPoints, 50);
  assert.equal(firstReward.progress.totalPoints, 50);

  const duplicateReward = awardDailyStreakReward(firstReward.progress, {
    now: new Date("2026-05-30T04:00:00"),
  });

  assert.equal(duplicateReward.awardedPoints, 0);
  assert.equal(duplicateReward.progress.totalPoints, 50);

  const nextVisit = qualifyDailyVisit(duplicateReward.progress, {
    now: new Date("2026-05-31T03:00:00"),
  });

  assert.equal(nextVisit.qualified, true);
  assert.equal(nextVisit.progress.streak.current, 2);

  const nextReward = awardDailyStreakReward(nextVisit.progress, {
    now: new Date("2026-05-31T03:01:00"),
  });

  assert.equal(nextReward.awardedPoints, 75);
  assert.equal(nextReward.progress.totalPoints, 125);
});

function emptyProgress() {
  return {
    version: 2,
    totalPoints: 0,
    streak: {
      current: 0,
      longest: 0,
      lastQualifiedDate: null,
      lastRewardDate: null,
    },
    games: {},
    stages: {},
  };
}
