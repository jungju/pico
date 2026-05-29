export const HIDDEN_OBJECTS_SCHEMA_VERSION = 1;
export const HIDDEN_OBJECTS_AREA_TYPES = ["circle", "rect", "polygon"];

export function defineHiddenObjectsStage(stage) {
  return normalizeHiddenObjectsStage(stage);
}

export function normalizeHiddenObjectsStage(stage) {
  const scene = normalizeScene(stage.scene || {});

  return {
    schemaVersion: HIDDEN_OBJECTS_SCHEMA_VERSION,
    id: requiredString(stage.id, "stage.id"),
    title: requiredString(stage.title, "stage.title"),
    titleKo: optionalString(stage.titleKo),
    theme: optionalString(stage.theme) || "general",
    level: positiveInteger(stage.level, 1),
    estimatedMinutes: positiveInteger(stage.estimatedMinutes, 3),
    scene,
    targets: requiredArray(stage.targets, "stage.targets").map(normalizeTarget),
  };
}

function normalizeScene(scene) {
  return {
    image: requiredString(scene.image, "scene.image"),
    width: positiveNumber(scene.width, 1),
    height: positiveNumber(scene.height, 1),
    alt: optionalString(scene.alt),
  };
}

function normalizeTarget(target, index) {
  return {
    id: optionalString(target.id) || `target-${index + 1}`,
    word: requiredString(target.word, `targets[${index}].word`),
    meaning: requiredString(target.meaning, `targets[${index}].meaning`),
    phonetic: optionalString(target.phonetic),
    sentence: optionalString(target.sentence),
    translation: optionalString(target.translation),
    area: normalizeArea(target.area, `targets[${index}].area`),
    marker: normalizeMarker(target.marker, target.area),
    hint: optionalString(target.hint),
  };
}

function normalizeArea(area, label) {
  if (!area || !HIDDEN_OBJECTS_AREA_TYPES.includes(area.type)) {
    throw new Error(`${label} must use circle, rect, or polygon`);
  }

  if (area.type === "circle") {
    return {
      type: "circle",
      x: finiteNumber(area.x, 0),
      y: finiteNumber(area.y, 0),
      r: positiveNumber(area.r, 1),
    };
  }

  if (area.type === "rect") {
    return {
      type: "rect",
      x: finiteNumber(area.x, 0),
      y: finiteNumber(area.y, 0),
      w: positiveNumber(area.w, 1),
      h: positiveNumber(area.h, 1),
    };
  }

  return {
    type: "polygon",
    points: requiredArray(area.points, `${label}.points`).map((point) => {
      return [finiteNumber(point?.[0], 0), finiteNumber(point?.[1], 0)];
    }),
  };
}

function normalizeMarker(marker, area) {
  if (marker) {
    return {
      x: finiteNumber(marker.x, 50),
      y: finiteNumber(marker.y, 50),
    };
  }

  if (area?.type === "rect") {
    return {
      x: finiteNumber(area.x, 0) + positiveNumber(area.w, 1) / 2,
      y: finiteNumber(area.y, 0) + positiveNumber(area.h, 1) / 2,
    };
  }

  if (area?.type === "circle") {
    return {
      x: finiteNumber(area.x, 50),
      y: finiteNumber(area.y, 50),
    };
  }

  const points = Array.isArray(area?.points) ? area.points : [];
  if (points.length > 0) {
    const totals = points.reduce(
      (result, point) => ({
        x: result.x + finiteNumber(point?.[0], 0),
        y: result.y + finiteNumber(point?.[1], 0),
      }),
      { x: 0, y: 0 },
    );

    return {
      x: totals.x / points.length,
      y: totals.y / points.length,
    };
  }

  return { x: 50, y: 50 };
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

function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function positiveNumber(value, fallback) {
  const number = finiteNumber(value, fallback);
  return number > 0 ? number : fallback;
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}
