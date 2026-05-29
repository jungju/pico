export const MEMORY_CARDS_SCHEMA_VERSION = 1;
export const MEMORY_MATCH_MODES = {
  IMAGE_IMAGE: "image_image",
  IMAGE_WORD: "image_word",
  WORD_AUDIO: "word_audio",
};

export function defineMemoryCardsStage(stage) {
  return normalizeMemoryCardsStage(stage);
}

export function normalizeMemoryCardsStage(stage) {
  const matchMode = normalizeMatchMode(stage.matchMode);

  return {
    schemaVersion: MEMORY_CARDS_SCHEMA_VERSION,
    id: requiredString(stage.id, "stage.id"),
    title: requiredString(stage.title, "stage.title"),
    titleKo: optionalString(stage.titleKo),
    theme: optionalString(stage.theme) || "general",
    level: positiveInteger(stage.level, 1),
    estimatedMinutes: positiveInteger(stage.estimatedMinutes, 3),
    matchMode,
    previewImage: optionalString(stage.previewImage),
    pairs: requiredArray(stage.pairs, "stage.pairs").map((pair, index) => normalizePair(pair, index, matchMode)),
  };
}

function normalizePair(pair, index, matchMode) {
  const id = optionalString(pair.id) || `pair-${index + 1}`;

  return {
    id,
    word: requiredString(pair.word, `pairs[${index}].word`),
    meaning: requiredString(pair.meaning, `pairs[${index}].meaning`),
    phonetic: optionalString(pair.phonetic),
    sentence: optionalString(pair.sentence),
    translation: optionalString(pair.translation),
    audio: optionalString(pair.audio),
    cardFaces: normalizeCardFaces(pair.cardFaces || pair.faces, id, index, matchMode),
  };
}

function normalizeCardFaces(cardFaces, pairId, pairIndex, matchMode) {
  const faces = requiredArray(cardFaces, `pairs[${pairIndex}].cardFaces`);

  if (faces.length !== 2) {
    throw new Error(`pairs[${pairIndex}].cardFaces must contain exactly two faces`);
  }

  return faces.map((face, faceIndex) => ({
    id: optionalString(face.id) || `${pairId}-${faceIndex + 1}`,
    type: normalizeFaceType(face.type, matchMode, faceIndex),
    label: optionalString(face.label),
    image: optionalString(face.image),
    emoji: optionalString(face.emoji),
    alt: optionalString(face.alt),
    audio: optionalString(face.audio),
  }));
}

function normalizeMatchMode(matchMode) {
  const value = optionalString(matchMode) || MEMORY_MATCH_MODES.IMAGE_IMAGE;
  if (Object.values(MEMORY_MATCH_MODES).includes(value)) return value;
  throw new Error(`Unsupported memory match mode: ${value}`);
}

function normalizeFaceType(type, matchMode, faceIndex) {
  const value = optionalString(type);
  if (value) return value;
  if (matchMode === MEMORY_MATCH_MODES.IMAGE_WORD) return faceIndex === 0 ? "image" : "word";
  if (matchMode === MEMORY_MATCH_MODES.WORD_AUDIO) return faceIndex === 0 ? "word" : "audio";
  return "image";
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

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}
