import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_ASSET_DIR = path.join(ROOT, "public", "assets");
const GENERATED_STAGE_FILE = path.join(ROOT, "src", "games", "memoryCards", "stages", "generatedStages.js");

const MEMORY_MATCH_MODES = {
  IMAGE_IMAGE: "image_image",
  IMAGE_WORD: "image_word",
};

const STAGES = [
  ["memory_classroom_001", "Classroom Cards", "교실 카드", "classroom", 1, 4, MEMORY_MATCH_MODES.IMAGE_IMAGE, ["pencil", "book", "star", "apple", "backpack", "paintbrush", "clock", "cup"]],
  ["memory_kitchen_001", "Kitchen Cards", "부엌 카드", "kitchen", 1, 4, MEMORY_MATCH_MODES.IMAGE_IMAGE, ["apple", "cup", "cupcake", "spoon", "plate", "banana", "carrot", "bag"]],
  ["memory_garden_001", "Garden Cards", "정원 카드", "garden", 1, 4, MEMORY_MATCH_MODES.IMAGE_IMAGE, ["flower", "butterfly", "watering_can", "bird", "boot", "bug", "leaf", "tree"]],
  ["memory_toy_room_001", "Toy Room Cards", "장난감 방 카드", "toys", 1, 4, MEMORY_MATCH_MODES.IMAGE_IMAGE, ["robot", "car", "ball", "blocks", "drum", "teddy", "gift", "star"]],
  ["memory_zoo_001", "Zoo Cards", "동물원 카드", "zoo", 1, 4, MEMORY_MATCH_MODES.IMAGE_IMAGE, ["bird", "fish", "leaf", "hat", "balloon", "camera", "apple", "book"]],
  ["memory_beach_001", "Beach Cards", "해변 카드", "beach", 1, 4, MEMORY_MATCH_MODES.IMAGE_IMAGE, ["umbrella", "ball", "boat", "shell", "bucket", "fish", "star", "hat"]],
  ["memory_space_001", "Space Cards", "우주 카드", "space", 1, 4, MEMORY_MATCH_MODES.IMAGE_IMAGE, ["star", "rocket", "moon", "planet", "robot", "book", "flag", "clock"]],
  ["memory_museum_001", "Museum Cards", "박물관 카드", "museum", 1, 4, MEMORY_MATCH_MODES.IMAGE_IMAGE, ["dinosaur", "leaf", "bone", "hat", "flag", "clock", "book", "star"]],
  ["memory_rain_001", "Rainy Day Cards", "비 오는 날 카드", "rain", 2, 6, MEMORY_MATCH_MODES.IMAGE_WORD, ["umbrella", "boot", "cloud", "book", "cup", "sock", "star", "bag"]],
  ["memory_library_001", "Library Cards", "도서관 카드", "library", 2, 6, MEMORY_MATCH_MODES.IMAGE_WORD, ["book", "lamp", "pencil", "clock", "backpack", "star", "cup", "apple"]],
  ["memory_camping_001", "Camping Cards", "캠핑 카드", "camping", 2, 6, MEMORY_MATCH_MODES.IMAGE_WORD, ["tent", "star", "moon", "cup", "fish", "flag", "boot", "leaf"]],
  ["memory_music_001", "Music Room Cards", "음악 방 카드", "music", 2, 6, MEMORY_MATCH_MODES.IMAGE_WORD, ["drum", "star", "book", "balloon", "robot", "guitar", "cup", "flag"]],
  ["memory_snow_001", "Snow Cards", "눈 놀이 카드", "snow", 2, 6, MEMORY_MATCH_MODES.IMAGE_WORD, ["snowman", "hat", "star", "boot", "scarf", "tree", "cup", "book"]],
  ["memory_farm_001", "Farm Cards", "농장 카드", "farm", 2, 6, MEMORY_MATCH_MODES.IMAGE_WORD, ["apple", "bird", "flower", "bucket", "hat", "carrot", "leaf", "tree"]],
  ["memory_party_001", "Birthday Cards", "생일 카드", "party", 2, 6, MEMORY_MATCH_MODES.IMAGE_WORD, ["cupcake", "balloon", "star", "gift", "hat", "cup", "book", "apple"]],
  ["memory_ocean_001", "Ocean Cards", "바다 카드", "ocean", 2, 6, MEMORY_MATCH_MODES.IMAGE_WORD, ["fish", "shell", "boat", "starfish", "bucket", "crab", "moon", "flag"]],
  ["memory_station_001", "Station Cards", "기차역 카드", "station", 3, 8, MEMORY_MATCH_MODES.IMAGE_WORD, ["train", "clock", "backpack", "flag", "book", "balloon", "cup", "star"]],
  ["memory_doctor_001", "Doctor Kit Cards", "병원 놀이 카드", "doctor", 3, 8, MEMORY_MATCH_MODES.IMAGE_WORD, ["star", "book", "cup", "clock", "doctor_bag", "heart", "pencil", "hat"]],
  ["memory_market_001", "Market Cards", "시장 카드", "market", 3, 8, MEMORY_MATCH_MODES.IMAGE_WORD, ["apple", "banana", "carrot", "bag", "cup", "flower", "book", "balloon"]],
];

const VOCAB = {
  apple: ["apple", "사과"],
  backpack: ["backpack", "가방"],
  bag: ["bag", "가방"],
  ball: ["ball", "공"],
  balloon: ["balloon", "풍선"],
  banana: ["banana", "바나나"],
  bird: ["bird", "새"],
  blocks: ["blocks", "블록"],
  boat: ["boat", "배"],
  bone: ["bone", "뼈"],
  book: ["book", "책"],
  boot: ["boot", "장화"],
  bucket: ["bucket", "양동이"],
  bug: ["bug", "벌레"],
  butterfly: ["butterfly", "나비"],
  camera: ["camera", "카메라"],
  car: ["toy car", "장난감 자동차"],
  carrot: ["carrot", "당근"],
  clock: ["clock", "시계"],
  cloud: ["cloud", "구름"],
  crab: ["crab", "게"],
  cup: ["cup", "컵"],
  cupcake: ["cupcake", "컵케이크"],
  dinosaur: ["dinosaur", "공룡"],
  doctor_bag: ["doctor bag", "의사 가방"],
  drum: ["drum", "북"],
  fish: ["fish", "물고기"],
  flag: ["flag", "깃발"],
  flower: ["flower", "꽃"],
  gift: ["gift", "선물"],
  guitar: ["guitar", "기타"],
  hat: ["hat", "모자"],
  heart: ["heart", "하트"],
  kite: ["kite", "연"],
  lamp: ["lamp", "램프"],
  leaf: ["leaf", "잎"],
  moon: ["moon", "달"],
  paintbrush: ["paint brush", "붓"],
  pencil: ["pencil", "연필"],
  planet: ["planet", "행성"],
  plate: ["plate", "접시"],
  robot: ["robot", "로봇"],
  rocket: ["rocket", "로켓"],
  scarf: ["scarf", "목도리"],
  shell: ["shell", "조개"],
  snowman: ["snowman", "눈사람"],
  sock: ["sock", "양말"],
  spoon: ["spoon", "숟가락"],
  star: ["star", "별"],
  starfish: ["starfish", "불가사리"],
  teddy: ["teddy bear", "곰인형"],
  tent: ["tent", "텐트"],
  train: ["train", "기차"],
  tree: ["tree", "나무"],
  umbrella: ["umbrella", "우산"],
  watering_can: ["watering can", "물뿌리개"],
};

const COLORS = ["#f45d5d", "#4aa3ff", "#5ac878", "#ffd45a", "#a982ff", "#ff9f45"];

mkdirSync(PUBLIC_ASSET_DIR, { recursive: true });

const uniqueKinds = new Set(STAGES.flatMap((stage) => stage[7]));
for (const kind of uniqueKinds) {
  const [word] = VOCAB[kind];
  const color = COLORS[[...uniqueKinds].indexOf(kind) % COLORS.length];
  const accent = COLORS[([...uniqueKinds].indexOf(kind) + 2) % COLORS.length];
  writeFileSync(
    path.join(PUBLIC_ASSET_DIR, `memory-word-${assetStem(kind)}.svg`),
    `${renderWordAsset({ kind, word, color, accent })}\n`,
  );
}

const stageDefinitions = STAGES.map(([id, title, titleKo, theme, level, pairCount, matchMode, kinds], stageIndex) => {
  const selectedKinds = kinds.slice(0, pairCount);
  const previewImage = `/assets/${id}.svg`;
  writeFileSync(path.join(PUBLIC_ASSET_DIR, `${id}.svg`), `${renderPreview({ title, theme, kinds: selectedKinds, stageIndex })}\n`);

  return {
    id,
    title,
    titleKo,
    theme,
    level,
    estimatedMinutes: level === 1 ? 3 : level === 2 ? 4 : 5,
    matchMode,
    previewImage,
    pairs: selectedKinds.map((kind) => createPair(kind, matchMode)),
  };
});

writeFileSync(
  GENERATED_STAGE_FILE,
  `import { defineMemoryCardsStage } from "./schema.js";\n\nconst generatedMemoryStageDefinitions = ${JSON.stringify(stageDefinitions, null, 2)};\n\nexport const generatedMemoryCardStages = generatedMemoryStageDefinitions.map(defineMemoryCardsStage);\n`,
);

console.log(`Generated ${STAGES.length} Memory Cards stages and ${uniqueKinds.size} reusable word assets.`);

function createPair(kind, matchMode) {
  const [word, meaning] = VOCAB[kind];
  const image = `/assets/memory-word-${assetStem(kind)}.svg`;
  const base = {
    id: kind,
    word,
    meaning,
    sentence: `I matched the ${word}.`,
    translation: `${meaning} 짝을 맞췄어요.`,
  };

  if (matchMode === MEMORY_MATCH_MODES.IMAGE_WORD) {
    return {
      ...base,
      cardFaces: [
        { id: `${kind}-image`, type: "image", image, alt: word },
        { id: `${kind}-word`, type: "word", label: word },
      ],
    };
  }

  return {
    ...base,
    cardFaces: [
      { id: `${kind}-a`, type: "image", image, alt: word },
      { id: `${kind}-b`, type: "image", image, alt: word },
    ],
  };
}

function assetStem(value) {
  return value.replaceAll("_", "-");
}

function renderPreview({ title, theme, kinds, stageIndex }) {
  const palette = themePalette(theme);
  const cards = kinds.slice(0, 4).map((kind, index) => {
    const x = 78 + (index % 2) * 190;
    const y = 168 + Math.floor(index / 2) * 178;
    const color = COLORS[(stageIndex + index) % COLORS.length];
    const accent = COLORS[(stageIndex + index + 2) % COLORS.length];
    return `<rect x="${x}" y="${y}" width="148" height="126" rx="18" fill="#ffffff" stroke="#143c56" stroke-width="8"/>
      ${renderIcon(kind, { x: x + 32, y: y + 24, width: 84, height: 78 }, color, accent)}`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" viewBox="0 0 520 520" role="img" aria-label="${escapeXml(title)} preview">
  <rect width="520" height="520" rx="36" fill="${palette.background}"/>
  <path d="M0 378 C92 330 166 404 260 362 C372 314 438 392 520 352 V520 H0Z" fill="${palette.ground}" opacity="0.95"/>
  <circle cx="94" cy="86" r="38" fill="${palette.accent}" opacity="0.85"/>
  <text x="260" y="88" text-anchor="middle" font-size="34" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#143c56">${escapeXml(title)}</text>
  ${cards.join("\n  ")}
</svg>`;
}

function renderWordAsset({ kind, word, color, accent }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220" role="img" aria-label="${escapeXml(word)}">
  <rect width="220" height="220" rx="32" fill="#fff8df"/>
  <circle cx="178" cy="44" r="26" fill="#ffd45a" opacity="0.82"/>
  ${renderIcon(kind, { x: 42, y: 34, width: 136, height: 132 }, color, accent)}
  <text x="110" y="194" text-anchor="middle" font-size="24" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#143c56">${escapeXml(word)}</text>
</svg>`;
}

function renderIcon(kind, box, primary, accent) {
  const { x, y, width, height } = box;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const r = Math.min(width, height) / 2;
  const common = `stroke="#143c56" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;

  if (kind === "star" || kind === "starfish") return `<path d="${starPath(cx, cy, r * 0.78, r * 0.35)}" fill="${primary}" ${common}/>`;
  if (["ball", "planet"].includes(kind)) return `<circle cx="${cx}" cy="${cy}" r="${r * 0.7}" fill="${primary}" ${common}/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.9}" ry="${r * 0.28}" fill="none" stroke="${accent}" stroke-width="10" transform="rotate(-18 ${cx} ${cy})"/>`;
  if (["book", "backpack", "bag", "doctor_bag", "blocks"].includes(kind)) return `<rect x="${x + 12}" y="${y + 16}" width="${width - 24}" height="${height - 32}" rx="18" fill="${primary}" ${common}/><rect x="${cx - 24}" y="${cy - 14}" width="48" height="34" rx="9" fill="${accent}" ${common}/>`;
  if (["apple", "flower", "tree"].includes(kind)) return `<circle cx="${cx}" cy="${cy + 8}" r="${r * 0.58}" fill="${primary}" ${common}/><path d="M${cx + 2} ${cy - 42} C${cx + 28} ${cy - 72} ${cx + 66} ${cy - 50} ${cx + 42} ${cy - 24}Z" fill="#5ac878" ${common}/>`;
  if (["bird", "fish", "dinosaur", "crab"].includes(kind)) return `<ellipse cx="${cx - 10}" cy="${cy}" rx="${r * 0.64}" ry="${r * 0.44}" fill="${primary}" ${common}/><path d="M${cx + 38} ${cy} L${x + width - 4} ${cy - 34} L${x + width - 4} ${cy + 34}Z" fill="${accent}" ${common}/><circle cx="${cx - 42}" cy="${cy - 8}" r="5" fill="#143c56"/>`;
  if (["cup", "bucket", "cupcake", "plate"].includes(kind)) return `<path d="M${x + 24} ${y + 30} H${x + width - 26} L${x + width - 42} ${y + height - 16} H${x + 42}Z" fill="${primary}" ${common}/><ellipse cx="${cx}" cy="${y + 30}" rx="${r * 0.56}" ry="20" fill="${accent}" ${common}/>`;
  if (["balloon", "cloud"].includes(kind)) return `<ellipse cx="${cx}" cy="${cy - 10}" rx="${r * 0.56}" ry="${r * 0.68}" fill="${primary}" ${common}/><path d="M${cx} ${cy + 34} C${cx - 18} ${cy + 74} ${cx + 24} ${cy + 76} ${cx + 2} ${cy + 106}" fill="none" ${common}/>`;
  if (["car", "train"].includes(kind)) return `<rect x="${x + 8}" y="${cy - 28}" width="${width - 16}" height="62" rx="16" fill="${primary}" ${common}/><rect x="${x + 34}" y="${cy - 68}" width="70" height="42" rx="10" fill="${accent}" ${common}/><circle cx="${x + 36}" cy="${cy + 40}" r="15" fill="#143c56"/><circle cx="${x + width - 36}" cy="${cy + 40}" r="15" fill="#143c56"/>`;
  if (["hat", "gift"].includes(kind)) return `<ellipse cx="${cx}" cy="${cy + 34}" rx="${r * 0.78}" ry="18" fill="${accent}" ${common}/><path d="M${x + 30} ${cy + 32} C${x + 40} ${cy - 42} ${x + width - 40} ${cy - 42} ${x + width - 30} ${cy + 32}Z" fill="${primary}" ${common}/>`;
  if (["moon", "banana"].includes(kind)) return `<path d="M${cx + 34} ${cy - 58} C${cx - 28} ${cy - 42} ${cx - 58} ${cy + 24} ${cx - 18} ${cy + 66} C${cx - 74} ${cy + 46} ${cx - 88} ${cy - 42} ${cx + 34} ${cy - 58}Z" fill="${primary}" ${common}/>`;
  if (["rocket", "pencil", "paintbrush", "spoon", "carrot"].includes(kind)) return `<path d="M${cx} ${y + 6} C${cx + 44} ${y + 58} ${cx + 32} ${y + height - 28} ${cx} ${y + height - 6} C${cx - 32} ${y + height - 28} ${cx - 44} ${y + 58} ${cx} ${y + 6}Z" fill="${primary}" ${common}/><circle cx="${cx}" cy="${cy - 4}" r="17" fill="${accent}" ${common}/>`;
  if (["umbrella", "kite", "flag", "tent"].includes(kind)) return `<path d="M${x + 8} ${cy} C${x + 44} ${y + 8} ${x + width - 44} ${y + 8} ${x + width - 8} ${cy}Z" fill="${primary}" ${common}/><path d="M${cx} ${cy} V${y + height - 8}" ${common}/>`;
  if (kind === "heart") return `<path d="M${cx} ${cy + 54} C${cx - 86} ${cy} ${cx - 58} ${cy - 70} ${cx} ${cy - 34} C${cx + 58} ${cy - 70} ${cx + 86} ${cy} ${cx} ${cy + 54}Z" fill="${primary}" ${common}/>`;
  return `<rect x="${x + 14}" y="${y + 14}" width="${width - 28}" height="${height - 28}" rx="24" fill="${primary}" ${common}/><circle cx="${cx}" cy="${cy}" r="${r * 0.24}" fill="${accent}" ${common}/>`;
}

function themePalette(theme) {
  const palettes = {
    beach: ["#c5f2ff", "#ffe6a7", "#ffd45a"],
    camping: ["#2e4f6d", "#294f3b", "#ffd45a"],
    ocean: ["#c5f2ff", "#8eddf4", "#ffd45a"],
    snow: ["#eef8ff", "#dceff8", "#ffd45a"],
    space: ["#27385f", "#17233f", "#ffd45a"],
  };
  const [background, ground, accent] = palettes[theme] || ["#fff4d7", "#dff7f2", "#ffd45a"];
  return { background, ground, accent };
}

function starPath(cx, cy, outerRadius, innerRadius) {
  const points = [];
  for (let index = 0; index < 10; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    points.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
  }
  return `M${points.join(" L")} Z`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
