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
- `README.md`: 사람을 위한 실행 방법, 기능 흐름, git/배포 기준
- `AGENTS.md`: 에이전트 작업, 검증, 커밋 규칙

## 코드 구조

- `contents/`: Find & Learn에 자동 등록되는 stage JSON/이미지
- `src/App.jsx`: Pico 첫 화면의 게임 선택 목록과 게임 진입 흐름
- `src/ohmeshAuth.js`: ohmesh 로그인/로그아웃 URL 생성과 세션 확인
- `src/ohmeshProgress.js`: ohmesh 사용자별 Find & Learn 진행/점수 record 저장
- `src/games/findLearn/FindLearnGame.jsx`: Find & Learn 화면, 클릭 처리, 마커, 음성 피드백
- `src/games/findLearn/hitTesting.js`: 이미지 기준 퍼센트 좌표 변환과 영역 충돌 판정
- `src/games/findLearn/stages/contentStages.js`: `contents/*.json`과 같은 이름의 이미지 자동 등록
- `src/games/findLearn/stages/stage001.js`: built-in fallback stage 데이터
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
- 게임 선택 화면에는 `contents`에서 읽은 Find & Learn stage 카드가 표시됩니다.
- 게임 선택 화면에서 stage 카드를 누르면 게임 화면으로 들어갑니다.
- 각 stage 게임 화면 URL은 `/games/<game-type>/<stage-id>`입니다.
- 기존 `/games/<stage-id>` 직접 접근은 호환을 위해 계속 복구됩니다.
- 브라우저 뒤로가기/앞으로가기로 게임 선택 화면과 stage 화면을 이동할 수 있습니다.
- 게임 화면에는 ohmesh 로그인 상태, 게임 선택으로 돌아가는 버튼, 힌트 버튼, 리셋 버튼이 있습니다.
- 게임 화면 버튼은 `Games`, `Hint`, `Reset`, `Log in`, `Log out`처럼 역할을 알 수 있는 라벨을 표시합니다.
- 사용자가 잠시 막혀 있으면 `Hint` 버튼이 부드럽게 강조됩니다.
- 게임 화면 뒤에는 Find & Learn 전용 일러스트 배경이 낮은 대비로 표시됩니다.
- 게임 화면은 stage 배지, 진행률 미터, 점수 칩이 있는 어린이용 게임 HUD를 사용합니다.
- 두 그림은 화면 높이에 맞춰 줄어들며, 데스크톱에서는 최소 높이 기준을 유지합니다.
- 모바일에서도 두 그림은 좌우로 나란히 유지해 스크롤을 줄입니다.
- 원본/변경/왼쪽/오른쪽 같은 라벨은 표시하지 않습니다.
- Content stage에서는 `targetSide`가 아닌 그림은 참고용으로만 보이며 클릭되지 않습니다.
- 진행률과 점수는 그림 위에 표시합니다. 예: `0/6`, `0 pts`
- 점수는 찾은 차이 하나당 100점이며, stage를 완료하면 200점 보너스를 더합니다.
- 로그인한 사용자의 완료 상태와 점수는 ohmesh에 저장됩니다.
- 로그아웃 상태의 게임 화면은 `Local play`를 표시하고 현재 플레이 상태만 유지합니다.
- 모든 차이를 찾으면 성공 완료 안내를 표시합니다.
- 완료 안내에는 다음 stage가 있으면 `Next`, 첫 화면으로 돌아가는 `Home`, 계속 보는 `Stay` 버튼이 있습니다.
- 영어 단어/대화 창은 두 그림 아래에 낮게 유지합니다.
- 음성은 Web Speech API `speechSynthesis`를 사용합니다.

## Find & Learn

Find & Learn은 투명 DOM 클릭 영역 대신 stage data와 이미지 기준 좌표 판정을 사용합니다. `contents`에 JSON과 같은 이름의 이미지를 넣으면 첫 화면에 자동 등록됩니다.

- Content stage data: `contents/*.json`
- Content image: JSON 파일과 같은 이름의 `.png`, `.jpg`, `.jpeg`, `.webp`
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
npm run lint
npm run build
```

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
- 로그인한 사용자의 Find & Learn 진행 상태는 `find-learn-progress` record 하나에 저장합니다.
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
