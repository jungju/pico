# Pico

Pico는 작은 영어 학습 게임 모음입니다. 첫 게임은 숨은그림찾기/틀린그림찾기 방식의 `Find & Learn`입니다.

운영 주소:

```text
https://pico.jjgo.io
```

## 문서

- `docs/spec.md`: Codex가 먼저 읽는 제품 범위, 게임 계약, 배포 계약
- `docs/v1-scope.md`: Pico v1에 포함할 게임, 보상, 진행 저장, 제외 범위
- `docs/v1-tasks.md`: v1 범위를 구현 가능한 태스크로 나눈 backlog
- `docs/v1-assets.md`: v1 stage data와 이미지/audio asset 이름 규칙
- `docs/v1-content.md`: v1 playable stage 목표 수량과 현재 seed stage 목록
- `docs/v1-vocabulary-qa.md`: v1 vocabulary와 문장 QA 체크리스트
- `docs/v1-visual-qa.md`: v1 이미지, hit area, viewport QA 체크리스트
- `docs/v1-korean-copy.md`: v1 한국어 보조 텍스트 리뷰
- `docs/v1-manual-qa.md`: v1 stage route와 completion QA 결과
- `README.md`: 사람을 위한 실행 방법, 기능 흐름, git/배포 기준
- `AGENTS.md`: 에이전트 작업, 검증, 커밋 규칙

## 코드 구조

- `contents/`: Find & Learn에 자동 등록되는 stage JSON/이미지
- `src/App.jsx`: Pico 첫 화면의 게임 선택 목록과 게임 진입 흐름
- `src/ohmeshAuth.js`: ohmesh 로그인/로그아웃 URL 생성과 세션 확인
- `src/ohmeshProgress.js`: ohmesh 사용자별 v1 Pico progress와 Find & Learn legacy 진행 저장
- `src/games/findLearn/FindLearnGame.jsx`: Find & Learn 화면, 클릭 처리, 마커, 음성 피드백
- `src/games/findLearn/hitTesting.js`: 이미지 기준 퍼센트 좌표 변환과 영역 충돌 판정
- `src/games/findLearn/stages/contentStages.js`: `contents/*.json`과 같은 이름의 이미지 자동 등록
- `src/games/findLearn/stages/stage001.js`: built-in fallback stage 데이터
- `src/games/hiddenObjects/HiddenObjectsGame.jsx`: 숨은그림 찾기 scene, target list, marker UI
- `src/games/hiddenObjects/hitTesting.js`: 숨은그림 찾기 image-relative target 판정
- `src/games/hiddenObjects/stages/schema.js`: 숨은그림 찾기 stage schema와 normalizer
- `src/games/hiddenObjects/stages/stage001.js`: v1 숨은그림 찾기 picnic stage 데이터
- `src/games/maze/MazeGame.jsx`: 미로 board, player marker, 이동 버튼, 완료 UI
- `src/games/maze/engine.js`: grid 기반 미로 이동, pointer/touch cell 변환, 수집/완료 판정
- `src/games/maze/stages/schema.js`: grid 기반 미로 stage schema와 normalizer
- `src/games/maze/stages/stage001.js`: v1 미로 찾기 garden stage 데이터
- `src/games/memoryCards/MemoryCardsGame.jsx`: 메모리 카드 grid, card face, 매칭 UI
- `src/games/memoryCards/engine.js`: 카드 deck 생성, 뒤집기, 매칭, mismatch delay, 완료 판정
- `src/games/memoryCards/stages/schema.js`: 메모리 카드 stage schema와 normalizer
- `src/games/memoryCards/stages/stage001.js`: v1 메모리 animal image-image stage 데이터
- `src/styles.css`: 게임 선택 화면과 Find & Learn 화면 스타일
- `public/assets/`: stage 이미지
- `public/CNAME`: GitHub Pages custom domain
- `public/404.html`: GitHub Pages SPA fallback
- `scripts/write-version.mjs`: 빌드 시 `version.json` 생성
- `scripts/agent-commit.sh`: Conventional Commits 헬퍼

## 기능 고정

- 첫 화면은 게임 선택 화면입니다.
- 게임 선택 화면 URL은 `/`입니다.
- 첫 화면에는 ohmesh 로그인 상태와 로그인/로그아웃 버튼이 있습니다.
- 로그인한 사용자에게는 첫 화면에 총 포인트와 연속 방문 streak가 표시됩니다.
- 게임 선택 화면에는 `contents`에서 읽은 Find & Learn stage와 v1 신규 게임 stage 카드가 표시됩니다.
- 게임 선택 화면에는 All/Spot/Hidden/Maze/Memory game type filter가 있어 stage 목록을 좁힐 수 있습니다.
- 게임 선택 화면에는 Level, Theme, Status filter가 있어 난이도, 테마, 완료 여부로 stage 목록을 더 좁힐 수 있습니다.
- 로그인 사용자는 게임 선택 카드에서 각 stage의 `Done`/`Open` 상태를 볼 수 있습니다.
- `Play Today` CTA는 저장된 진행 상황에서 다음 `Open` stage를 추천하고, 상태와 추천 이유, `Start` 액션을 함께 표시합니다.
- 게임 선택 카드의 한국어 stage title은 별도 pill로 표시해 좁은 화면에서도 단어 단위 줄바꿈을 유지합니다.
- 게임 선택 카드는 작은 game type eyebrow, 큰 stage title, 보조 한국어 pill, 작은 metadata badge 순서로 정보를 배치합니다.
- 게임 선택 카드 thumbnail은 game type별 프레이밍 기준을 사용해 장면형 게임과 보드/카드형 게임을 구분합니다.
- 480px 이하 홈 카드에서는 thumbnail, badge, arrow spacing을 줄여 320px 화면에서도 stage 목록을 더 빠르게 훑을 수 있습니다.
- 980px 이상 홈 화면은 넓은 stage selector와 2-column stage grid를 사용해 80개 stage를 더 짧게 탐색합니다.
- 홈 stage card는 game type별 accent stripe와 icon badge로 Spot/Hidden/Maze/Memory를 빠르게 구분합니다.
- 비로그인 홈에는 로그인 없이 바로 플레이 가능하지만 포인트와 streak 저장은 로그인 후 가능하다는 작은 안내가 표시됩니다.
- Spot 모바일 게임 화면은 좌우 비교 그림 영역을 내용 높이에 맞춰 위아래 빈 여백을 줄입니다.
- Spot 데스크톱 게임 화면은 비교 그림 panel 폭과 gutter를 조정해 1280px 화면에서 그림이 더 크게 보입니다.
- Spot 게임 화면은 클릭 가능한 그림과 참고 그림을 target/eye marker, cursor, focus glow로 구분합니다.
- Spot 게임 화면에는 `Focus` 버튼이 있어 작은 차이를 더 크게 살펴보는 집중 보기 overlay를 열 수 있습니다.
- Spot 정답/hint marker는 difference area 크기에 맞춰 30-64px 범위에서 조정됩니다.
- Spot 시작 learning panel은 목표 개수와 핵심 단어를 먼저 보여줍니다.
- Spot 오답 feedback은 `Try again` 중심의 부드러운 문구를 쓰고, 반복 오답 시 hint로 자연스럽게 이어집니다.
- v1 출시 콘텐츠 목표는 게임 타입별 20개, 총 80개 playable stage입니다.
- 현재 틀린그림 찾기는 `contents`에 등록된 20개 stage를 제공합니다.
- 현재 숨은그림 찾기는 `src/games/hiddenObjects/stages`에 등록된 20개 stage를 제공합니다.
- 현재 미로 찾기는 `src/games/maze/stages`에 등록된 20개 stage를 제공합니다.
- 현재 메모리 게임은 `src/games/memoryCards/stages`에 등록된 20개 stage를 제공합니다.
- 게임 선택 화면에서 stage 카드를 누르면 게임 화면으로 들어갑니다.
- 각 stage 게임 화면 URL은 `/games/<game-type>/<stage-id>`입니다.
- v1 숨은그림 찾기 첫 stage는 `/games/hidden_objects/hidden_picnic_001`입니다.
- v1 미로 찾기 첫 stage는 `/games/maze/maze_garden_001`입니다.
- v1 메모리 게임 첫 stage는 `/games/memory_cards/memory_animals_001`입니다.
- 기존 `/games/<stage-id>` 직접 접근은 호환을 위해 계속 복구됩니다.
- 브라우저 뒤로가기/앞으로가기로 게임 선택 화면과 stage 화면을 이동할 수 있습니다.
- 게임 화면에는 ohmesh 로그인 상태, 게임 선택으로 돌아가는 버튼, 힌트 버튼, 리셋 버튼이 있습니다.
- 게임 화면 버튼은 `Game List`, `Hint`, `Reset`, `Log in`, `Log out`처럼 역할을 알 수 있는 라벨을 표시합니다.
- 게임 중 계정 버튼은 play action보다 조용한 보조 스타일로 표시됩니다.
- `Reset`은 한 번 더 확인해야 stage를 다시 시작합니다.
- 사용자가 잠시 막혀 있으면 `Hint` 버튼이 부드럽게 강조됩니다.
- 게임 화면 뒤에는 Find & Learn 전용 일러스트 배경이 낮은 대비로 표시됩니다.
- 게임 화면은 stage 배지, 진행률 미터, 점수 칩이 있는 어린이용 게임 HUD를 사용합니다.
- 진행률 미터는 시작점 marker와 굵은 track으로 현재 진행 상태를 보여줍니다.
- 게임 화면 stage 배지는 게임 타입별 아이콘과 accent color를 사용합니다.
- 찾음, 힌트, 방문, 매칭 상태는 색뿐 아니라 badge, marker, shape로도 구분합니다.
- 모바일 게임 화면 HUD는 stage 정보와 진행 상태, 조작 버튼을 2단 안에 압축해 play area를 우선합니다.
- 데스크톱 게임 화면 HUD는 stage 정보, 진행 상태, 조작 버튼을 한 줄에 배치합니다.
- 주요 게임 조작 버튼과 음성 버튼은 최소 44px touch target을 유지합니다.
- 두 그림은 화면 높이에 맞춰 줄어들며, 데스크톱에서는 최소 높이 기준을 유지합니다.
- 모바일에서도 두 그림은 좌우로 나란히 유지해 스크롤을 줄입니다.
- 원본/변경/왼쪽/오른쪽 같은 라벨은 표시하지 않습니다.
- Content stage에서는 `targetSide`가 아닌 그림은 참고용으로만 보이며 클릭되지 않습니다.
- 진행률과 점수는 그림 위에 표시합니다. 예: `0/6`, `0 pts`
- 점수는 찾은 차이 하나당 100점이며, stage를 완료하면 200점 보너스를 더합니다.
- 로그인한 사용자의 완료 상태, 총 포인트, 게임별 점수, streak는 ohmesh에 저장됩니다.
- 로그아웃 상태의 게임 화면은 조용한 상태 텍스트로 `Local play`를 표시하고 현재 플레이 상태만 유지합니다.
- 모든 차이를 찾으면 성공 완료 안내를 표시합니다.
- 완료 안내는 축하 medal, 점수 카드, 다음 stage가 있으면 `Next Stage`, 마지막 stage에서는 `Play Again`, 첫 화면으로 돌아가는 `Game List`, 계속 보는 `Keep Playing` 버튼을 보여줍니다.
- 정답, 매칭, 수집, 완료 feedback은 짧은 시각/음성 반응을 제공합니다.
- `prefers-reduced-motion` 환경에서는 반복 pulse, nudge, pop animation을 줄입니다.
- v1 게임 화면에는 countdown timer를 표시하지 않습니다.
- 영어 단어/대화 창은 두 그림 아래에 낮게 유지합니다.
- 음성은 Web Speech API `speechSynthesis`를 사용합니다.

## Find & Learn

Find & Learn은 투명 DOM 클릭 영역 대신 stage data와 이미지 기준 좌표 판정을 사용합니다. `contents`에 JSON과 같은 이름의 이미지를 넣으면 첫 화면에 자동 등록됩니다.

- Content stage data: `contents/*.json`
- Content image: JSON 파일과 같은 이름의 `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`
- Built-in fallback stage data: `src/games/findLearn/stages/stage001.js`
- Hit testing: `src/games/findLearn/hitTesting.js`
- Built-in fallback image: `public/assets/`
- Content JSON은 한 장의 이미지 안에 좌/우 그림이 나뉜 `panels.left/right` 구조를 사용합니다.
- Content JSON의 `bbox` 좌표는 전체 이미지 기준 픽셀 좌표입니다.
- 런타임에서는 `bbox`를 각 panel 기준 0~100 퍼센트 좌표로 변환해 판정합니다.
- Content stage의 정답 클릭 영역은 기본적으로 `bbox`보다 사방 24px 넓게 잡습니다.
- JSON 최상위나 각 difference에 `hitPadding` 숫자를 넣으면 px 단위로 클릭 여유를 조절할 수 있습니다.
- Built-in fallback stage의 `area` 좌표는 이미지 기준 0~100 퍼센트 좌표입니다.
- 클릭 판정 우선순위는 항상 `difference -> object -> wrong`입니다.
- 틀린 곳을 맞히면 정답 마커를 표시하고 영어로 `Correct` 피드백을 말합니다.
- 사물을 누르면 영어 단어 카드와 예문을 보여주고 영어 음성을 말합니다.
- 오답을 누르면 오답 마커를 표시하고 영어로 `Wrong` 피드백을 말합니다.
- 정답 마커와 힌트는 `difference.marker`를 사용합니다.
- `DEBUG_AREAS` 기본값은 `false`이며, `true`일 때만 non-clickable SVG overlay를 표시합니다.

## Hidden Objects

숨은그림 찾기 stage는 한 장의 scene 이미지와 찾을 target 목록으로 구성합니다.
각 target은 영어 단어, 한국어 뜻, 선택적 발음/문장, 이미지 기준 0~100 퍼센트
hit area를 가집니다.

- Stage schema helper: `src/games/hiddenObjects/stages/schema.js`
- V1 stage data: `src/games/hiddenObjects/stages/stage001.js`
- V1 scene image: `public/assets/hidden-picnic-001.png`
- Scene: `scene.image`, `scene.width`, `scene.height`, `scene.alt`
- Target: `id`, `word`, `meaning`, `phonetic`, `sentence`, `translation`, `area`, `marker`, `hint`
- 지원하는 `area.type`: `circle`, `rect`, `polygon`
- 좌표는 scene 이미지 기준 0~100 퍼센트 값입니다.
- Hit testing은 `src/games/hiddenObjects/hitTesting.js`에서 target id별 중복
  클릭을 제외하고 판정합니다.
- 게임 UI는 큰 scene, 찾을 target 목록, 찾은 marker, 힌트 marker, 진행률,
  점수, 리셋, 완료 안내를 제공합니다.
- 힌트는 남은 target 하나를 scene marker와 target 목록 강조로 보여주며
  자동으로 정답 처리하지 않습니다.
- 점수는 target 하나당 100점이며, stage를 완료하면 200점 보너스를 더합니다.

## Maze

미로 찾기 stage는 grid 기반입니다. `#`은 벽, `.`은 길이며, `S`와 `G`는
각각 시작점과 도착점으로 사용할 수 있습니다. Stage data는 시작점, 도착점,
벽, 선택 수집 아이템, 선택 theme image를 포함합니다.

- Stage schema helper: `src/games/maze/stages/schema.js`
- V1 stage data: `src/games/maze/stages/stage001.js`
- V1 preview image: `public/assets/maze-garden-001.svg`
- Grid cells: `#`, `.`, `S`, `G`
- Cell 좌표: `{ row, col }`
- Collectible: `id`, `row`, `col`, `word`, `meaning`, `points`
- 이동 엔진은 방향 이동과 pointer/touch 위치를 grid cell로 변환하는 helper를 제공합니다.
- 막힌 길을 선택해도 실패시키지 않고 현재 위치를 유지하며 안내 feedback을 반환합니다.
- 게임 UI는 grid board, 출발점, 도착점, player marker, 수집 아이템, 진행률,
  점수, 리셋, 학습 패널, 완료 안내를 제공합니다.
- 점수는 미로 완료 300점과 수집 아이템 하나당 기본 50점입니다.

## Memory Cards

메모리 게임 stage는 카드 pair 목록과 각 pair의 두 card face로 구성합니다.
v1 첫 stage는 이미지-이미지 매칭을 사용하고, 이후 stage에서 이미지-단어,
단어-음성 매칭으로 확장할 수 있습니다.

- Stage schema helper: `src/games/memoryCards/stages/schema.js`
- V1 stage data: `src/games/memoryCards/stages/stage001.js`,
  `src/games/memoryCards/stages/generatedStages.js`
- V1 preview image: `public/assets/memory-animals-001.svg`
- Match modes: `image_image`, `image_word`, `word_audio`
- Pair: `id`, `word`, `meaning`, `phonetic`, `sentence`, `translation`, `audio`
- Card face: `id`, `type`, `label`, `image`, `emoji`, `alt`, `audio`
- 엔진은 deterministic deck 생성, 카드 뒤집기, 매칭, mismatch delay 상태,
  완료 여부, 시도 횟수를 제공합니다.
- 카드 UI는 4, 6, 8, 12쌍 stage에서 정사각형 card grid를 유지합니다.
- 카드를 열면 영어 단어/문장을 말하고, 매칭되면 match 피드백을 말합니다.
- 점수는 pair 하나당 100점이며, stage를 완료하면 200점 보너스를 더합니다.

지원하는 영역 타입:

- `circle`
- `rect`
- `polygon`

Content JSON 예시:

```json
{
  "id": "spot_playground_001",
  "title": "Playground",
  "titleKo": "놀이터",
  "type": "spot_the_difference",
  "imageWidth": 1448,
  "imageHeight": 1086,
  "hitPadding": 24,
  "totalDifferences": 6,
  "panels": {
    "left": { "x": 0, "y": 0, "width": 724, "height": 1086 },
    "right": { "x": 724, "y": 0, "width": 724, "height": 1086 }
  },
  "differences": [
    {
      "id": "tree_apples",
      "label": "apple tree",
      "labelKo": "사과나무",
      "targetSide": "right",
      "bbox": { "x": 760, "y": 90, "width": 220, "height": 250 },
      "hitPadding": 24,
      "description": "The tree has apples.",
      "voiceText": "Apples are growing on the tree.",
      "translation": "사과가 나무에서 자라고 있어요."
    }
  ]
}
```

## 실행

```sh
npm install
npm run dev -- --host 0.0.0.0 --port 5175
```

로컬 주소:

```text
http://localhost:5175
```

## 검증

```sh
npm test
npm run lint
npm run build
```

`npm test`는 Node test runner로 공통 점수/streak와 게임 core logic을 확인합니다.
`npm run build`는 Vite 빌드 후 `dist/version.json`을 함께 생성합니다.

## Git

- 기본 브랜치는 `main`입니다.
- 커밋 메시지는 Conventional Commits 형식을 사용합니다.
- 커밋은 `scripts/agent-commit.sh` 헬퍼를 우선 사용합니다.
- 의도한 파일만 stage합니다.
- `dist`, `node_modules`, `.env`, local screenshot, secret 파일은 커밋하지 않습니다.

예시:

```sh
git add src/App.jsx src/styles.css README.md docs/spec.md
TYPE=feat SUMMARY="add focused game behavior" scripts/agent-commit.sh
```

## 배포

- GitHub Pages 배포는 `.github/workflows/deploy-pages.yml`이 담당합니다.
- `main` 브랜치 push 시 자동 배포됩니다.
- 수동 재배포는 아래 명령으로 실행합니다.

```sh
gh workflow run deploy-pages.yml --ref main
```

- workflow는 `npm ci`, `npm run lint`, `npm run build`를 실행한 뒤 `dist`를 GitHub Pages artifact로 배포합니다.
- GitHub Pages source는 GitHub Actions입니다.
- custom domain은 `public/CNAME`의 `pico.jjgo.io`입니다.
- 로컬 `gh-pages` 브랜치 publish는 사용하지 않습니다.

## ohmesh 로그인

Pico는 ohmesh에 등록된 앱이며, 첫 화면과 게임 화면에서 ohmesh 로그인 상태를 확인합니다.

- 앱 slug: `pico`
- 기본 ohmesh URL: `https://ohmesh.jjgo.io`
- 로그인은 `GET /login?app=pico&redirect_url={current_app_url}`로 이동합니다.
- 로그아웃은 `GET /logout?app=pico&redirect_url={current_app_url}`로 이동합니다.
- 세션 확인은 `GET /auth/me?app=pico`를 `credentials: "include"`로 호출합니다.
- ohmesh는 앱 전용 HttpOnly session cookie를 사용하며 Pico는 토큰을 저장하거나 표시하지 않습니다.
- 로그인한 사용자의 v1 총 포인트, streak, 게임별/stage별 진행 상태는 `pico-progress` record 하나에 저장합니다.
- Find & Learn의 세부 `foundIds` 진행 상태는 호환을 위해 `find-learn-progress` record에도 저장합니다.
- 저장 데이터는 stage별 `foundIds`, `completed`, `score`, `hintUsed`, `hintCount`, `completedAt`, `updatedAt`을 포함합니다.
- 로그아웃 상태에서는 Find & Learn 진행 상태가 현재 브라우저 세션의 로컬 React 상태로만 유지됩니다.
- OAuth client ID와 secret은 ohmesh 또는 운영 환경에서 관리합니다.

## 문서 업데이트 규칙

- 사용자에게 보이는 기능, 화면 흐름, 버튼, 음성 피드백이 바뀌면 이 README와 `docs/spec.md`를 함께 갱신합니다.
- stage data 구조나 hit testing 계약이 바뀌면 `Find & Learn` 섹션과 `docs/spec.md`의 data contract를 함께 갱신합니다.
- 배포 방식, custom domain, version 파일, GitHub Pages fallback이 바뀌면 `배포` 섹션과 `AGENTS.md`를 함께 갱신합니다.

## License

Source code in this repository is licensed under the [MIT License](LICENSE).

Non-code assets, including text content, images, photos, videos, audio, service
names, logos, and brand materials, are not covered by the MIT License. See
[ASSET-LICENSE.md](ASSET-LICENSE.md).
