export const GAME_TYPES = {
  SPOT_THE_DIFFERENCE: "spot_the_difference",
  HIDDEN_OBJECTS: "hidden_objects",
  MAZE: "maze",
  MEMORY_CARDS: "memory_cards",
};

export const GAME_TYPE_META = {
  [GAME_TYPES.SPOT_THE_DIFFERENCE]: {
    title: "Spot the Difference",
    titleKo: "틀린그림 찾기",
  },
  [GAME_TYPES.HIDDEN_OBJECTS]: {
    title: "Hidden Objects",
    titleKo: "숨은그림 찾기",
  },
  [GAME_TYPES.MAZE]: {
    title: "Maze",
    titleKo: "미로 찾기",
  },
  [GAME_TYPES.MEMORY_CARDS]: {
    title: "Memory Cards",
    titleKo: "메모리 게임",
  },
};

export function gameTypeLabel(gameType) {
  return GAME_TYPE_META[gameType]?.title || "Game";
}

export function gameTypeLabelKo(gameType) {
  return GAME_TYPE_META[gameType]?.titleKo || "게임";
}
