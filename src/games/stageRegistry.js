import { GAME_TYPES, gameTypeLabel } from "./gameTypes";
import { defaultFindLearnStage, findLearnStages } from "./findLearn/stages";
import { hiddenObjectStages } from "./hiddenObjects/stages";
import { mazeStages } from "./maze/stages";

export const DEFAULT_COMPLETION_BONUS = 200;

export const gameStages = [
  ...findLearnStages.map((stage) => normalizeSpotTheDifferenceStage(stage)),
  ...hiddenObjectStages.map((stage) => normalizeHiddenObjectsStage(stage)),
  ...mazeStages.map((stage) => normalizeMazeStage(stage)),
];
export const defaultGameStage = gameStages[0];

function normalizeSpotTheDifferenceStage(stage) {
  const gameType = GAME_TYPES.SPOT_THE_DIFFERENCE;

  return {
    id: stage.id,
    gameType,
    title: stage.title,
    titleKo: stage.titleKo || "",
    level: stage.level || inferSpotTheDifferenceLevel(stage),
    theme: stage.theme || inferTheme(stage),
    estimatedMinutes: stage.estimatedMinutes || 3,
    previewImage: stage.previewImage || stage.images?.changed || defaultFindLearnStage.previewImage,
    category: stage.titleKo ? `${gameTypeLabel(gameType)} · ${stage.titleKo}` : gameTypeLabel(gameType),
    badges: [`Level ${stage.level || inferSpotTheDifferenceLevel(stage)}`, themeLabel(stage.theme || inferTheme(stage))],
    points: {
      completionBonus: stage.points?.completionBonus || DEFAULT_COMPLETION_BONUS,
    },
    stage,
  };
}

function normalizeHiddenObjectsStage(stage) {
  const gameType = GAME_TYPES.HIDDEN_OBJECTS;

  return {
    id: stage.id,
    gameType,
    title: stage.title,
    titleKo: stage.titleKo || "",
    level: stage.level || 1,
    theme: stage.theme || "general",
    estimatedMinutes: stage.estimatedMinutes || 3,
    previewImage: stage.scene.image,
    category: stage.titleKo ? `${gameTypeLabel(gameType)} · ${stage.titleKo}` : gameTypeLabel(gameType),
    badges: [`Level ${stage.level || 1}`, themeLabel(stage.theme || "general")],
    points: {
      completionBonus: stage.points?.completionBonus || DEFAULT_COMPLETION_BONUS,
    },
    stage,
  };
}

function normalizeMazeStage(stage) {
  const gameType = GAME_TYPES.MAZE;

  return {
    id: stage.id,
    gameType,
    title: stage.title,
    titleKo: stage.titleKo || "",
    level: stage.level || 1,
    theme: stage.theme || "general",
    estimatedMinutes: stage.estimatedMinutes || 3,
    previewImage: stage.themeImage || defaultFindLearnStage.previewImage,
    category: stage.titleKo ? `${gameTypeLabel(gameType)} · ${stage.titleKo}` : gameTypeLabel(gameType),
    badges: [`Level ${stage.level || 1}`, themeLabel(stage.theme || "general")],
    points: {
      completionBonus: 0,
    },
    stage,
  };
}

function inferSpotTheDifferenceLevel(stage) {
  const count = stage.differences?.length || 0;
  if (count <= 4) return 1;
  if (count <= 8) return 2;
  return 3;
}

function inferTheme(stage) {
  const title = `${stage.title || ""} ${stage.titleKo || ""}`.toLowerCase();
  if (title.includes("bedroom") || title.includes("방")) return "bedroom";
  if (title.includes("playground") || title.includes("놀이터")) return "playground";
  if (title.includes("picnic") || title.includes("소풍")) return "picnic";
  return "general";
}

function themeLabel(theme) {
  if (theme === "bedroom") return "Bedroom";
  if (theme === "playground") return "Playground";
  if (theme === "picnic") return "Picnic";
  if (theme === "garden") return "Garden";
  return "General";
}
