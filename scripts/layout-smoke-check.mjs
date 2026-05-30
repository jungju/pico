import { chromium } from "playwright";

const BASE_URL = process.env.PICO_BASE_URL || "http://127.0.0.1:5173";
const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 740 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];
const ROUTES = [
  { name: "home", path: "/", playSelector: null },
  { name: "spot", path: "/games/spot_the_difference/spot_kids_bedroom_001", playSelector: ".pictures-grid" },
  { name: "spot-beach", path: "/games/spot_the_difference/spot_beach_day_001", playSelector: ".pictures-grid" },
  { name: "hidden", path: "/games/hidden_objects/hidden_picnic_001", playSelector: ".hidden-objects-stage" },
  { name: "hidden-wide", path: "/games/hidden_objects/hidden_classroom_001", playSelector: ".hidden-objects-stage" },
  { name: "maze", path: "/games/maze/maze_garden_001", playSelector: ".maze-stage" },
  { name: "memory", path: "/games/memory_cards/memory_animals_001", playSelector: ".memory-stage" },
];
const TOUCH_TARGET_SELECTOR = ["button", "[role='button']", ".completion-action"].join(",");
const TEXT_CLIP_SELECTOR = [
  ".action-button span",
  ".auth-button span",
  ".completion-action span",
  ".game-option-title-ko",
  ".hidden-target-pill strong",
  ".hidden-target-meaning",
  ".memory-card-word strong",
  ".memory-card-word small",
].join(",");

const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  for (const viewport of VIEWPORTS) {
    for (const route of ROUTES) {
      const page = await browser.newPage({ viewport });
      const url = new URL(route.path, BASE_URL).toString();

      try {
        await page.route("https://ohmesh.jjgo.io/auth/me**", (requestRoute) =>
          requestRoute.fulfill({ status: 204, body: "" }),
        );
        await page.goto(url, { waitUntil: "networkidle" });
        const result = await page.evaluate(
          ({ playSelector, textClipSelector, touchTargetSelector }) => {
            const visible = (element) => {
              const rect = element.getBoundingClientRect();
              const style = window.getComputedStyle(element);
              return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
            };
            const smallTouchTargets = [...document.querySelectorAll(touchTargetSelector)]
              .filter(visible)
              .map((element) => {
                const rect = element.getBoundingClientRect();
                return {
                  label: element.getAttribute("aria-label") || element.textContent.trim() || element.className,
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                };
              })
              .filter((item) => item.width < 44 || item.height < 44);
            const clippedText = [...document.querySelectorAll(textClipSelector)]
              .filter(visible)
              .filter((element) => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)
              .map((element) => element.textContent.trim())
              .filter(Boolean)
              .slice(0, 8);
            const topbar = document.querySelector(".game-topbar")?.getBoundingClientRect();
            const playArea = playSelector ? document.querySelector(playSelector)?.getBoundingClientRect() : null;
            const focusButton = document.querySelector(".picture-focus-button")?.getBoundingClientRect();
            const focusOverlapsPicture =
              focusButton &&
              [...document.querySelectorAll(".picture-frame")]
                .filter(visible)
                .some((element) => {
                  const rect = element.getBoundingClientRect();
                  return focusButton.left < rect.right && focusButton.right > rect.left && focusButton.top < rect.bottom && focusButton.bottom > rect.top;
                });
            const hiddenStage = document.querySelector(".hidden-objects-stage")?.getBoundingClientRect();
            const hiddenScene = document.querySelector(".hidden-scene")?.getBoundingClientRect();
            const hiddenSceneClipped =
              hiddenStage &&
              hiddenScene &&
              (hiddenScene.left < hiddenStage.left - 1 ||
                hiddenScene.top < hiddenStage.top - 1 ||
                hiddenScene.right > hiddenStage.right + 1 ||
                hiddenScene.bottom > hiddenStage.bottom + 1);

            return {
              horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
              smallTouchTargets,
              clippedText,
              focusOverlapsPicture,
              hiddenSceneClipped,
              topbarRatio: topbar ? topbar.height / window.innerHeight : 0,
              playAreaRatio: playArea ? playArea.height / window.innerHeight : null,
            };
          },
          {
            playSelector: route.playSelector,
            textClipSelector: TEXT_CLIP_SELECTOR,
            touchTargetSelector: TOUCH_TARGET_SELECTOR,
          },
        );

        if (result.horizontalOverflow) failures.push(formatFailure(viewport, route, "horizontal overflow"));
        if (result.smallTouchTargets.length) {
          failures.push(formatFailure(viewport, route, `small touch targets: ${JSON.stringify(result.smallTouchTargets)}`));
        }
        if (result.clippedText.length) failures.push(formatFailure(viewport, route, `clipped text: ${result.clippedText.join(", ")}`));
        if (result.focusOverlapsPicture) failures.push(formatFailure(viewport, route, "focus button overlaps picture frame"));
        if (result.hiddenSceneClipped) failures.push(formatFailure(viewport, route, "hidden scene outside stage bounds"));
        if (result.topbarRatio > 0.34) failures.push(formatFailure(viewport, route, `topbar too tall: ${Math.round(result.topbarRatio * 100)}%`));
        if (result.playAreaRatio !== null && result.playAreaRatio < 0.18) {
          failures.push(formatFailure(viewport, route, `play area too small: ${Math.round(result.playAreaRatio * 100)}%`));
        }
      } catch (error) {
        failures.push(formatFailure(viewport, route, error.message));
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`Layout smoke check failed for ${failures.length} item(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Layout smoke check passed for ${ROUTES.length} routes across ${VIEWPORTS.length} viewports.`);

function formatFailure(viewport, route, message) {
  return `${viewport.name} ${route.name} ${route.path}: ${message}`;
}
