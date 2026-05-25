const contentJsonModules = import.meta.glob("../../../../contents/*.json", {
  eager: true,
  import: "default",
});
const contentImageModules = import.meta.glob("../../../../contents/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
  query: "?url",
});
const DEFAULT_HIT_PADDING_PX = 24;

export const contentStages = Object.entries(contentJsonModules)
  .map(([jsonPath, content]) => buildContentStage(jsonPath, content))
  .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

function buildContentStage(jsonPath, content) {
  const stem = basename(jsonPath).replace(/\.json$/, "");
  const image = findImageForStem(stem);

  if (!image) {
    throw new Error(`Missing content image for ${jsonPath}`);
  }

  const panels = {
    left: normalizePanel(content.panels?.left, "left", content),
    right: normalizePanel(content.panels?.right, "right", content),
  };
  const hitPadding = toNonNegativeNumber(content.hitPadding, DEFAULT_HIT_PADDING_PX);

  return {
    id: content.id || stem,
    title: content.title || stem,
    titleKo: content.titleKo || "",
    layout: "split-image",
    previewImage: image,
    combinedImage: image,
    imageWidth: toPositiveNumber(content.imageWidth, panels.left.width + panels.right.width),
    imageHeight: toPositiveNumber(content.imageHeight, Math.max(panels.left.height, panels.right.height)),
    panels,
    differences: (content.differences || []).map((difference, index) =>
      normalizeDifference(difference, panels, index, hitPadding),
    ),
    objects: [],
  };
}

function normalizePanel(panel, side, content) {
  if (panel) {
    return {
      side,
      x: toFiniteNumber(panel.x, 0),
      y: toFiniteNumber(panel.y, 0),
      width: toPositiveNumber(panel.width, 1),
      height: toPositiveNumber(panel.height, 1),
    };
  }

  const imageWidth = toPositiveNumber(content.imageWidth, 2);
  const imageHeight = toPositiveNumber(content.imageHeight, 1);
  const width = imageWidth / 2;

  return {
    side,
    x: side === "left" ? 0 : width,
    y: 0,
    width,
    height: imageHeight,
  };
}

function normalizeDifference(difference, panels, index, defaultHitPadding) {
  const targetSide = panels[difference.targetSide] ? difference.targetSide : "right";
  const panel = panels[targetSide];
  const bbox = normalizeBbox(difference.bbox);
  const hitPadding = toNonNegativeNumber(difference.hitPadding, defaultHitPadding);
  const hitBbox = expandBbox(bbox, hitPadding, panel);
  const area = bboxToArea(hitBbox, panel);
  const marker = bboxToMarker(bbox, panel);
  const label = difference.description || difference.label || "The picture is different.";

  return {
    id: difference.id || `difference-${index + 1}`,
    label,
    labelKo: difference.labelKo || "",
    targetSide,
    areaBySide: {
      [targetSide]: area,
    },
    markerBySide: {
      [targetSide]: marker,
    },
    area,
    marker,
    word: difference.label || "",
    meaning: difference.labelKo || "",
    sentence: difference.voiceText || label,
    translation: difference.translation || difference.descriptionKo || "",
    voiceText: difference.voiceText || label,
    audio: difference.audio || "",
    hitPadding,
  };
}

function bboxToArea(bbox, panel) {
  const box = normalizeBbox(bbox);

  return {
    type: "rect",
    x: ((box.x - panel.x) / panel.width) * 100,
    y: ((box.y - panel.y) / panel.height) * 100,
    w: (box.width / panel.width) * 100,
    h: (box.height / panel.height) * 100,
  };
}

function bboxToMarker(bbox, panel) {
  const box = normalizeBbox(bbox);

  return {
    x: ((box.x + box.width / 2 - panel.x) / panel.width) * 100,
    y: ((box.y + box.height / 2 - panel.y) / panel.height) * 100,
  };
}

function normalizeBbox(bbox) {
  return {
    x: toFiniteNumber(bbox?.x, 0),
    y: toFiniteNumber(bbox?.y, 0),
    width: toPositiveNumber(bbox?.width, 1),
    height: toPositiveNumber(bbox?.height, 1),
  };
}

function expandBbox(bbox, padding, panel) {
  const x = Math.max(panel.x, bbox.x - padding);
  const y = Math.max(panel.y, bbox.y - padding);
  const right = Math.min(panel.x + panel.width, bbox.x + bbox.width + padding);
  const bottom = Math.min(panel.y + panel.height, bbox.y + bbox.height + padding);

  return {
    x,
    y,
    width: Math.max(1, right - x),
    height: Math.max(1, bottom - y),
  };
}

function findImageForStem(stem) {
  const imageEntry = Object.entries(contentImageModules).find(([imagePath]) => {
    return basename(imagePath).replace(/\.(png|jpe?g|webp)$/i, "") === stem;
  });
  return imageEntry?.[1] || "";
}

function basename(path) {
  return path.split("/").pop() || path;
}

function toFiniteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toPositiveNumber(value, fallback) {
  const number = toFiniteNumber(value, fallback);
  return number > 0 ? number : fallback;
}

function toNonNegativeNumber(value, fallback) {
  const number = toFiniteNumber(value, fallback);
  return number >= 0 ? number : fallback;
}
