import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_ASSET_DIR = path.join(ROOT, "public", "assets");
const GENERATED_STAGE_FILE = path.join(ROOT, "src", "games", "hiddenObjects", "stages", "generatedStages.js");
const SCENE_WIDTH = 1200;
const SCENE_HEIGHT = 800;

const TARGET_SLOTS = [
  { x: 12, y: 18, w: 12, h: 15, hint: "Look near the upper left." },
  { x: 42, y: 15, w: 12, h: 15, hint: "Look near the top middle." },
  { x: 73, y: 20, w: 12, h: 15, hint: "Look near the upper right." },
  { x: 18, y: 56, w: 13, h: 16, hint: "Look near the lower left." },
  { x: 48, y: 57, w: 13, h: 16, hint: "Look near the middle." },
  { x: 77, y: 66, w: 12, h: 16, hint: "Look near the lower right." },
];

const STAGES = [
  {
    id: "hidden_classroom_001",
    title: "Classroom Hunt",
    titleKo: "교실 찾기",
    theme: "classroom",
    targets: [
      ["pencil", "pencil", "연필"],
      ["book", "book", "책"],
      ["star", "star", "별"],
      ["apple", "apple", "사과"],
      ["backpack", "backpack", "가방"],
      ["paintbrush", "paint brush", "붓"],
    ],
  },
  {
    id: "hidden_kitchen_001",
    title: "Kitchen Hunt",
    titleKo: "부엌 찾기",
    theme: "kitchen",
    targets: [
      ["apple", "apple", "사과"],
      ["cup", "cup", "컵"],
      ["cupcake", "cupcake", "컵케이크"],
      ["spoon", "spoon", "숟가락"],
      ["plate", "plate", "접시"],
      ["banana", "banana", "바나나"],
    ],
  },
  {
    id: "hidden_garden_001",
    title: "Garden Hunt",
    titleKo: "정원 찾기",
    theme: "garden",
    targets: [
      ["flower", "flower", "꽃"],
      ["butterfly", "butterfly", "나비"],
      ["watering_can", "watering can", "물뿌리개"],
      ["bird", "bird", "새"],
      ["boot", "boot", "장화"],
      ["bug", "bug", "벌레"],
    ],
  },
  {
    id: "hidden_toy_room_001",
    title: "Toy Room Hunt",
    titleKo: "장난감 방 찾기",
    theme: "toys",
    targets: [
      ["robot", "robot", "로봇"],
      ["car", "toy car", "장난감 자동차"],
      ["ball", "ball", "공"],
      ["blocks", "blocks", "블록"],
      ["drum", "drum", "북"],
      ["teddy", "teddy bear", "곰인형"],
    ],
  },
  {
    id: "hidden_zoo_001",
    title: "Zoo Hunt",
    titleKo: "동물원 찾기",
    theme: "zoo",
    targets: [
      ["bird", "bird", "새"],
      ["fish", "fish", "물고기"],
      ["leaf", "leaf", "잎"],
      ["hat", "hat", "모자"],
      ["balloon", "balloon", "풍선"],
      ["camera", "camera", "카메라"],
    ],
  },
  {
    id: "hidden_beach_001",
    title: "Beach Hunt",
    titleKo: "해변 찾기",
    theme: "beach",
    targets: [
      ["umbrella", "umbrella", "우산"],
      ["ball", "beach ball", "비치볼"],
      ["boat", "boat", "배"],
      ["shell", "shell", "조개"],
      ["bucket", "bucket", "양동이"],
      ["fish", "fish", "물고기"],
    ],
  },
  {
    id: "hidden_space_room_001",
    title: "Space Room Hunt",
    titleKo: "우주 방 찾기",
    theme: "space",
    targets: [
      ["star", "star", "별"],
      ["rocket", "rocket", "로켓"],
      ["moon", "moon", "달"],
      ["planet", "planet", "행성"],
      ["robot", "robot", "로봇"],
      ["book", "book", "책"],
    ],
  },
  {
    id: "hidden_museum_001",
    title: "Museum Hunt",
    titleKo: "박물관 찾기",
    theme: "museum",
    targets: [
      ["dinosaur", "dinosaur", "공룡"],
      ["leaf", "leaf", "잎"],
      ["bone", "bone", "뼈"],
      ["hat", "hat", "모자"],
      ["flag", "flag", "깃발"],
      ["clock", "clock", "시계"],
    ],
  },
  {
    id: "hidden_rainy_day_001",
    title: "Rainy Day Hunt",
    titleKo: "비 오는 날 찾기",
    theme: "rain",
    targets: [
      ["umbrella", "umbrella", "우산"],
      ["boot", "boot", "장화"],
      ["cloud", "cloud", "구름"],
      ["book", "book", "책"],
      ["cup", "cup", "컵"],
      ["sock", "sock", "양말"],
    ],
  },
  {
    id: "hidden_library_001",
    title: "Library Hunt",
    titleKo: "도서관 찾기",
    theme: "library",
    targets: [
      ["book", "book", "책"],
      ["lamp", "lamp", "램프"],
      ["pencil", "pencil", "연필"],
      ["clock", "clock", "시계"],
      ["backpack", "backpack", "가방"],
      ["star", "star", "별"],
    ],
  },
  {
    id: "hidden_camping_001",
    title: "Camping Hunt",
    titleKo: "캠핑 찾기",
    theme: "camping",
    targets: [
      ["tent", "tent", "텐트"],
      ["star", "star", "별"],
      ["moon", "moon", "달"],
      ["cup", "cup", "컵"],
      ["fish", "fish", "물고기"],
      ["flag", "flag", "깃발"],
    ],
  },
  {
    id: "hidden_music_room_001",
    title: "Music Room Hunt",
    titleKo: "음악 방 찾기",
    theme: "music",
    targets: [
      ["drum", "drum", "북"],
      ["star", "star", "별"],
      ["book", "music book", "악보책"],
      ["balloon", "balloon", "풍선"],
      ["robot", "robot", "로봇"],
      ["guitar", "guitar", "기타"],
    ],
  },
  {
    id: "hidden_snow_001",
    title: "Snow Hunt",
    titleKo: "눈 놀이 찾기",
    theme: "snow",
    targets: [
      ["snowman", "snowman", "눈사람"],
      ["hat", "hat", "모자"],
      ["star", "star", "별"],
      ["boot", "boot", "장화"],
      ["scarf", "scarf", "목도리"],
      ["tree", "tree", "나무"],
    ],
  },
  {
    id: "hidden_farm_001",
    title: "Farm Hunt",
    titleKo: "농장 찾기",
    theme: "farm",
    targets: [
      ["apple", "apple", "사과"],
      ["bird", "bird", "새"],
      ["flower", "flower", "꽃"],
      ["bucket", "bucket", "양동이"],
      ["hat", "hat", "모자"],
      ["carrot", "carrot", "당근"],
    ],
  },
  {
    id: "hidden_birthday_001",
    title: "Birthday Hunt",
    titleKo: "생일 찾기",
    theme: "party",
    targets: [
      ["cupcake", "cupcake", "컵케이크"],
      ["balloon", "balloon", "풍선"],
      ["star", "star", "별"],
      ["gift", "gift", "선물"],
      ["hat", "party hat", "파티 모자"],
      ["cup", "cup", "컵"],
    ],
  },
  {
    id: "hidden_ocean_001",
    title: "Ocean Hunt",
    titleKo: "바다 찾기",
    theme: "ocean",
    targets: [
      ["fish", "fish", "물고기"],
      ["shell", "shell", "조개"],
      ["boat", "boat", "배"],
      ["star", "starfish", "불가사리"],
      ["bucket", "bucket", "양동이"],
      ["crab", "crab", "게"],
    ],
  },
  {
    id: "hidden_station_001",
    title: "Station Hunt",
    titleKo: "기차역 찾기",
    theme: "station",
    targets: [
      ["train", "train", "기차"],
      ["clock", "clock", "시계"],
      ["backpack", "backpack", "가방"],
      ["flag", "flag", "깃발"],
      ["book", "book", "책"],
      ["balloon", "balloon", "풍선"],
    ],
  },
  {
    id: "hidden_doctor_001",
    title: "Doctor Kit Hunt",
    titleKo: "병원 놀이 찾기",
    theme: "doctor",
    targets: [
      ["star", "star", "별"],
      ["book", "book", "책"],
      ["cup", "cup", "컵"],
      ["clock", "clock", "시계"],
      ["bag", "doctor bag", "의사 가방"],
      ["heart", "heart", "하트"],
    ],
  },
  {
    id: "hidden_market_001",
    title: "Market Hunt",
    titleKo: "시장 찾기",
    theme: "market",
    targets: [
      ["apple", "apple", "사과"],
      ["banana", "banana", "바나나"],
      ["carrot", "carrot", "당근"],
      ["bag", "bag", "가방"],
      ["cup", "cup", "컵"],
      ["flower", "flower", "꽃"],
    ],
  },
];

const COLORS = ["#f45d5d", "#4aa3ff", "#5ac878", "#ffd45a", "#a982ff", "#ff9f45"];

mkdirSync(PUBLIC_ASSET_DIR, { recursive: true });

const stageDefinitions = STAGES.map((stage, stageIndex) => {
  const assetName = `${stage.id}.svg`;
  writeFileSync(path.join(PUBLIC_ASSET_DIR, assetName), `${renderScene(stage, stageIndex)}\n`);

  return {
    id: stage.id,
    title: stage.title,
    titleKo: stage.titleKo,
    theme: stage.theme,
    level: 1,
    estimatedMinutes: 3,
    scene: {
      image: `/assets/${assetName}`,
      width: SCENE_WIDTH,
      height: SCENE_HEIGHT,
      alt: `${stage.title} scene with six hidden objects.`,
    },
    targets: stage.targets.map(([kind, word, meaning], targetIndex) => {
      const slot = TARGET_SLOTS[targetIndex];
      return {
        id: kind.replace(/_/g, "-"),
        word,
        meaning,
        sentence: `I found the ${word}.`,
        translation: `${meaning} 찾았어요.`,
        area: { type: "rect", x: slot.x, y: slot.y, w: slot.w, h: slot.h },
        hint: slot.hint,
      };
    }),
  };
});

writeFileSync(
  GENERATED_STAGE_FILE,
  `import { defineHiddenObjectsStage } from "./schema.js";\n\nconst generatedHiddenStageDefinitions = ${JSON.stringify(stageDefinitions, null, 2)};\n\nexport const generatedHiddenObjectStages = generatedHiddenStageDefinitions.map(defineHiddenObjectsStage);\n`,
);

console.log(`Generated ${STAGES.length} Hidden Objects stages.`);

function renderScene(stage, stageIndex) {
  const background = themeBackground(stage.theme);
  const targets = stage.targets
    .map(([kind], targetIndex) => {
      const slot = TARGET_SLOTS[targetIndex];
      const color = COLORS[(stageIndex + targetIndex) % COLORS.length];
      const accent = COLORS[(stageIndex + targetIndex + 2) % COLORS.length];
      return renderIcon(kind, percentToBox(slot), color, accent);
    })
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SCENE_WIDTH}" height="${SCENE_HEIGHT}" viewBox="0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}" role="img" aria-label="${escapeXml(stage.title)} hidden objects scene">
  <defs>
    <filter id="hidden-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#143c56" flood-opacity="0.16"/>
    </filter>
    <pattern id="scene-stripes-${stage.id}" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <path d="M 0 0 L 0 48" stroke="#143c56" stroke-opacity="0.08" stroke-width="4"/>
    </pattern>
  </defs>
  <rect width="${SCENE_WIDTH}" height="${SCENE_HEIGHT}" fill="${background.sky}"/>
  <circle cx="1010" cy="110" r="68" fill="${background.sun}" opacity="0.8"/>
  <path d="M0 560 C160 500 280 612 440 552 C620 484 750 624 930 548 C1040 502 1110 512 1200 548 V800 H0Z" fill="${background.ground}"/>
  <rect y="560" width="${SCENE_WIDTH}" height="240" fill="url(#scene-stripes-${stage.id})"/>
  <rect x="56" y="72" width="214" height="164" rx="24" fill="#ffffff" stroke="#143c56" stroke-width="8" opacity="0.88"/>
  <path d="M86 196 C130 148 170 160 214 112 C238 92 258 100 270 118 V236 H86Z" fill="${background.window}" opacity="0.9"/>
  <rect x="338" y="468" width="524" height="72" rx="36" fill="#ffffff" stroke="#143c56" stroke-width="8" opacity="0.9"/>
  <text x="600" y="516" text-anchor="middle" font-size="38" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#143c56">${escapeXml(stage.title)}</text>
  ${sceneDecor(stage.theme)}
  ${targets}
</svg>`;
}

function percentToBox(slot) {
  return {
    x: (slot.x / 100) * SCENE_WIDTH,
    y: (slot.y / 100) * SCENE_HEIGHT,
    width: (slot.w / 100) * SCENE_WIDTH,
    height: (slot.h / 100) * SCENE_HEIGHT,
  };
}

function themeBackground(theme) {
  const themes = {
    beach: ["#c5f2ff", "#ffe6a7", "#82ccff", "#ffd45a"],
    camping: ["#263b5d", "#294f3b", "#ffd45a", "#ffffff"],
    classroom: ["#eaf7ff", "#ffefbe", "#bde6ff", "#ffd45a"],
    doctor: ["#eff8ff", "#dff7f2", "#c5f2ff", "#ff8069"],
    farm: ["#dff7f2", "#bde88b", "#c5f2ff", "#ffd45a"],
    garden: ["#dff7f2", "#baf1d4", "#c5f2ff", "#ffd45a"],
    kitchen: ["#fff4d7", "#ffd6c9", "#dff7f2", "#ffd45a"],
    library: ["#fff0d1", "#e8d6b8", "#c5f2ff", "#ffd45a"],
    market: ["#fff4d7", "#dff7f2", "#ffe1e5", "#ffd45a"],
    museum: ["#f4ead7", "#d9c8a5", "#c5f2ff", "#ffd45a"],
    music: ["#f1e8ff", "#c5f2ff", "#fff0a5", "#ffd45a"],
    ocean: ["#c5f2ff", "#8eddf4", "#82ccff", "#ffd45a"],
    party: ["#fff4d7", "#ffe1e5", "#c5f2ff", "#ffd45a"],
    rain: ["#dbe8ef", "#d8e2df", "#c5f2ff", "#bde6ff"],
    snow: ["#eef8ff", "#dceff8", "#ffffff", "#ffd45a"],
    space: ["#27385f", "#17233f", "#42598c", "#ffd45a"],
    station: ["#e7f1f4", "#d9d1bf", "#c5f2ff", "#ffd45a"],
    toys: ["#fff4d7", "#dff7f2", "#c5f2ff", "#ffd45a"],
    zoo: ["#dff7f2", "#cde6a7", "#c5f2ff", "#ffd45a"],
  };
  const [sky, ground, window, sun] = themes[theme] || themes.toys;
  return { sky, ground, window, sun };
}

function sceneDecor(theme) {
  if (theme === "space" || theme === "camping") {
    return '<circle cx="120" cy="336" r="8" fill="#ffd45a"/><circle cx="1090" cy="290" r="7" fill="#ffffff"/><circle cx="980" cy="210" r="5" fill="#ffffff"/>';
  }
  if (theme === "snow") {
    return '<circle cx="1080" cy="320" r="8" fill="#ffffff"/><circle cx="946" cy="382" r="7" fill="#ffffff"/><circle cx="148" cy="338" r="6" fill="#ffffff"/>';
  }
  if (theme === "rain") {
    return '<path d="M940 250 l-18 46 M1014 250 l-18 46 M1088 250 l-18 46" stroke="#4aa3ff" stroke-width="9" stroke-linecap="round"/>';
  }
  if (theme === "ocean" || theme === "beach") {
    return '<path d="M0 624 C150 578 290 674 438 620 C602 560 760 672 918 616 C1035 574 1110 586 1200 624" fill="none" stroke="#4aa3ff" stroke-width="20" opacity="0.48"/>';
  }
  return '<path d="M920 386 C970 330 1068 342 1118 404 C1052 410 982 424 920 386Z" fill="#5ac878" opacity="0.42"/>';
}

function renderIcon(kind, box, primary, accent) {
  const { x, y, width, height } = box;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const r = Math.min(width, height) / 2;
  const common = `stroke="#143c56" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;

  if (kind === "star") return `<path d="${starPath(cx, cy, r * 0.82, r * 0.36)}" fill="${primary}" ${common} filter="url(#hidden-shadow)"/>`;
  if (kind === "ball" || kind === "planet") {
    return `<g filter="url(#hidden-shadow)"><circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="${primary}" ${common}/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.92}" ry="${r * 0.28}" fill="none" stroke="${accent}" stroke-width="10" transform="rotate(-18 ${cx} ${cy})"/></g>`;
  }
  if (kind === "apple") {
    return `<g filter="url(#hidden-shadow)"><circle cx="${cx}" cy="${cy + 8}" r="${r * 0.62}" fill="${primary}" ${common}/><path d="M${cx + 2} ${cy - 42} C${cx + 24} ${cy - 70} ${cx + 62} ${cy - 54} ${cx + 46} ${cy - 24} C${cx + 24} ${cy - 22} ${cx + 10} ${cy - 28} ${cx + 2} ${cy - 42}Z" fill="#5ac878" ${common}/></g>`;
  }
  if (kind === "book") {
    return `<g filter="url(#hidden-shadow)"><rect x="${x + 8}" y="${y + 8}" width="${width - 16}" height="${height - 16}" rx="12" fill="${primary}" ${common}/><path d="M${cx} ${y + 12} V${y + height - 12}" stroke="#ffffff" stroke-width="8"/></g>`;
  }
  if (kind === "balloon") {
    return `<g filter="url(#hidden-shadow)"><ellipse cx="${cx}" cy="${cy - 12}" rx="${r * 0.55}" ry="${r * 0.68}" fill="${primary}" ${common}/><path d="M${cx} ${cy + 34} C${cx - 20} ${cy + 72} ${cx + 28} ${cy + 76} ${cx + 2} ${cy + 108}" fill="none" ${common}/></g>`;
  }
  if (kind === "fish") {
    return `<g filter="url(#hidden-shadow)"><ellipse cx="${cx - 8}" cy="${cy}" rx="${r * 0.64}" ry="${r * 0.42}" fill="${primary}" ${common}/><path d="M${cx + 40} ${cy} L${x + width - 2} ${cy - 34} L${x + width - 2} ${cy + 34}Z" fill="${accent}" ${common}/><circle cx="${cx - 42}" cy="${cy - 8}" r="5" fill="#143c56"/></g>`;
  }
  if (kind === "flower") {
    return `<g filter="url(#hidden-shadow)"><path d="M${cx} ${cy + 18} V${y + height - 4}" stroke="#34895e" stroke-width="9"/><circle cx="${cx}" cy="${cy}" r="18" fill="${accent}" ${common}/>${[0, 72, 144, 216, 288].map((angle) => `<ellipse cx="${cx}" cy="${cy}" rx="18" ry="34" fill="${primary}" transform="rotate(${angle} ${cx} ${cy})" ${common}/>`).join("")}</g>`;
  }
  if (kind === "clock") {
    return `<g filter="url(#hidden-shadow)"><circle cx="${cx}" cy="${cy}" r="${r * 0.68}" fill="#ffffff" ${common}/><path d="M${cx} ${cy} V${cy - 32} M${cx} ${cy} L${cx + 32} ${cy + 18}" ${common}/></g>`;
  }
  if (kind === "umbrella") {
    return `<g filter="url(#hidden-shadow)"><path d="M${x + 8} ${cy} C${x + 44} ${y + 8} ${x + width - 44} ${y + 8} ${x + width - 8} ${cy}Z" fill="${primary}" ${common}/><path d="M${cx} ${cy} V${y + height - 8}" ${common}/></g>`;
  }
  if (kind === "cup" || kind === "bucket") {
    return `<g filter="url(#hidden-shadow)"><path d="M${x + 24} ${y + 28} H${x + width - 28} L${x + width - 42} ${y + height - 14} H${x + 42}Z" fill="${primary}" ${common}/><path d="M${x + width - 30} ${y + 44} C${x + width + 16} ${y + 44} ${x + width + 10} ${y + 96} ${x + width - 28} ${y + 94}" fill="none" ${common}/></g>`;
  }
  if (kind === "car" || kind === "train") {
    return `<g filter="url(#hidden-shadow)"><rect x="${x + 8}" y="${cy - 30}" width="${width - 16}" height="64" rx="16" fill="${primary}" ${common}/><rect x="${x + 34}" y="${cy - 72}" width="72" height="44" rx="10" fill="${accent}" ${common}/><circle cx="${x + 36}" cy="${cy + 42}" r="16" fill="#143c56"/><circle cx="${x + width - 36}" cy="${cy + 42}" r="16" fill="#143c56"/></g>`;
  }
  if (kind === "hat" || kind === "gift") {
    return kind === "gift"
      ? `<g filter="url(#hidden-shadow)"><rect x="${x + 20}" y="${cy - 18}" width="${width - 40}" height="${height - 38}" rx="10" fill="${primary}" ${common}/><path d="M${cx} ${cy - 18} V${y + height - 18} M${x + 20} ${cy + 18} H${x + width - 20}" stroke="${accent}" stroke-width="12"/></g>`
      : `<g filter="url(#hidden-shadow)"><ellipse cx="${cx}" cy="${cy + 34}" rx="${r * 0.8}" ry="18" fill="${accent}" ${common}/><path d="M${x + 30} ${cy + 32} C${x + 40} ${cy - 44} ${x + width - 40} ${cy - 44} ${x + width - 30} ${cy + 32}Z" fill="${primary}" ${common}/></g>`;
  }
  if (kind === "kite" || kind === "flag") {
    return kind === "flag"
      ? `<g filter="url(#hidden-shadow)"><path d="M${x + 34} ${y + 14} V${y + height - 8}" ${common}/><path d="M${x + 40} ${y + 18} H${x + width - 8} L${x + width - 34} ${y + 66} H${x + 40}Z" fill="${primary}" ${common}/></g>`
      : `<g filter="url(#hidden-shadow)"><path d="M${cx} ${y + 4} L${x + width - 8} ${cy} L${cx} ${y + height - 4} L${x + 8} ${cy}Z" fill="${primary}" ${common}/><path d="M${cx} ${y + height - 2} C${cx - 28} ${y + height + 28} ${cx + 34} ${y + height + 48} ${cx} ${y + height + 74}" fill="none" ${common}/></g>`;
  }
  if (kind === "rocket" || kind === "moon") {
    return kind === "moon"
      ? `<path d="M${cx + 32} ${cy - 58} C${cx - 28} ${cy - 42} ${cx - 58} ${cy + 24} ${cx - 18} ${cy + 66} C${cx - 74} ${cy + 46} ${cx - 88} ${cy - 42} ${cx + 32} ${cy - 58}Z" fill="${primary}" ${common} filter="url(#hidden-shadow)"/>`
      : `<g filter="url(#hidden-shadow)"><path d="M${cx} ${y + 6} C${cx + 46} ${y + 58} ${cx + 34} ${y + height - 28} ${cx} ${y + height - 6} C${cx - 34} ${y + height - 28} ${cx - 46} ${y + 58} ${cx} ${y + 6}Z" fill="${primary}" ${common}/><circle cx="${cx}" cy="${cy - 4}" r="18" fill="${accent}" ${common}/></g>`;
  }
  if (kind === "heart") {
    return `<path d="M${cx} ${cy + 58} C${cx - 92} ${cy} ${cx - 62} ${cy - 74} ${cx} ${cy - 34} C${cx + 62} ${cy - 74} ${cx + 92} ${cy} ${cx} ${cy + 58}Z" fill="${primary}" ${common} filter="url(#hidden-shadow)"/>`;
  }
  if (kind === "shell" || kind === "banana" || kind === "carrot") {
    return `<path d="M${cx - 58} ${cy + 48} C${cx - 62} ${cy - 44} ${cx} ${cy - 82} ${cx + 58} ${cy + 48}Z" fill="${primary}" ${common} filter="url(#hidden-shadow)"/>`;
  }
  return `<g filter="url(#hidden-shadow)"><rect x="${x + 12}" y="${y + 12}" width="${width - 24}" height="${height - 24}" rx="20" fill="${primary}" ${common}/><circle cx="${cx}" cy="${cy}" r="${r * 0.26}" fill="${accent}" ${common}/></g>`;
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
