# Pico

Pico는 작은 영어 학습 게임 모음입니다. 첫 게임은 숨은그림찾기/틀린그림찾기 방식의 `Find & Learn`입니다.

운영 주소:

```text
https://pico.jjgo.io
```

## 문서

- `docs/spec.md`: Codex가 먼저 읽는 제품 범위, 게임 계약, 배포 계약
- `README.md`: 사람을 위한 실행 방법, 기능 흐름, git/배포 기준
- `AGENTS.md`: 에이전트 작업, 검증, 커밋 규칙

## 코드 구조

- `src/App.jsx`: Pico 첫 화면의 게임 선택 목록과 게임 진입 흐름
- `src/ohmeshAuth.js`: ohmesh 로그인/로그아웃 URL 생성과 세션 확인
- `src/games/findLearn/FindLearnGame.jsx`: Find & Learn 화면, 클릭 처리, 마커, 음성 피드백
- `src/games/findLearn/hitTesting.js`: 이미지 기준 퍼센트 좌표 변환과 영역 충돌 판정
- `src/games/findLearn/stages/stage001.js`: 현재 stage 데이터
- `src/styles.css`: 게임 선택 화면과 Find & Learn 화면 스타일
- `public/assets/`: stage 이미지
- `public/CNAME`: GitHub Pages custom domain
- `public/404.html`: GitHub Pages SPA fallback
- `scripts/write-version.mjs`: 빌드 시 `version.json` 생성
- `scripts/agent-commit.sh`: Conventional Commits 헬퍼

## 기능 고정

- 첫 화면은 게임 선택 화면입니다.
- 첫 화면에는 ohmesh 로그인 상태와 로그인/로그아웃 버튼이 있습니다.
- 현재 게임은 `Find & Learn` 하나입니다.
- 게임 선택 화면에서 `Find & Learn`을 누르면 게임 화면으로 들어갑니다.
- 게임 화면에는 ohmesh 로그인 상태, 게임 선택으로 돌아가는 버튼, 힌트 버튼, 리셋 버튼이 있습니다.
- 두 그림은 크게 보여줍니다.
- 원본/변경/왼쪽/오른쪽 같은 라벨은 표시하지 않습니다.
- 진행률은 그림 위에 숫자만 표시합니다. 예: `0/6`
- 영어 단어/대화 창은 두 그림 아래에 낮게 유지합니다.
- 음성은 Web Speech API `speechSynthesis`를 사용합니다.

## Find & Learn

Find & Learn은 투명 DOM 클릭 영역 대신 stage data와 이미지 기준 좌표 판정을 사용합니다.

- Stage data: `src/games/findLearn/stages/stage001.js`
- Hit testing: `src/games/findLearn/hitTesting.js`
- 이미지: `public/assets/`
- 모든 `area` 좌표는 이미지 기준 0~100 퍼센트 좌표입니다.
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
- 현재 Find & Learn 진행 상태는 클라이언트 로컬 상태만 사용합니다.
- OAuth client ID와 secret은 ohmesh 또는 운영 환경에서 관리합니다.

## 문서 업데이트 규칙

- 사용자에게 보이는 기능, 화면 흐름, 버튼, 음성 피드백이 바뀌면 이 README와 `docs/spec.md`를 함께 갱신합니다.
- stage data 구조나 hit testing 계약이 바뀌면 `Find & Learn` 섹션과 `docs/spec.md`의 data contract를 함께 갱신합니다.
- 배포 방식, custom domain, version 파일, GitHub Pages fallback이 바뀌면 `배포` 섹션과 `AGENTS.md`를 함께 갱신합니다.
