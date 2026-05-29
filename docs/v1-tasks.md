# Pico V1 Tasks

출처: `docs/v1-scope.md`

이 문서는 v1 범위를 구현 가능한 backlog로 나눈다. 현재 틀린그림 찾기
게임에서 출발해 네 가지 게임 타입을 갖춘 v1으로 확장하되, 항상 동작하는
빌드를 유지하는 순서로 정리한다.

상태 표기:

- `[ ]`: 시작 전
- `[~]`: 진행 중
- `[x]`: 완료

우선순위:

- `P0`: v1 필수
- `P1`: v1에 중요한 polish
- `P2`: v1 이후 후속 작업

## Milestone 0: 제품 결정

- [x] `V1-T001` `P0` v1 초기 stage 수를 결정한다.
  각 게임 타입별 1개 stage로 출시할지, 기존 틀린그림 찾기는 여러
  stage를 유지하고 신규 게임을 1개씩 추가할지 정한다.
  결정: 기존 틀린그림 찾기 stage들은 유지하고, 숨은그림 찾기, 미로
  찾기, 메모리 게임은 각각 최소 1개 polished stage를 추가해 v1로
  출시한다.

- [x] `V1-T002` `P0` 로그아웃 점수 표시 정책을 정한다.
  로그아웃 사용자에게 임시 세션 포인트를 보여줄지, stage 안의 현재
  점수만 보여줄지 결정한다.
  결정: 로그아웃 사용자는 현재 stage 점수만 본다. 총 포인트, streak,
  영구 진행 저장은 로그인 사용자에게만 제공한다.

- [x] `V1-T003` `P0` 첫 메모리 게임 매칭 방식을 정한다.
  이미지-이미지, 이미지-단어, 혼합 방식 중 첫 stage에 사용할 방식을
  결정한다.
  결정: 첫 메모리 stage는 이미지-이미지 매칭으로 시작한다. 이미지-단어
  또는 단어-음성 매칭은 이후 난이도 stage에서 사용한다.

- [x] `V1-T004` `P0` 미로 엔진 방향을 정한다.
  이미지 hit testing, grid 기반 미로, hybrid 중 하나를 선택한 뒤
  콘텐츠 제작에 들어간다.
  결정: v1 미로는 grid 기반 엔진으로 구현한다. 장식 이미지는 사용할 수
  있지만 이동 가능 여부와 완료 판정은 grid data가 담당한다.

## Milestone 1: 공통 게임 플랫폼

- [x] `V1-T010` `P0` 공통 game type 모델을 만든다.
  `spot_the_difference`, `hidden_objects`, `maze`, `memory_cards` 같은
  안정적인 game type ID를 정의한다.
  완료: `src/games/gameTypes.js`에 공통 game type ID와 표시 metadata를
  추가했다.

- [x] `V1-T011` `P0` 공통 stage registry를 만든다.
  `id`, `gameType`, `title`, `titleKo`, `level`, `theme`,
  `estimatedMinutes`, `previewImage`, `points`를 가진 단일 stage 목록으로
  확장한다.
  완료: `src/games/stageRegistry.js`가 기존 틀린그림 stage들을 공통 v1
  metadata로 normalize한다.

- [x] `V1-T012` `P0` 게임 선택 화면을 여러 game type에 맞게 확장한다.
  네 가지 게임 타입의 stage card를 보여주고, 각 card에서 게임 타입과
  주제가 분명히 보이게 한다.
  완료: selector card가 registry metadata의 game type, level, theme을
  표시하며 신규 game type stage가 추가되면 같은 구조로 노출된다.

- [x] `V1-T013` `P0` 공통 게임 route 규칙을 정한다.
  각 playable stage가 예측 가능한 URL을 갖고, 브라우저 뒤로가기와
  앞으로가기가 현재 화면과 동기화되게 한다.
  완료: 기본 stage URL은 `/games/<game-type>/<stage-id>`이며, 기존
  `/games/<stage-id>` URL도 복구된다.

- [x] `V1-T014` `P0` 공통 game shell을 추출하거나 공식화한다.
  HUD, `Games`, `Hint`, `Reset`, 계정 버튼, 학습 패널, 완료 dialog,
  점수, 진행률 패턴을 게임 타입마다 재사용한다.
  완료: `src/games/GameShell.jsx`로 공통 HUD, action, learning panel,
  completion dialog를 분리했고 Find & Learn이 이를 사용한다.

- [x] `V1-T015` `P1` 오늘의 플레이 진입점을 추가한다.
  첫 화면에서 아직 완료하지 않은 쉬운 stage를 추천하고, 모두 완료했다면
  다음 난이도나 복습 stage를 추천한다.
  완료: selector 상단에 가장 쉬운 stage를 시작하는 Today entry를
  추가했다. 완료 상태 기반 추천은 progress 통합 후 고도화한다.

- [x] `V1-T016` `P1` stage 난이도 정보를 UI에 반영한다.
  selector가 시험처럼 느껴지지 않게 아이 친화적인 방식으로 level을
  보여준다.
  완료: selector card badge가 `Level N`과 theme을 함께 표시한다.

## Milestone 2: 진행, 포인트, 연속 방문

- [x] `V1-T020` `P0` v2 Pico progress record helper를 만든다.
  총 포인트, streak, 게임별 요약, stage별 진행을 저장하는 단일 Pico
  progress record read/write helper를 추가한다.
  완료: `src/ohmeshProgress.js`에 `pico-progress` v2 record의 empty/load/save
  helper와 normalize 로직을 추가했다.

- [x] `V1-T021` `P0` 기존 Find & Learn 진행 상태를 보존한다.
  기존 `find-learn-progress` 데이터를 legacy shape로 읽거나 v2 구조로
  migration해 완료 상태를 잃지 않게 한다.
  완료: `mergeFindLearnLegacyProgress` helper가 기존 Find & Learn 진행을
  v2 Pico progress shape로 병합한다.

- [x] `V1-T022` `P0` stage 완료 보너스를 1회만 지급한다.
  사용자별 stage마다 completion bonus가 한 번만 들어가게 한다.
  완료: `awardStageCompletionBonus` helper가 stage별
  `completionBonusAwarded`를 확인해 보너스를 한 번만 지급한다.

- [x] `V1-T023` `P0` 공통 포인트 지급 로직을 구현한다.
  틀린그림 정답, 숨은그림 목표, 미로 완료, 미로 수집 아이템, 메모리
  매칭, stage 완료 보너스를 한 규칙으로 처리한다.
  완료: `POINT_EVENTS`, `POINT_VALUES`, `awardStageEventPoints`,
  `awardStageCompletionBonus`로 공통 포인트 지급과 중복 지급 방지를
  제공한다.

- [x] `V1-T024` `P0` daily streak 방문 인정 로직을 구현한다.
  하루에 stage 완료 또는 1점 이상 획득이 있으면 그날 방문으로 인정한다.
  완료: `qualifyDailyVisit` helper가 로컬 날짜 기준으로 오늘 방문을
  인정하고 current/longest streak를 갱신한다.

- [x] `V1-T025` `P0` 하루 1회 streak 보상을 구현한다.
  로컬 날짜 기준으로 하루 한 번만 streak reward를 지급한다.
  완료: `awardDailyStreakReward` helper가 오늘 방문 인정 후 하루 한 번만
  streak reward를 total points에 더한다.

- [x] `V1-T026` `P1` selector에 총 포인트와 streak를 보여준다.
  로그인 사용자에게 진행감을 주되 압박감이나 clutter는 만들지 않는다.
  완료: 로그인 사용자에게 selector summary chip으로 total points와
  current streak를 표시한다.

- [ ] `V1-T027` `P1` 로그아웃 local progress 정책을 정리한다.
  로그아웃 상태에서도 플레이할 수 있게 유지하고, 임시 진행 상태임을
  명확히 한다.

## Milestone 3: 틀린그림 찾기 v1 정렬

- [x] `V1-T030` `P0` playable 틀린그림 찾기 게임을 제공한다.
  현재 `Find & Learn`은 stage 선택, hit testing, 점수, 힌트, 리셋,
  완료, 음성, ohmesh 진행 저장을 지원한다.

- [ ] `V1-T031` `P0` 틀린그림 stage를 공통 registry에 등록한다.
  기존 content stage를 유지하면서 v1 공통 metadata를 노출한다.

- [ ] `V1-T032` `P0` 틀린그림 점수를 공통 포인트 규칙과 맞춘다.
  정답 1개당 100점을 유지하고 공통 completion bonus를 추가한다.

- [ ] `V1-T033` `P1` 부드러운 idle hint prompt를 추가한다.
  사용자가 일정 시간 막혀 있으면 `Hint` 버튼을 시각적으로 강조한다.

- [ ] `V1-T034` `P1` 힌트 사용 기록을 남긴다.
  v1에서는 큰 벌점을 주지 않되, 이후 난이도 조정을 위해 사용 여부를
  저장한다.

## Milestone 4: 숨은그림 찾기

- [ ] `V1-T040` `P0` 숨은그림 stage schema를 정의한다.
  scene image, target objects, 영어 단어, 한국어 뜻, 선택적 발음 표기,
  예문, 이미지 기준 hit area를 포함한다.

- [ ] `V1-T041` `P0` 숨은그림 hit testing을 만든다.
  가능하면 기존 image-relative coordinate helper를 재사용한다.

- [ ] `V1-T042` `P0` 숨은그림 게임 UI를 만든다.
  큰 scene, 목표 목록, 찾은 표시, 진행률, 점수, 힌트, 리셋, 학습 패널,
  완료 dialog를 제공한다.

- [ ] `V1-T043` `P0` 숨은그림 점수 로직을 구현한다.
  목표 1개당 100점과 공통 completion bonus를 1회 지급한다.

- [ ] `V1-T044` `P0` 완성도 있는 숨은그림 stage 1개를 만든다.
  v1 테마 중 하나를 사용하고 목표 사물 3-8개를 포함한다.

- [ ] `V1-T045` `P1` 숨은그림 힌트 동작을 추가한다.
  남은 목표 하나를 강조하되 자동 정답 처리하지 않는다.

## Milestone 5: 미로 찾기

- [ ] `V1-T050` `P0` 미로 stage schema를 정의한다.
  grid, start, goal, obstacles, optional collectibles, optional theme
  image를 포함한다.

- [ ] `V1-T051` `P0` 미로 이동 엔진을 만든다.
  모바일 touch와 데스크톱 pointer 입력을 지원한다.

- [ ] `V1-T052` `P0` 부드러운 wrong-path 동작을 만든다.
  잘못된 길에서 가혹하게 실패시키지 않고 안내하거나 부드럽게 되돌린다.

- [ ] `V1-T053` `P0` 미로 게임 UI를 만든다.
  출발점, 도착점, player marker, 진행률, 점수, 리셋, 학습 패널, 완료
  dialog를 제공한다.

- [ ] `V1-T054` `P0` 미로 점수 로직을 구현한다.
  완료 300점과 선택 수집 아이템 1개당 50점을 지급한다.

- [ ] `V1-T055` `P0` 완성도 있는 미로 stage 1개를 만든다.
  출발점과 도착점이 명확한 level 1 미로로 시작한다.

## Milestone 6: 메모리 게임

- [ ] `V1-T060` `P0` 메모리 게임 stage schema를 정의한다.
  card pairs, card faces, match mode, words, meanings, optional audio/sentence
  fields를 포함한다.

- [ ] `V1-T061` `P0` 메모리 게임 엔진을 만든다.
  카드 뒤집기, 매칭, mismatch delay, 완료, 시도 횟수 기록을 지원한다.

- [ ] `V1-T062` `P0` 반응형 카드 레이아웃을 만든다.
  4, 6, 8, 12쌍을 아이가 누르기 좋은 크기로 지원한다.

- [ ] `V1-T063` `P0` 메모리 게임 음성 피드백을 구현한다.
  카드를 열거나 짝을 맞출 때 영어 단어를 말한다.

- [ ] `V1-T064` `P0` 메모리 게임 점수 로직을 구현한다.
  짝 1개당 100점과 공통 completion bonus를 1회 지급한다.

- [ ] `V1-T065` `P0` 완성도 있는 메모리 stage 1개를 만든다.
  `V1-T003`에서 정한 첫 매칭 방식을 사용한다.

## Milestone 7: 콘텐츠와 에셋

- [ ] `V1-T070` `P0` v1 asset naming convention을 정한다.
  stage JSON, preview image, game image, optional audio의 위치와 이름을
  예측 가능하게 만든다.

- [ ] `V1-T071` `P0` 최소 v1 콘텐츠 세트를 제작한다.
  네 가지 게임 타입마다 최소 1개 이상의 polished playable stage를
  제공한다.

- [ ] `V1-T072` `P1` vocabulary QA checklist를 만든다.
  stage마다 영어 단어, 한국어 뜻, 문장, 발음 적합성, 연령 적합성을
  확인한다.

- [ ] `V1-T073` `P1` visual QA checklist를 만든다.
  이미지 선명도, 목표 가시성, 클릭 영역 여유, 모바일 framing을 확인한다.

- [ ] `V1-T074` `P1` 모든 stage에 level metadata를 추가한다.
  v1 난이도 규칙에 따라 Level 1, 2, 3을 표시한다.

## Milestone 8: 접근성, UX, polish

- [ ] `V1-T080` `P0` 모든 게임 action에 visible label이 있는지 확인한다.
  내비게이션, 힌트, 리셋, 로그인, 로그아웃 command label을 명확히
  유지한다.

- [ ] `V1-T081` `P0` 모바일 우선 layout을 검증한다.
  모든 게임 타입에서 320px, 일반 모바일, 태블릿, 데스크톱 viewports를
  확인한다.

- [ ] `V1-T082` `P0` touch target size를 검증한다.
  중요한 control과 게임 target이 아이 손가락으로 누르기 충분히 큰지
  확인한다.

- [ ] `V1-T083` `P1` 작은 축하 feedback을 추가한다.
  정답, 매칭, 수집, stage 완료에 짧은 시각/음성 반응을 제공한다.

- [ ] `V1-T084` `P1` v1 UI에 countdown timer를 넣지 않는다.
  내부 elapsed time은 나중에 수집할 수 있지만 아이에게 시간 압박을 주지
  않는다.

- [ ] `V1-T085` `P1` 한국어 보조 텍스트를 검토한다.
  보호자에게는 도움이 되되 아이에게는 visual-first 흐름을 유지한다.

## Milestone 9: 검증과 release 준비

- [ ] `V1-T090` `P0` 공통 progress와 scoring focused test를 추가한다.
  completion bonus 1회 지급, total points, streak reward 규칙을 확인한다.

- [ ] `V1-T091` `P0` 게임별 core logic focused test를 추가한다.
  가능한 범위에서 hit testing, 숨은그림 판정, 미로 완료, 메모리 매칭을
  확인한다.

- [ ] `V1-T092` `P0` 수동 게임 QA를 실행한다.
  모든 v1 stage를 모바일 크기와 데스크톱 크기에서 끝까지 플레이한다.

- [ ] `V1-T093` `P0` 제품 문서를 갱신한다.
  `README.md`, `docs/spec.md`, `docs/v1-scope.md`, 이 task 문서를 실제
  shipped behavior와 맞춘다.

- [ ] `V1-T094` `P0` release validation을 통과한다.
  v1 release commit 전 `npm run lint`와 `npm run build`를 실행한다.

## 권장 구현 순서

1. `V1-T001`부터 `V1-T004`까지 제품 결정을 먼저 끝낸다.
2. `V1-T010`부터 `V1-T014`까지 공통 registry와 shell을 만든다.
3. `V1-T020`부터 `V1-T027`까지 progress, points, streak를 구현한다.
4. `V1-T031`부터 `V1-T034`까지 기존 틀린그림 찾기를 v1 구조에 맞춘다.
5. 숨은그림 찾기, 메모리 게임, 미로 찾기 순서로 신규 게임을 만든다.
6. 콘텐츠와 에셋 task를 채운다.
7. 접근성, 수동 QA, release validation을 마무리한다.

## V1 범위 밖

아래 항목은 `docs/v1-scope.md`가 바뀌기 전에는 v1 task로 만들지 않는다.

- 네이티브 모바일 앱
- 멀티플레이 또는 채팅
- 공개 리더보드
- 광고, 결제, 구독, 현실 보상
- 보호자 또는 교사용 대시보드
- 사용자 생성 콘텐츠 도구
- 플레이어 경험 안의 runtime AI 이미지 생성
- 카운트다운 타이머 압박
