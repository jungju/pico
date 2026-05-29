export const POINT_VALUES = {
  DIFFERENCE_FOUND: 100,
  HIDDEN_OBJECT_FOUND: 100,
  MAZE_COMPLETED: 300,
  MAZE_COLLECTIBLE: 50,
  MEMORY_PAIR_MATCHED: 100,
  STAGE_COMPLETION_BONUS: 200,
};

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
