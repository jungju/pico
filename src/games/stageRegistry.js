import { GAME_TYPES, gameTypeLabel } from "./gameTypes";
import { defaultFindLearnStage, findLearnStages } from "./findLearn/stages";

export const DEFAULT_COMPLETION_BONUS = 200;

export const gameStages = findLearnStages.map((stage) => normalizeSpotTheDifferenceStage(stage));
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
  return "General";
}
