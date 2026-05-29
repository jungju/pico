export const POINT_VALUES = {
  DIFFERENCE_FOUND: 100,
  HIDDEN_OBJECT_FOUND: 100,
  MAZE_COMPLETED: 300,
  MAZE_COLLECTIBLE: 50,
  MEMORY_PAIR_MATCHED: 100,
  STAGE_COMPLETION_BONUS: 200,
};

export const POINT_EVENTS = {
  DIFFERENCE_FOUND: "difference_found",
  HIDDEN_OBJECT_FOUND: "hidden_object_found",
  MAZE_COMPLETED: "maze_completed",
  MAZE_COLLECTIBLE: "maze_collectible",
  MEMORY_PAIR_MATCHED: "memory_pair_matched",
};

export function awardStageEventPoints(progress, stage, { event, itemId = "", now = new Date().toISOString() }) {
  const points = pointValueForEvent(event);
  const eventKey = itemId ? `${event}:${itemId}` : event;
  const nextProgress = cloneProgress(progress);
  const previousStageProgress = nextProgress.stages[stage.id] || {};
  const awardedPointEvents = Array.isArray(previousStageProgress.awardedPointEvents)
    ? previousStageProgress.awardedPointEvents
    : [];

  if (!points || awardedPointEvents.includes(eventKey)) {
    return {
      awardedPoints: 0,
      progress: nextProgress,
    };
  }

  const previousGameSummary = nextProgress.games[stage.gameType] || {};

  nextProgress.stages[stage.id] = {
    ...previousStageProgress,
    gameType: stage.gameType,
    awardedPointEvents: [...awardedPointEvents, eventKey],
    score: toNonNegativeNumber(previousStageProgress.score, 0) + points,
    updatedAt: now,
  };
  nextProgress.games[stage.gameType] = {
    ...previousGameSummary,
    points: toNonNegativeNumber(previousGameSummary.points, 0) + points,
  };
  nextProgress.totalPoints = toNonNegativeNumber(nextProgress.totalPoints, 0) + points;

  return {
    awardedPoints: points,
    progress: nextProgress,
  };
}

export function awardStageCompletionBonus(progress, stage, { now = new Date().toISOString() } = {}) {
  const bonus = stage.points?.completionBonus ?? POINT_VALUES.STAGE_COMPLETION_BONUS;
  const nextProgress = cloneProgress(progress);
  const previousStageProgress = nextProgress.stages[stage.id] || {};

  if (previousStageProgress.completionBonusAwarded) {
    return {
      awardedPoints: 0,
      progress: nextProgress,
    };
  }

  const previousGameSummary = nextProgress.games[stage.gameType] || {};
  const wasCompleted = Boolean(previousStageProgress.completed);

  nextProgress.stages[stage.id] = {
    ...previousStageProgress,
    gameType: stage.gameType,
    completed: true,
    completionBonusAwarded: true,
    completedAt: previousStageProgress.completedAt || now,
    score: toNonNegativeNumber(previousStageProgress.score, 0) + bonus,
    updatedAt: now,
  };
  nextProgress.games[stage.gameType] = {
    ...previousGameSummary,
    completedStages: toNonNegativeNumber(previousGameSummary.completedStages, 0) + (wasCompleted ? 0 : 1),
    points: toNonNegativeNumber(previousGameSummary.points, 0) + bonus,
  };
  nextProgress.totalPoints = toNonNegativeNumber(nextProgress.totalPoints, 0) + bonus;

  return {
    awardedPoints: bonus,
    progress: nextProgress,
  };
}

export function pointValueForEvent(event) {
  if (event === POINT_EVENTS.DIFFERENCE_FOUND) return POINT_VALUES.DIFFERENCE_FOUND;
  if (event === POINT_EVENTS.HIDDEN_OBJECT_FOUND) return POINT_VALUES.HIDDEN_OBJECT_FOUND;
  if (event === POINT_EVENTS.MAZE_COMPLETED) return POINT_VALUES.MAZE_COMPLETED;
  if (event === POINT_EVENTS.MAZE_COLLECTIBLE) return POINT_VALUES.MAZE_COLLECTIBLE;
  if (event === POINT_EVENTS.MEMORY_PAIR_MATCHED) return POINT_VALUES.MEMORY_PAIR_MATCHED;
  return 0;
}

function cloneProgress(progress) {
  return {
    version: 2,
    totalPoints: toNonNegativeNumber(progress?.totalPoints, 0),
    streak: {
      current: toNonNegativeNumber(progress?.streak?.current, 0),
      longest: toNonNegativeNumber(progress?.streak?.longest, 0),
      lastQualifiedDate: progress?.streak?.lastQualifiedDate || null,
      lastRewardDate: progress?.streak?.lastRewardDate || null,
    },
    games: { ...(progress?.games || {}) },
    stages: { ...(progress?.stages || {}) },
  };
}

function toNonNegativeNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}
