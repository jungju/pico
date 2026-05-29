import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "contents");
const PANEL_WIDTH = 724;
const PANEL_HEIGHT = 1086;
const IMAGE_WIDTH = PANEL_WIDTH * 2;
const IMAGE_HEIGHT = PANEL_HEIGHT;

const COLOR_SWATCHES = [
  { name: "red", ko: "빨간색", value: "#f45d5d" },
  { name: "blue", ko: "파란색", value: "#4aa3ff" },
  { name: "green", ko: "초록색", value: "#5ac878" },
  { name: "yellow", ko: "노란색", value: "#ffd45a" },
  { name: "purple", ko: "보라색", value: "#a982ff" },
  { name: "orange", ko: "주황색", value: "#ff9f45" },
];

const SLOTS = [
  { x: 92, y: 148, width: 128, height: 128 },
  { x: 298, y: 128, width: 132, height: 132 },
  { x: 510, y: 154, width: 130, height: 130 },
  { x: 116, y: 492, width: 148, height: 148 },
  { x: 470, y: 492, width: 148, height: 148 },
  { x: 287, y: 790, width: 150, height: 150 },
];

const STAGES = [
  {
    id: "spot_classroom_art_001",
    title: "Classroom Art",
    titleKo: "교실 미술",
    theme: "classroom",
    objects: [
      ["pencil", "pencil", "연필"],
      ["book", "book", "책"],
      ["star", "star", "별"],
      ["apple", "apple", "사과"],
      ["backpack", "backpack", "가방"],
      ["paintbrush", "paint brush", "붓"],
    ],
  },
  {
    id: "spot_kitchen_snack_001",
    title: "Kitchen Snack",
    titleKo: "부엌 간식",
    theme: "kitchen",
    objects: [
      ["apple", "apple", "사과"],
      ["cup", "cup", "컵"],
      ["cupcake", "cupcake", "컵케이크"],
      ["spoon", "spoon", "숟가락"],
      ["plate", "plate", "접시"],
      ["banana", "banana", "바나나"],
    ],
  },
  {
    id: "spot_garden_friends_001",
    title: "Garden Friends",
    titleKo: "정원 친구들",
    theme: "garden",
    objects: [
      ["flower", "flower", "꽃"],
      ["butterfly", "butterfly", "나비"],
      ["watering_can", "watering can", "물뿌리개"],
      ["bird", "bird", "새"],
      ["boot", "boot", "장화"],
      ["bug", "bug", "벌레"],
    ],
  },
  {
    id: "spot_toy_room_001",
    title: "Toy Room",
    titleKo: "장난감 방",
    theme: "toys",
    objects: [
      ["robot", "robot", "로봇"],
      ["car", "toy car", "장난감 자동차"],
      ["ball", "ball", "공"],
      ["blocks", "blocks", "블록"],
      ["drum", "drum", "북"],
      ["teddy", "teddy bear", "곰인형"],
    ],
  },
  {
    id: "spot_zoo_path_001",
    title: "Zoo Path",
    titleKo: "동물원 길",
    theme: "zoo",
    objects: [
      ["bird", "bird", "새"],
      ["fish", "fish", "물고기"],
      ["leaf", "leaf", "잎"],
      ["hat", "hat", "모자"],
      ["balloon", "balloon", "풍선"],
      ["camera", "camera", "카메라"],
    ],
  },
  {
    id: "spot_beach_day_001",
    title: "Beach Day",
    titleKo: "해변 놀이",
    theme: "beach",
    objects: [
      ["umbrella", "umbrella", "우산"],
      ["ball", "beach ball", "비치볼"],
      ["boat", "boat", "배"],
      ["shell", "shell", "조개"],
      ["bucket", "bucket", "양동이"],
      ["fish", "fish", "물고기"],
    ],
  },
  {
    id: "spot_space_room_001",
    title: "Space Room",
    titleKo: "우주 방",
    theme: "space",
    objects: [
      ["star", "star", "별"],
      ["rocket", "rocket", "로켓"],
      ["moon", "moon", "달"],
      ["planet", "planet", "행성"],
      ["robot", "robot", "로봇"],
      ["book", "book", "책"],
    ],
  },
  {
    id: "spot_dinosaur_museum_001",
    title: "Dinosaur Museum",
    titleKo: "공룡 박물관",
    theme: "museum",
    objects: [
      ["dinosaur", "dinosaur", "공룡"],
      ["leaf", "leaf", "잎"],
      ["bone", "bone", "뼈"],
      ["hat", "hat", "모자"],
      ["flag", "flag", "깃발"],
      ["clock", "clock", "시계"],
    ],
  },
  {
    id: "spot_rainy_window_001",
    title: "Rainy Window",
    titleKo: "비 오는 창가",
    theme: "rain",
    objects: [
      ["umbrella", "umbrella", "우산"],
      ["boot", "boot", "장화"],
      ["cloud", "cloud", "구름"],
      ["book", "book", "책"],
      ["cup", "cup", "컵"],
      ["sock", "sock", "양말"],
    ],
  },
  {
    id: "spot_library_corner_001",
    title: "Library Corner",
    titleKo: "도서관 구석",
    theme: "library",
    objects: [
      ["book", "book", "책"],
      ["lamp", "lamp", "램프"],
      ["pencil", "pencil", "연필"],
      ["clock", "clock", "시계"],
      ["backpack", "backpack", "가방"],
      ["star", "star", "별"],
    ],
  },
  {
    id: "spot_camping_night_001",
    title: "Camping Night",
    titleKo: "캠핑 밤",
    theme: "camping",
    objects: [
      ["tent", "tent", "텐트"],
      ["star", "star", "별"],
      ["moon", "moon", "달"],
      ["cup", "cup", "컵"],
      ["fish", "fish", "물고기"],
      ["flag", "flag", "깃발"],
    ],
  },
  {
    id: "spot_music_room_001",
    title: "Music Room",
    titleKo: "음악 방",
    theme: "music",
    objects: [
      ["drum", "drum", "북"],
      ["star", "star", "별"],
      ["book", "music book", "악보책"],
      ["balloon", "balloon", "풍선"],
      ["robot", "robot", "로봇"],
      ["guitar", "guitar", "기타"],
    ],
  },
  {
    id: "spot_snow_play_001",
    title: "Snow Play",
    titleKo: "눈 놀이",
    theme: "snow",
    objects: [
      ["snowman", "snowman", "눈사람"],
      ["hat", "hat", "모자"],
      ["star", "star", "별"],
      ["boot", "boot", "장화"],
      ["scarf", "scarf", "목도리"],
      ["tree", "tree", "나무"],
    ],
  },
  {
    id: "spot_farm_morning_001",
    title: "Farm Morning",
    titleKo: "농장 아침",
    theme: "farm",
    objects: [
      ["apple", "apple", "사과"],
      ["bird", "bird", "새"],
      ["flower", "flower", "꽃"],
      ["bucket", "bucket", "양동이"],
      ["hat", "hat", "모자"],
      ["carrot", "carrot", "당근"],
    ],
  },
  {
    id: "spot_birthday_table_001",
    title: "Birthday Table",
    titleKo: "생일 테이블",
    theme: "party",
    objects: [
      ["cupcake", "cupcake", "컵케이크"],
      ["balloon", "balloon", "풍선"],
      ["star", "star", "별"],
      ["gift", "gift", "선물"],
      ["hat", "party hat", "파티 모자"],
      ["cup", "cup", "컵"],
    ],
  },
  {
    id: "spot_ocean_corner_001",
    title: "Ocean Corner",
    titleKo: "바다 구석",
    theme: "ocean",
    objects: [
      ["fish", "fish", "물고기"],
      ["shell", "shell", "조개"],
      ["boat", "boat", "배"],
      ["star", "starfish", "불가사리"],
      ["bucket", "bucket", "양동이"],
      ["crab", "crab", "게"],
    ],
  },
  {
    id: "spot_train_station_001",
    title: "Train Station",
    titleKo: "기차역",
    theme: "station",
    objects: [
      ["train", "train", "기차"],
      ["clock", "clock", "시계"],
      ["backpack", "backpack", "가방"],
      ["flag", "flag", "깃발"],
      ["book", "book", "책"],
      ["balloon", "balloon", "풍선"],
    ],
  },
];

mkdirSync(CONTENT_DIR, { recursive: true });

STAGES.forEach((stage, stageIndex) => {
  const differences = stage.objects.map(([kind, label, labelKo], objectIndex) => {
    const slot = SLOTS[objectIndex];
    const rightSwatch = COLOR_SWATCHES[(stageIndex + objectIndex + 3) % COLOR_SWATCHES.length];
    const id = `${kind}_color`;

    return {
      id,
      label,
      labelKo,
      targetSide: "right",
      bbox: {
        x: PANEL_WIDTH + slot.x,
        y: slot.y,
        width: slot.width,
        height: slot.height,
      },
      description: `The ${label} is ${rightSwatch.name}.`,
      descriptionKo: `${labelKo} 색이 ${rightSwatch.ko}이에요.`,
      action: "changed",
      voiceText: `The ${label} is ${rightSwatch.name}.`,
      translation: `${labelKo} 색이 ${rightSwatch.ko}이에요.`,
    };
  });

  const content = {
    id: stage.id,
    title: stage.title,
    titleKo: stage.titleKo,
    type: "spot_the_difference",
    theme: stage.theme,
    level: 2,
    estimatedMinutes: 3,
    imageWidth: IMAGE_WIDTH,
    imageHeight: IMAGE_HEIGHT,
    hitPadding: 26,
    totalDifferences: differences.length,
    panels: {
      left: { x: 0, y: 0, width: PANEL_WIDTH, height: PANEL_HEIGHT },
      right: { x: PANEL_WIDTH, y: 0, width: PANEL_WIDTH, height: PANEL_HEIGHT },
    },
    differences,
  };

  writeFileSync(path.join(CONTENT_DIR, `${stage.id}.json`), `${JSON.stringify(content, null, 2)}\n`);
  writeFileSync(path.join(CONTENT_DIR, `${stage.id}.svg`), `${renderStageSvg(stage, stageIndex)}\n`);
});

console.log(`Generated ${STAGES.length} Spot the Difference SVG stages.`);

function renderStageSvg(stage, stageIndex) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" viewBox="0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}" role="img" aria-label="${escapeXml(stage.title)} spot the difference">
  <defs>
    <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#143c56" flood-opacity="0.16"/>
    </filter>
    <pattern id="floor-lines-${stage.id}" width="52" height="52" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <path d="M 0 0 L 0 52" stroke="#143c56" stroke-opacity="0.08" stroke-width="4"/>
    </pattern>
  </defs>
  ${renderPanel(stage, stageIndex, "left")}
  ${renderPanel(stage, stageIndex, "right")}
  <rect x="${PANEL_WIDTH - 3}" y="0" width="6" height="${PANEL_HEIGHT}" fill="#143c56" opacity="0.82"/>
</svg>`;
}

function renderPanel(stage, stageIndex, side) {
  const panelX = side === "right" ? PANEL_WIDTH : 0;
  const background = themeBackground(stage.theme, stageIndex);
  const objects = stage.objects
    .map(([kind], objectIndex) => {
      const slot = SLOTS[objectIndex];
      const swatchOffset = side === "right" ? 3 : 0;
      const primary = COLOR_SWATCHES[(stageIndex + objectIndex + swatchOffset) % COLOR_SWATCHES.length].value;
      const accent = COLOR_SWATCHES[(stageIndex + objectIndex + swatchOffset + 2) % COLOR_SWATCHES.length].value;
      return renderIcon(kind, slot, primary, accent);
    })
    .join("\n    ");

  return `<g transform="translate(${panelX} 0)">
    <rect width="${PANEL_WIDTH}" height="${PANEL_HEIGHT}" rx="0" fill="${background.wall}"/>
    <rect y="626" width="${PANEL_WIDTH}" height="460" fill="${background.floor}"/>
    <rect y="626" width="${PANEL_WIDTH}" height="460" fill="url(#floor-lines-${stage.id})"/>
    <circle cx="582" cy="118" r="62" fill="${background.sun}" opacity="0.7"/>
    <rect x="48" y="86" width="216" height="190" rx="24" fill="#ffffff" stroke="#143c56" stroke-width="8" opacity="0.95"/>
    <rect x="70" y="110" width="172" height="136" rx="14" fill="${background.window}"/>
    <path d="M76 226 C120 178 164 190 210 142 C228 128 240 126 244 130 L244 246 L76 246 Z" fill="#ffffff" opacity="0.46"/>
    <rect x="72" y="438" width="580" height="58" rx="29" fill="#ffffff" stroke="#143c56" stroke-width="8" opacity="0.86"/>
    <rect x="84" y="500" width="556" height="288" rx="28" fill="#fff8df" stroke="#143c56" stroke-width="8" filter="url(#soft-shadow)"/>
    <text x="362" y="580" text-anchor="middle" font-size="34" font-weight="900" font-family="Inter, Arial, sans-serif" fill="#143c56">${escapeXml(stage.title)}</text>
    ${themeDecor(stage.theme)}
    ${objects}
  </g>`;
}

function themeBackground(theme, index) {
  const themes = {
    beach: ["#c5f2ff", "#ffe6a7", "#82ccff", "#ffd45a"],
    camping: ["#2e4f6d", "#23415b", "#7fc889", "#ffd45a"],
    classroom: ["#eaf7ff", "#ffefbe", "#bde6ff", "#ffd45a"],
    farm: ["#dff7f2", "#d8f0a9", "#c5f2ff", "#ffd45a"],
    garden: ["#dff7f2", "#baf1d4", "#c5f2ff", "#ffd45a"],
    kitchen: ["#fff4d7", "#ffd6c9", "#dff7f2", "#ffd45a"],
    library: ["#fff0d1", "#e8d6b8", "#c5f2ff", "#ffd45a"],
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
  const [wall, floor, window, sun] = themes[theme] || themes.toys;
  return {
    wall,
    floor,
    window,
    sun: index % 2 === 0 ? sun : "#ff9f45",
  };
}

function themeDecor(theme) {
  if (theme === "space" || theme === "camping") {
    return '<circle cx="112" cy="350" r="7" fill="#ffd45a"/><circle cx="602" cy="352" r="8" fill="#ffd45a"/><circle cx="530" cy="74" r="5" fill="#ffffff"/>';
  }
  if (theme === "snow") {
    return '<circle cx="604" cy="330" r="9" fill="#ffffff"/><circle cx="558" cy="370" r="7" fill="#ffffff"/><circle cx="140" cy="344" r="6" fill="#ffffff"/>';
  }
  if (theme === "rain") {
    return '<path d="M525 315 l-16 38" stroke="#4aa3ff" stroke-width="8" stroke-linecap="round"/><path d="M574 320 l-16 38" stroke="#4aa3ff" stroke-width="8" stroke-linecap="round"/>';
  }
  if (theme === "ocean" || theme === "beach") {
    return '<path d="M40 358 C140 326 226 394 326 360 C424 326 514 392 680 352" fill="none" stroke="#4aa3ff" stroke-width="16" opacity="0.45"/>';
  }
  return '<path d="M505 346 C536 310 600 314 630 354 C594 360 546 366 505 346 Z" fill="#5ac878" opacity="0.42"/>';
}

function renderIcon(kind, slot, primary, accent) {
  const { x, y, width, height } = slot;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const r = Math.min(width, height) / 2;
  const common = `stroke="#143c56" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"`;

  switch (kind) {
    case "apple":
      return `<g filter="url(#soft-shadow)"><circle cx="${cx}" cy="${cy + 8}" r="${r * 0.62}" fill="${primary}" ${common}/><path d="M${cx + 4} ${cy - 54} C${cx + 22} ${cy - 82} ${cx + 58} ${cy - 72} ${cx + 52} ${cy - 40} C${cx + 28} ${cy - 34} ${cx + 12} ${cy - 40} ${cx + 4} ${cy - 54}Z" fill="#5ac878" ${common}/><path d="M${cx} ${cy - 44} C${cx + 8} ${cy - 66} ${cx - 6} ${cy - 78} ${cx - 24} ${cy - 88}" fill="none" ${common}/></g>`;
    case "ball":
      return `<g filter="url(#soft-shadow)"><circle cx="${cx}" cy="${cy}" r="${r * 0.7}" fill="${primary}" ${common}/><path d="M${cx - r * 0.55} ${cy} C${cx - 20} ${cy - 26} ${cx + 20} ${cy - 26} ${cx + r * 0.55} ${cy}" fill="none" stroke="${accent}" stroke-width="13" stroke-linecap="round"/><path d="M${cx - r * 0.55} ${cy} C${cx - 20} ${cy + 26} ${cx + 20} ${cy + 26} ${cx + r * 0.55} ${cy}" fill="none" stroke="${accent}" stroke-width="13" stroke-linecap="round"/></g>`;
    case "balloon":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx}" cy="${cy - 18}" rx="${r * 0.54}" ry="${r * 0.68}" fill="${primary}" ${common}/><path d="M${cx} ${cy + 42} C${cx - 18} ${cy + 78} ${cx + 22} ${cy + 92} ${cx + 2} ${cy + 120}" fill="none" ${common}/><path d="M${cx - 12} ${cy + 34} L${cx + 12} ${cy + 34} L${cx} ${cy + 54}Z" fill="${accent}" ${common}/></g>`;
    case "banana":
      return `<path d="M${x + 26} ${cy + 24} C${x + 102} ${cy + 96} ${x + width - 8} ${cy - 6} ${x + width - 28} ${cy - 60} C${x + width - 38} ${cy + 6} ${x + 96} ${cy + 52} ${x + 44} ${cy - 2} Z" fill="${primary}" ${common} filter="url(#soft-shadow)"/>`;
    case "bird":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx}" cy="${cy + 4}" rx="${r * 0.66}" ry="${r * 0.48}" fill="${primary}" ${common}/><circle cx="${cx + 42}" cy="${cy - 22}" r="${r * 0.28}" fill="${primary}" ${common}/><path d="M${cx + 66} ${cy - 24} L${cx + 96} ${cy - 10} L${cx + 66} ${cy + 2}Z" fill="${accent}" ${common}/><circle cx="${cx + 50}" cy="${cy - 28}" r="6" fill="#143c56"/></g>`;
    case "boat":
      return `<g filter="url(#soft-shadow)"><path d="M${x + 16} ${cy + 30} L${x + width - 16} ${cy + 30} L${x + width - 50} ${cy + 78} L${x + 48} ${cy + 78}Z" fill="${primary}" ${common}/><path d="M${cx} ${cy + 28} L${cx} ${cy - 62}" ${common}/><path d="M${cx + 4} ${cy - 56} L${cx + 72} ${cy + 16} L${cx + 4} ${cy + 16}Z" fill="${accent}" ${common}/></g>`;
    case "bone":
      return `<g filter="url(#soft-shadow)"><path d="M${x + 30} ${cy - 10} C${x + 12} ${cy - 40} ${x + 42} ${cy - 66} ${x + 68} ${cy - 46} L${x + width - 48} ${cy + 32} C${x + width - 16} ${cy + 12} ${x + width + 8} ${cy + 44} ${x + width - 20} ${cy + 70} C${x + width - 50} ${cy + 96} ${x + width - 80} ${cy + 68} ${x + width - 56} ${cy + 38} L${x + 56} ${cy - 40} C${x + 38} ${cy - 18} ${x + 12} ${cy + 14} ${x + 30} ${cy - 10}Z" fill="${primary}" ${common}/></g>`;
    case "book":
      return `<g filter="url(#soft-shadow)"><rect x="${x + 12}" y="${y + 14}" width="${width - 24}" height="${height - 28}" rx="14" fill="${primary}" ${common}/><path d="M${cx} ${y + 18} V${y + height - 18}" stroke="#ffffff" stroke-width="8"/><path d="M${x + 34} ${y + 54} H${cx - 18}" stroke="${accent}" stroke-width="9"/><path d="M${cx + 18} ${y + 86} H${x + width - 34}" stroke="${accent}" stroke-width="9"/></g>`;
    case "boot":
      return `<path d="M${x + 38} ${y + 18} H${x + 92} V${y + 88} H${x + width - 22} C${x + width + 12} ${y + 88} ${x + width + 8} ${y + height - 24} ${x + width - 26} ${y + height - 24} H${x + 36} Z" fill="${primary}" ${common} filter="url(#soft-shadow)"/>`;
    case "bucket":
      return `<g filter="url(#soft-shadow)"><path d="M${x + 30} ${y + 40} H${x + width - 30} L${x + width - 50} ${y + height - 20} H${x + 50}Z" fill="${primary}" ${common}/><path d="M${x + 48} ${y + 42} C${cx} ${y - 20} ${x + width - 48} ${y + 42}" fill="none" ${common}/><circle cx="${cx}" cy="${y + 38}" r="9" fill="${accent}"/></g>`;
    case "bug":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.55}" ry="${r * 0.68}" fill="${primary}" ${common}/><circle cx="${cx}" cy="${y + 26}" r="${r * 0.3}" fill="${accent}" ${common}/><path d="M${cx - 58} ${cy - 10} H${cx + 58} M${cx - 54} ${cy + 24} H${cx + 54}" ${common}/></g>`;
    case "butterfly":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx - 32}" cy="${cy - 18}" rx="${r * 0.42}" ry="${r * 0.5}" fill="${primary}" ${common}/><ellipse cx="${cx + 32}" cy="${cy - 18}" rx="${r * 0.42}" ry="${r * 0.5}" fill="${accent}" ${common}/><ellipse cx="${cx - 28}" cy="${cy + 36}" rx="${r * 0.32}" ry="${r * 0.38}" fill="${accent}" ${common}/><ellipse cx="${cx + 28}" cy="${cy + 36}" rx="${r * 0.32}" ry="${r * 0.38}" fill="${primary}" ${common}/><rect x="${cx - 8}" y="${cy - 48}" width="16" height="104" rx="8" fill="#143c56"/></g>`;
    case "camera":
      return `<g filter="url(#soft-shadow)"><rect x="${x + 18}" y="${cy - 44}" width="${width - 36}" height="92" rx="18" fill="${primary}" ${common}/><circle cx="${cx}" cy="${cy + 2}" r="30" fill="${accent}" ${common}/><rect x="${x + 48}" y="${cy - 70}" width="54" height="28" rx="8" fill="${primary}" ${common}/></g>`;
    case "car":
      return `<g filter="url(#soft-shadow)"><path d="M${x + 18} ${cy + 18} H${x + width - 18} V${cy + 56} H${x + 18}Z" fill="${primary}" ${common}/><path d="M${x + 52} ${cy + 18} L${x + 82} ${cy - 24} H${x + width - 70} L${x + width - 36} ${cy + 18}Z" fill="${accent}" ${common}/><circle cx="${x + 52}" cy="${cy + 58}" r="20" fill="#143c56"/><circle cx="${x + width - 52}" cy="${cy + 58}" r="20" fill="#143c56"/></g>`;
    case "carrot":
      return `<g filter="url(#soft-shadow)"><path d="M${cx - 34} ${y + 42} L${cx + 34} ${y + 42} L${cx} ${y + height - 20}Z" fill="${primary}" ${common}/><path d="M${cx} ${y + 44} C${cx - 20} ${y + 12} ${cx - 52} ${y + 22} ${cx - 48} ${y - 4} M${cx} ${y + 44} C${cx + 24} ${y + 12} ${cx + 58} ${y + 18} ${cx + 52} ${y - 8}" stroke="#5ac878" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;
    case "clock":
      return `<g filter="url(#soft-shadow)"><circle cx="${cx}" cy="${cy}" r="${r * 0.68}" fill="#ffffff" ${common}/><path d="M${cx} ${cy} V${cy - 42} M${cx} ${cy} L${cx + 38} ${cy + 20}" ${common}/><circle cx="${cx}" cy="${cy}" r="8" fill="${primary}"/></g>`;
    case "cloud":
      return `<path d="M${x + 28} ${cy + 26} C${x + 10} ${cy - 20} ${x + 58} ${cy - 50} ${x + 88} ${cy - 24} C${x + 110} ${cy - 70} ${x + 176} ${cy - 48} ${x + 172} ${cy + 4} C${x + 210} ${cy + 8} ${x + 202} ${cy + 58} ${x + 158} ${cy + 56} H${x + 44} C${x + 18} ${cy + 56} ${x + 8} ${cy + 38} ${x + 28} ${cy + 26}Z" fill="${primary}" ${common} filter="url(#soft-shadow)"/>`;
    case "crab":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx}" cy="${cy + 18}" rx="${r * 0.56}" ry="${r * 0.4}" fill="${primary}" ${common}/><path d="M${cx - 56} ${cy - 4} L${cx - 92} ${cy - 44} M${cx + 56} ${cy - 4} L${cx + 92} ${cy - 44}" ${common}/><circle cx="${cx - 94}" cy="${cy - 48}" r="20" fill="${accent}" ${common}/><circle cx="${cx + 94}" cy="${cy - 48}" r="20" fill="${accent}" ${common}/></g>`;
    case "cup":
      return `<g filter="url(#soft-shadow)"><path d="M${x + 34} ${y + 42} H${x + width - 48} V${y + height - 28} H${x + 54}Z" fill="${primary}" ${common}/><path d="M${x + width - 48} ${y + 66} C${x + width + 18} ${y + 62} ${x + width + 14} ${y + 128} ${x + width - 48} ${y + 124}" fill="none" ${common}/></g>`;
    case "cupcake":
      return `<g filter="url(#soft-shadow)"><path d="M${x + 32} ${cy} H${x + width - 32} L${x + width - 54} ${y + height - 20} H${x + 54}Z" fill="${primary}" ${common}/><path d="M${x + 38} ${cy} C${x + 42} ${cy - 60} ${x + width - 42} ${cy - 60} ${x + width - 38} ${cy}Z" fill="${accent}" ${common}/><circle cx="${cx}" cy="${cy - 60}" r="13" fill="#f45d5d" ${common}/></g>`;
    case "dinosaur":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx - 6}" cy="${cy + 18}" rx="${r * 0.72}" ry="${r * 0.42}" fill="${primary}" ${common}/><circle cx="${cx + 66}" cy="${cy - 18}" r="${r * 0.32}" fill="${primary}" ${common}/><path d="M${cx - 82} ${cy + 18} L${cx - 124} ${cy - 24}" ${common}/><path d="M${cx - 30} ${cy - 24} L${cx - 10} ${cy - 58} L${cx + 12} ${cy - 24}" fill="${accent}" ${common}/></g>`;
    case "drum":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx}" cy="${y + 40}" rx="${r * 0.62}" ry="28" fill="${accent}" ${common}/><rect x="${x + 28}" y="${y + 40}" width="${width - 56}" height="${height - 70}" fill="${primary}" ${common}/><ellipse cx="${cx}" cy="${y + height - 30}" rx="${r * 0.62}" ry="28" fill="${accent}" ${common}/><path d="M${x + 16} ${y + 16} L${x + width - 16} ${y + 86} M${x + width - 16} ${y + 16} L${x + 16} ${y + 86}" stroke="#8c5a2b" stroke-width="8"/></g>`;
    case "fish":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx - 12}" cy="${cy}" rx="${r * 0.62}" ry="${r * 0.42}" fill="${primary}" ${common}/><path d="M${cx + 48} ${cy} L${x + width - 4} ${cy - 42} L${x + width - 4} ${cy + 42}Z" fill="${accent}" ${common}/><circle cx="${cx - 48}" cy="${cy - 10}" r="6" fill="#143c56"/></g>`;
    case "flag":
      return `<g filter="url(#soft-shadow)"><path d="M${x + 44} ${y + 24} V${y + height - 20}" ${common}/><path d="M${x + 50} ${y + 28} H${x + width - 18} L${x + width - 48} ${y + 82} H${x + 50}Z" fill="${primary}" ${common}/></g>`;
    case "flower":
      return `<g filter="url(#soft-shadow)"><path d="M${cx} ${cy + 22} V${y + height - 12}" stroke="#34895e" stroke-width="10"/><circle cx="${cx}" cy="${cy}" r="23" fill="${accent}" ${common}/>${[0, 60, 120, 180, 240, 300].map((angle) => `<ellipse cx="${cx}" cy="${cy}" rx="24" ry="42" fill="${primary}" transform="rotate(${angle} ${cx} ${cy})" ${common}/>`).join("")}</g>`;
    case "gift":
      return `<g filter="url(#soft-shadow)"><rect x="${x + 24}" y="${cy - 18}" width="${width - 48}" height="${height - 48}" rx="10" fill="${primary}" ${common}/><path d="M${cx} ${cy - 18} V${y + height - 28} M${x + 24} ${cy + 24} H${x + width - 24}" stroke="${accent}" stroke-width="14"/><path d="M${cx} ${cy - 20} C${cx - 44} ${cy - 76} ${cx - 86} ${cy - 28} ${cx - 18} ${cy - 16} C${cx + 46} ${cy - 78} ${cx + 88} ${cy - 28} ${cx + 18} ${cy - 16}" fill="none" ${common}/></g>`;
    case "guitar":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx - 28}" cy="${cy + 28}" rx="42" ry="54" fill="${primary}" ${common}/><ellipse cx="${cx + 22}" cy="${cy - 10}" rx="36" ry="46" fill="${primary}" ${common}/><rect x="${cx + 42}" y="${cy - 94}" width="28" height="112" rx="12" fill="${accent}" ${common}/><circle cx="${cx - 2}" cy="${cy + 12}" r="14" fill="#fff8df" ${common}/></g>`;
    case "hat":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx}" cy="${cy + 44}" rx="${r * 0.76}" ry="22" fill="${accent}" ${common}/><path d="M${x + 42} ${cy + 42} C${x + 48} ${cy - 58} ${x + width - 48} ${cy - 58} ${x + width - 42} ${cy + 42}Z" fill="${primary}" ${common}/></g>`;
    case "kite":
    case "paintbrush":
      return kind === "kite"
        ? `<g filter="url(#soft-shadow)"><path d="M${cx} ${y + 8} L${x + width - 12} ${cy} L${cx} ${y + height - 8} L${x + 12} ${cy}Z" fill="${primary}" ${common}/><path d="M${cx} ${y + 8} V${y + height - 8} M${x + 12} ${cy} H${x + width - 12}" stroke="${accent}" stroke-width="10"/><path d="M${cx} ${y + height - 4} C${cx - 34} ${y + height + 34} ${cx + 40} ${y + height + 60} ${cx} ${y + height + 94}" fill="none" ${common}/></g>`
        : `<g filter="url(#soft-shadow)"><rect x="${cx - 12}" y="${y + 28}" width="24" height="${height - 48}" rx="10" fill="${primary}" ${common} transform="rotate(28 ${cx} ${cy})"/><path d="M${cx + 12} ${y + 18} C${cx + 62} ${y - 4} ${cx + 78} ${y + 44} ${cx + 30} ${y + 58}Z" fill="${accent}" ${common}/></g>`;
    case "lamp":
      return `<g filter="url(#soft-shadow)"><path d="M${cx - 52} ${cy - 42} H${cx + 52} L${cx + 34} ${cy + 14} H${cx - 34}Z" fill="${primary}" ${common}/><path d="M${cx} ${cy + 14} V${cy + 72}" ${common}/><path d="M${cx - 46} ${cy + 76} H${cx + 46}" ${common}/></g>`;
    case "leaf":
      return `<path d="M${x + 26} ${cy + 20} C${x + 88} ${y - 22} ${x + width - 6} ${y + 10} ${x + width - 26} ${cy + 72} C${x + 100} ${cy + 66} ${x + 50} ${cy + 58} ${x + 26} ${cy + 20}Z" fill="${primary}" ${common} filter="url(#soft-shadow)"/>`;
    case "moon":
      return `<path d="M${cx + 38} ${cy - 72} C${cx - 34} ${cy - 54} ${cx - 70} ${cy + 28} ${cx - 24} ${cy + 82} C${cx - 92} ${cy + 58} ${cx - 110} ${cy - 50} ${cx + 38} ${cy - 72}Z" fill="${primary}" ${common} filter="url(#soft-shadow)"/>`;
    case "pencil":
      return `<g filter="url(#soft-shadow)"><path d="M${x + 34} ${y + height - 18} L${x + width - 24} ${y + 44} L${x + width - 58} ${y + 10} L${x + 2} ${y + height - 52}Z" fill="${primary}" ${common}/><path d="M${x + width - 58} ${y + 10} L${x + width - 14} ${y + 0} L${x + width - 24} ${y + 44}Z" fill="${accent}" ${common}/></g>`;
    case "planet":
      return `<g filter="url(#soft-shadow)"><circle cx="${cx}" cy="${cy}" r="${r * 0.56}" fill="${primary}" ${common}/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.9}" ry="${r * 0.28}" fill="none" stroke="${accent}" stroke-width="12" transform="rotate(-18 ${cx} ${cy})"/></g>`;
    case "plate":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.78}" ry="${r * 0.52}" fill="#ffffff" ${common}/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.44}" ry="${r * 0.26}" fill="${primary}" stroke="${accent}" stroke-width="8"/></g>`;
    case "robot":
      return `<g filter="url(#soft-shadow)"><rect x="${x + 40}" y="${y + 26}" width="${width - 80}" height="56" rx="14" fill="${primary}" ${common}/><rect x="${x + 28}" y="${y + 92}" width="${width - 56}" height="${height - 116}" rx="18" fill="${accent}" ${common}/><circle cx="${cx - 24}" cy="${y + 54}" r="7" fill="#143c56"/><circle cx="${cx + 24}" cy="${y + 54}" r="7" fill="#143c56"/><path d="M${x + 8} ${cy + 8} H${x + 28} M${x + width - 28} ${cy + 8} H${x + width - 8}" ${common}/></g>`;
    case "rocket":
      return `<g filter="url(#soft-shadow)"><path d="M${cx} ${y + 6} C${cx + 60} ${y + 66} ${cx + 42} ${y + height - 34} ${cx} ${y + height - 8} C${cx - 42} ${y + height - 34} ${cx - 60} ${y + 66} ${cx} ${y + 6}Z" fill="${primary}" ${common}/><circle cx="${cx}" cy="${cy - 4}" r="22" fill="${accent}" ${common}/><path d="M${cx - 34} ${y + height - 46} L${cx - 76} ${y + height - 8} M${cx + 34} ${y + height - 46} L${cx + 76} ${y + height - 8}" ${common}/></g>`;
    case "scarf":
      return `<g filter="url(#soft-shadow)"><rect x="${x + 20}" y="${cy - 28}" width="${width - 40}" height="48" rx="20" fill="${primary}" ${common}/><rect x="${cx + 18}" y="${cy + 12}" width="38" height="94" rx="14" fill="${accent}" ${common}/></g>`;
    case "shell":
      return `<path d="M${cx - 64} ${cy + 58} C${cx - 76} ${cy - 42} ${cx} ${cy - 86} ${cx + 64} ${cy + 58}Z" fill="${primary}" ${common} filter="url(#soft-shadow)"/><path d="M${cx} ${cy - 72} V${cy + 44} M${cx - 34} ${cy - 42} L${cx - 8} ${cy + 46} M${cx + 34} ${cy - 42} L${cx + 8} ${cy + 46}" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>`;
    case "snowman":
      return `<g filter="url(#soft-shadow)"><circle cx="${cx}" cy="${cy + 36}" r="48" fill="#ffffff" ${common}/><circle cx="${cx}" cy="${cy - 30}" r="36" fill="#ffffff" ${common}/><path d="M${cx - 34} ${cy - 66} H${cx + 34} M${cx - 22} ${cy - 66} V${cy - 104} H${cx + 22} V${cy - 66}" stroke="${primary}" stroke-width="12"/><circle cx="${cx - 12}" cy="${cy - 38}" r="5" fill="#143c56"/><circle cx="${cx + 12}" cy="${cy - 38}" r="5" fill="#143c56"/></g>`;
    case "sock":
      return `<path d="M${x + 42} ${y + 20} H${x + 96} V${y + 96} H${x + width - 18} C${x + width + 8} ${y + 96} ${x + width + 4} ${y + height - 18} ${x + width - 32} ${y + height - 18} H${x + 42}Z" fill="${primary}" ${common} filter="url(#soft-shadow)"/>`;
    case "spoon":
      return `<g filter="url(#soft-shadow)"><ellipse cx="${cx}" cy="${y + 44}" rx="28" ry="42" fill="${primary}" ${common}/><rect x="${cx - 10}" y="${y + 78}" width="20" height="${height - 88}" rx="10" fill="${accent}" ${common}/></g>`;
    case "star":
      return `<path d="${starPath(cx, cy, r * 0.76, r * 0.34)}" fill="${primary}" ${common} filter="url(#soft-shadow)"/>`;
    case "teddy":
      return `<g filter="url(#soft-shadow)"><circle cx="${cx - 42}" cy="${cy - 42}" r="26" fill="${primary}" ${common}/><circle cx="${cx + 42}" cy="${cy - 42}" r="26" fill="${primary}" ${common}/><circle cx="${cx}" cy="${cy}" r="64" fill="${primary}" ${common}/><ellipse cx="${cx}" cy="${cy + 18}" rx="30" ry="22" fill="${accent}" ${common}/><circle cx="${cx - 20}" cy="${cy - 8}" r="6" fill="#143c56"/><circle cx="${cx + 20}" cy="${cy - 8}" r="6" fill="#143c56"/></g>`;
    case "tent":
      return `<g filter="url(#soft-shadow)"><path d="M${x + 12} ${y + height - 20} L${cx} ${y + 20} L${x + width - 12} ${y + height - 20}Z" fill="${primary}" ${common}/><path d="M${cx} ${y + 20} L${cx + 8} ${y + height - 20} H${cx - 52}Z" fill="${accent}" ${common}/></g>`;
    case "train":
      return `<g filter="url(#soft-shadow)"><rect x="${x + 16}" y="${cy - 36}" width="${width - 32}" height="78" rx="18" fill="${primary}" ${common}/><rect x="${x + 40}" y="${cy - 78}" width="82" height="48" rx="12" fill="${accent}" ${common}/><circle cx="${x + 54}" cy="${cy + 50}" r="20" fill="#143c56"/><circle cx="${x + width - 54}" cy="${cy + 50}" r="20" fill="#143c56"/></g>`;
    case "tree":
      return `<g filter="url(#soft-shadow)"><rect x="${cx - 16}" y="${cy + 18}" width="32" height="82" rx="10" fill="#8c5a2b" ${common}/><circle cx="${cx}" cy="${cy - 28}" r="58" fill="${primary}" ${common}/><circle cx="${cx - 44}" cy="${cy + 8}" r="38" fill="${primary}" ${common}/><circle cx="${cx + 44}" cy="${cy + 8}" r="38" fill="${primary}" ${common}/></g>`;
    case "umbrella":
      return `<g filter="url(#soft-shadow)"><path d="M${x + 12} ${cy} C${x + 54} ${y + 10} ${x + width - 54} ${y + 10} ${x + width - 12} ${cy}Z" fill="${primary}" ${common}/><path d="M${cx} ${cy} V${y + height - 12} C${cx} ${y + height + 24} ${cx + 48} ${y + height + 10} ${cx + 34} ${y + height - 14}" fill="none" ${common}/><path d="M${cx} ${y + 18} V${cy}" stroke="${accent}" stroke-width="10"/></g>`;
    case "watering_can":
      return `<g filter="url(#soft-shadow)"><rect x="${x + 34}" y="${cy - 18}" width="${width - 78}" height="74" rx="18" fill="${primary}" ${common}/><path d="M${x + width - 44} ${cy - 6} L${x + width - 2} ${cy - 46}" ${common}/><path d="M${x + 34} ${cy - 4} C${x - 8} ${cy - 18} ${x - 6} ${cy + 62} ${x + 34} ${cy + 48}" fill="none" ${common}/><circle cx="${x + width - 4}" cy="${cy - 48}" r="10" fill="${accent}"/></g>`;
    case "backpack":
    case "blocks":
    default:
      if (kind === "blocks") {
        return `<g filter="url(#soft-shadow)"><rect x="${x + 22}" y="${y + 72}" width="56" height="56" rx="10" fill="${primary}" ${common}/><rect x="${x + 82}" y="${y + 28}" width="56" height="56" rx="10" fill="${accent}" ${common}/><rect x="${x + 142}" y="${y + 72}" width="56" height="56" rx="10" fill="${primary}" ${common}/></g>`;
      }
      return `<g filter="url(#soft-shadow)"><rect x="${x + 34}" y="${y + 26}" width="${width - 68}" height="${height - 38}" rx="22" fill="${primary}" ${common}/><path d="M${cx - 32} ${y + 30} C${cx - 28} ${y - 8} ${cx + 28} ${y - 8} ${cx + 32} ${y + 30}" fill="none" ${common}/><rect x="${cx - 28}" y="${cy + 12}" width="56" height="38" rx="10" fill="${accent}" ${common}/></g>`;
  }
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
