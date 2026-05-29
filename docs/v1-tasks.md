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

- [x] `V1-T001` `P0` v1 출시 stage 수를 결정한다.
  각 게임 타입별 출시 콘텐츠 목표 수량을 정한다.
  결정: v1 출시 목표는 틀린그림 찾기, 숨은그림 찾기, 미로 찾기,
  메모리 게임을 각각 20개씩 제공하는 것이다. 총 80개 playable stage를
  v1 범위로 한다. 현재 구현된 6개 stage는 엔진과 UX를 검증하는 seed
  set으로 유지한다.

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

- [x] `V1-T027` `P1` 로그아웃 local progress 정책을 정리한다.
  로그아웃 상태에서도 플레이할 수 있게 유지하고, 임시 진행 상태임을
  명확히 한다.
  완료: 로그아웃 게임 화면 HUD에 `Local play`를 표시해 저장되지 않는
  현재 플레이 상태임을 명확히 한다.

## Milestone 3: 틀린그림 찾기 v1 정렬

- [x] `V1-T030` `P0` playable 틀린그림 찾기 게임을 제공한다.
  현재 `Find & Learn`은 stage 선택, hit testing, 점수, 힌트, 리셋,
  완료, 음성, ohmesh 진행 저장을 지원한다.

- [x] `V1-T031` `P0` 틀린그림 stage를 공통 registry에 등록한다.
  기존 content stage를 유지하면서 v1 공통 metadata를 노출한다.
  완료: 기존 Find & Learn content stage가 `stageRegistry`에서
  `spot_the_difference` game type과 공통 metadata로 노출된다.

- [x] `V1-T032` `P0` 틀린그림 점수를 공통 포인트 규칙과 맞춘다.
  정답 1개당 100점을 유지하고 공통 completion bonus를 추가한다.
  완료: Find & Learn 점수와 저장 score가 공통 point value의 차이당 100점과
  stage completion bonus 200점을 반영한다.

- [x] `V1-T033` `P1` 부드러운 idle hint prompt를 추가한다.
  사용자가 일정 시간 막혀 있으면 `Hint` 버튼을 시각적으로 강조한다.
  완료: 미완료 stage에서 활동이 잠시 없으면 `Hint` 버튼에 부드러운 강조
  상태가 붙고, 클릭/정답/오답/리셋/힌트 사용 시 타이머가 다시 시작된다.

- [x] `V1-T034` `P1` 힌트 사용 기록을 남긴다.
  v1에서는 큰 벌점을 주지 않되, 이후 난이도 조정을 위해 사용 여부를
  저장한다.
  완료: 로그인 사용자가 Hint를 누르면 점수 벌점 없이 `hintUsed`,
  `hintCount`, `lastHintAt`이 Find & Learn 진행 record에 저장된다.

## Milestone 4: 숨은그림 찾기

- [x] `V1-T040` `P0` 숨은그림 stage schema를 정의한다.
  scene image, target objects, 영어 단어, 한국어 뜻, 선택적 발음 표기,
  예문, 이미지 기준 hit area를 포함한다.
  완료: `src/games/hiddenObjects/stages/schema.js`에 scene, targets,
  영어/한국어 vocabulary, 선택적 발음/문장, percent hit area를 normalize하는
  stage schema helper를 추가했다.

- [x] `V1-T041` `P0` 숨은그림 hit testing을 만든다.
  가능하면 기존 image-relative coordinate helper를 재사용한다.
  완료: `src/games/hiddenObjects/hitTesting.js`가 Find & Learn의
  `getRelativePoint`, `isPointInArea`를 재사용해 아직 찾지 않은 target을
  판정한다.

- [x] `V1-T042` `P0` 숨은그림 게임 UI를 만든다.
  큰 scene, 목표 목록, 찾은 표시, 진행률, 점수, 힌트, 리셋, 학습 패널,
  완료 dialog를 제공한다.
  완료: `HiddenObjectsGame`이 공통 `GameShell` 안에서 scene, target list,
  found/hint marker, 진행률, 점수, 힌트, 리셋, 학습 패널, 완료 dialog를
  렌더링한다.

- [x] `V1-T043` `P0` 숨은그림 점수 로직을 구현한다.
  목표 1개당 100점과 공통 completion bonus를 1회 지급한다.
  완료: `HiddenObjectsGame` 점수는 target당 공통 100점과 완료 시 200점
  completion bonus를 반영한다.

- [x] `V1-T044` `P0` 완성도 있는 숨은그림 stage 1개를 만든다.
  v1 테마 중 하나를 사용하고 목표 사물 3-8개를 포함한다.
  완료: `hidden_picnic_001` level 1 picnic stage를 추가하고, apple, kite,
  book, spoon, duck, ball 6개 target과 scene asset을 selector/route에
  등록했다.

- [x] `V1-T045` `P1` 숨은그림 힌트 동작을 추가한다.
  남은 목표 하나를 강조하되 자동 정답 처리하지 않는다.
  완료: Hint가 남은 target 하나를 scene marker와 target 목록 강조로 보여주며
  found state나 점수는 바꾸지 않는다.

## Milestone 5: 미로 찾기

- [x] `V1-T050` `P0` 미로 stage schema를 정의한다.
  grid, start, goal, obstacles, optional collectibles, optional theme
  image를 포함한다.
  완료: `src/games/maze/stages/schema.js`에 grid, start, goal, obstacles,
  collectibles, themeImage를 normalize하는 grid 기반 미로 schema helper를
  추가했다.

- [x] `V1-T051` `P0` 미로 이동 엔진을 만든다.
  모바일 touch와 데스크톱 pointer 입력을 지원한다.
  완료: `src/games/maze/engine.js`가 방향 이동, pointer/touch 좌표의 cell
  변환, 인접 cell 이동, 수집 아이템 획득, 방문 cell 추적, 완료 판정을
  제공한다.

- [x] `V1-T052` `P0` 부드러운 wrong-path 동작을 만든다.
  잘못된 길에서 가혹하게 실패시키지 않고 안내하거나 부드럽게 되돌린다.
  완료: 막힌 칸이나 인접하지 않은 칸으로 이동하려 하면 state를 유지하고,
  UI가 안내할 수 있는 soft feedback과 `nudgeBack` 값을 반환한다.

- [x] `V1-T053` `P0` 미로 게임 UI를 만든다.
  출발점, 도착점, player marker, 진행률, 점수, 리셋, 학습 패널, 완료
  dialog를 제공한다.
  완료: `MazeGame`이 공통 `GameShell` 안에서 grid board, 출발/도착 cell,
  player marker, 수집 아이템, 방향 버튼, pointer/touch cell 이동, 진행률,
  점수, 리셋, 학습 패널, 완료 dialog를 렌더링한다.

- [x] `V1-T054` `P0` 미로 점수 로직을 구현한다.
  완료 300점과 선택 수집 아이템 1개당 50점을 지급한다.
  완료: `MazeGame` 점수는 공통 완료 300점과 수집 아이템별 points 값
  또는 기본 50점을 합산한다.

- [x] `V1-T055` `P0` 완성도 있는 미로 stage 1개를 만든다.
  출발점과 도착점이 명확한 level 1 미로로 시작한다.
  완료: `maze_garden_001` level 1 garden stage와 preview asset을 추가하고,
  시작점, 도착점, optional collectible 2개를 selector/route에 등록했다.

## Milestone 6: 메모리 게임

- [x] `V1-T060` `P0` 메모리 게임 stage schema를 정의한다.
  card pairs, card faces, match mode, words, meanings, optional audio/sentence
  fields를 포함한다.
  완료: `src/games/memoryCards/stages/schema.js`에 card pairs, 두 card face,
  match mode, 영어/한국어 vocabulary, 선택적 audio/sentence fields를
  normalize하는 schema helper를 추가했다.

- [x] `V1-T061` `P0` 메모리 게임 엔진을 만든다.
  카드 뒤집기, 매칭, mismatch delay, 완료, 시도 횟수 기록을 지원한다.
  완료: `src/games/memoryCards/engine.js`가 deterministic deck 생성,
  카드 뒤집기, 매칭, mismatch delay 상태, 완료 판정, attempts 기록을
  제공한다.

- [x] `V1-T062` `P0` 반응형 카드 레이아웃을 만든다.
  4, 6, 8, 12쌍을 아이가 누르기 좋은 크기로 지원한다.
  완료: `MemoryCardsGame`과 CSS card grid가 4, 6, 8, 12쌍 deck을 정사각형
  card layout으로 표시한다.

- [x] `V1-T063` `P0` 메모리 게임 음성 피드백을 구현한다.
  카드를 열거나 짝을 맞출 때 영어 단어를 말한다.
  완료: 카드를 열면 영어 단어와 선택 문장을 말하고, 짝을 맞추거나 완료하면
  영어 match/completion 피드백을 말한다.

- [x] `V1-T064` `P0` 메모리 게임 점수 로직을 구현한다.
  짝 1개당 100점과 공통 completion bonus를 1회 지급한다.
  완료: `MemoryCardsGame` 점수는 pair당 공통 100점과 완료 시 200점
  completion bonus를 반영한다.

- [x] `V1-T065` `P0` 완성도 있는 메모리 stage 1개를 만든다.
  `V1-T003`에서 정한 첫 매칭 방식을 사용한다.
  완료: `memory_animals_001` level 1 animal stage를 이미지-이미지 매칭으로
  추가하고 cat, dog, bird, fish 4쌍과 preview/card assets를 selector/route에
  등록했다.

## Milestone 7: 콘텐츠와 에셋

- [x] `V1-T070` `P0` v1 asset naming convention을 정한다.
  stage JSON, preview image, game image, optional audio의 위치와 이름을
  예측 가능하게 만든다.
  완료: `docs/v1-assets.md`에 stage ID, stage data, preview/game image,
  card/target image, optional audio 위치와 파일명 규칙을 정리했다.

- [x] `V1-T071` `P0` v1 seed 콘텐츠 세트를 제작한다.
  네 가지 게임 타입의 엔진, UX, 점수, 저장 흐름을 검증할 polished
  playable stage를 제공한다.
  완료: `docs/v1-content.md`에 현재 v1 seed stage set을 정리했고,
  Spot the Difference, Hidden Objects, Maze, Memory Cards가 모두 playable
  seed stage를 가진다.

- [x] `V1-T072` `P1` vocabulary QA checklist를 만든다.
  stage마다 영어 단어, 한국어 뜻, 문장, 발음 적합성, 연령 적합성을
  확인한다.
  완료: `docs/v1-vocabulary-qa.md`에 stage metadata, 단어, 발음/audio,
  예문, game type별 vocabulary QA checklist를 추가했다.

- [x] `V1-T073` `P1` visual QA checklist를 만든다.
  이미지 선명도, 목표 가시성, 클릭 영역 여유, 모바일 framing을 확인한다.
  완료: `docs/v1-visual-qa.md`에 이미지 품질, touch/click area, framing,
  game type별 visual QA와 필수 viewport checklist를 추가했다.

- [x] `V1-T074` `P1` 모든 stage에 level metadata를 추가한다.
  v1 난이도 규칙에 따라 Level 1, 2, 3을 표시한다.
  완료: 기존 Spot the Difference content JSON에 theme, level,
  estimatedMinutes를 명시하고 content loader가 metadata를 registry로
  전달하도록 업데이트했다.

- [x] `V1-T075` `P0` v1 출시 콘텐츠 수량을 확정한다.
  게임 타입별 stage 목표 수와 전체 stage 목표 수를 문서에 반영한다.
  완료: v1 출시 콘텐츠 목표를 게임 타입별 20개, 총 80개 playable
  stage로 확정하고 `docs/v1-scope.md`, `docs/v1-content.md`,
  `README.md`, `docs/spec.md`에 반영했다.

- [x] `V1-T076` `P0` 틀린그림 찾기 stage를 20개로 확장한다.
  현재 seed stage 3개를 유지하고, 출시 전 17개 stage를 추가한다.
  완료: 기존 raster Spot stage 3개를 유지하고, deterministic SVG 기반
  stage 17개를 `contents/`에 추가해 Spot the Difference stage를 총 20개로
  확장했다. `contents/*.svg` paired image를 loader와 문서에서 지원하도록
  갱신했다.

- [x] `V1-T077` `P0` 숨은그림 찾기 stage를 20개로 확장한다.
  현재 seed stage 1개를 유지하고, 출시 전 19개 stage를 추가한다.
  완료: 기존 `hidden_picnic_001` stage를 유지하고, generated SVG scene
  asset과 stage definition 19개를 추가해 Hidden Objects를 총 20개 stage로
  확장했다.

- [x] `V1-T078` `P0` 미로 찾기 stage를 20개로 확장한다.
  현재 seed stage 1개를 유지하고, 출시 전 19개 stage를 추가한다.
  완료: 기존 `maze_garden_001` stage를 유지하고, generated grid stage와
  preview SVG asset 19개를 추가해 Maze를 총 20개 stage로 확장했다. 생성된
  maze는 start에서 goal까지 도달 가능하고 collectible도 reachable하다.

- [x] `V1-T079` `P0` 메모리 게임 stage를 20개로 확장한다.
  현재 seed stage 1개를 유지하고, 출시 전 19개 stage를 추가한다.
  완료: 기존 `memory_animals_001` stage를 유지하고, generated card stage와
  preview/card SVG asset을 추가해 Memory Cards를 총 20개 stage로
  확장했다. 새 stage는 4, 6, 8 pair 구성과 이미지-이미지/이미지-단어
  매칭을 포함한다.

## Milestone 8: 접근성, UX, polish

- [x] `V1-T080` `P0` 모든 게임 action에 visible label이 있는지 확인한다.
  내비게이션, 힌트, 리셋, 로그인, 로그아웃 command label을 명확히
  유지한다.
  완료: 공통 game shell의 `Games`, `Hint`, `Reset`, `Log in`, `Log out`과
  completion dialog의 `Next`, `Home`, `Stay` visible label을 확인하고,
  dialog action에 aria-label/title을 보강했다.

- [x] `V1-T081` `P0` 모바일 우선 layout을 검증한다.
  모든 게임 타입에서 320px, 일반 모바일, 태블릿, 데스크톱 viewports를
  확인한다.
  완료: 320px, 390px, 768px 폭에서 selector와 Spot the Difference,
  Hidden Objects, Maze, Memory Cards route를 Playwright screenshot으로
  확인했고, Hidden Objects target list의 모바일 높이와 간격을 조정했다.

- [x] `V1-T082` `P0` touch target size를 검증한다.
  중요한 control과 게임 target이 아이 손가락으로 누르기 충분히 큰지
  확인한다.
  완료: 주요 action button, speech button, maze movement button의 기본
  touch target을 키우고, 게임 target은 이미지/board/card 전체 영역 또는
  방향 버튼으로 조작 가능함을 확인했다.

- [x] `V1-T083` `P1` 작은 축하 feedback을 추가한다.
  정답, 매칭, 수집, stage 완료에 짧은 시각/음성 반응을 제공한다.
  완료: 공통 learning panel의 correct/complete 상태에 짧은 pop 애니메이션을
  추가했고, 기존 음성 피드백과 함께 정답/매칭/수집/완료 반응이 난다.

- [x] `V1-T084` `P1` v1 UI에 countdown timer를 넣지 않는다.
  내부 elapsed time은 나중에 수집할 수 있지만 아이에게 시간 압박을 주지
  않는다.
  완료: 코드 검색으로 countdown/time-pressure UI가 없음을 확인했고,
  README와 spec에 v1 게임 화면에는 countdown timer를 표시하지 않는다고
  명시했다.

- [x] `V1-T085` `P1` 한국어 보조 텍스트를 검토한다.
  보호자에게는 도움이 되되 아이에게는 visual-first 흐름을 유지한다.
  완료: `docs/v1-korean-copy.md`에 v1 stage title, target meaning,
  collectible/card meaning, sentence translation을 리뷰하고 짧은 보조 텍스트
  기준을 정리했다.

## Milestone 9: 검증과 release 준비

- [x] `V1-T090` `P0` 공통 progress와 scoring focused test를 추가한다.
  completion bonus 1회 지급, total points, streak reward 규칙을 확인한다.
  완료: Node test runner를 `npm test`로 추가하고, event point 중복 방지,
  completion bonus 1회 지급, total points, daily streak reward 1일 1회 규칙을
  `src/games/points.test.js`에서 검증한다.

- [x] `V1-T091` `P0` 게임별 core logic focused test를 추가한다.
  가능한 범위에서 hit testing, 숨은그림 판정, 미로 완료, 메모리 매칭을
  확인한다.
  완료: `src/games/coreLogic.test.js`에서 Spot the Difference hit testing,
  Hidden Objects target 판정, Maze blocked/collect/complete, Memory Cards
  mismatch/match core logic을 검증한다.

- [x] `V1-T092` `P0` 수동 게임 QA를 실행한다.
  모든 v1 stage를 모바일 크기와 데스크톱 크기에서 끝까지 플레이한다.
  완료: 모든 현재 v1 stage route를 390x844와 1280x900에서 Playwright
  screenshot으로 확인하고, completion core logic은 `npm test`의 focused
  tests로 통과시켰다. 결과는 `docs/v1-manual-qa.md`에 기록했다.

- [x] `V1-T093` `P0` 제품 문서를 갱신한다.
  `README.md`, `docs/spec.md`, `docs/v1-scope.md`, 이 task 문서를 실제
  shipped behavior와 맞춘다.
  완료: README, spec, v1 scope에 v1 stage set, `pico-progress` 저장,
  Find & Learn legacy progress, 현재 Today 추천 동작, completion action
  label, 검증 명령을 실제 구현에 맞게 갱신했다.

- [x] `V1-T094` `P0` release validation을 통과한다.
  v1 release commit 전 `npm run lint`와 `npm run build`를 실행한다.
  완료: 최종 release validation으로 `npm test`, `npm run lint`,
  `npm run build`를 실행해 모두 통과했다.

## Milestone 10: 화면 UI/UX 검수 피드백

검수 기준: 2026-05-30에 로컬 `http://localhost:5175`에서 홈, 현재 seed
stage 6개, 메모리 완료 dialog를 `320x740`, `390x844`, `1280x900`
viewport로 캡처해 확인했다. 임시 screenshot은 `/tmp/pico-ui-review`에만
두고 커밋하지 않는다.

- [x] `V1-T100` `P0` 현재 화면 UI/UX 피드백을 수집한다.
  홈, Spot the Difference, Hidden Objects, Maze, Memory Cards, 완료 dialog를
  모바일과 데스크톱에서 검수하고 개선 task로 분해한다.
  완료: 화면 캡처와 DOM layout metric을 함께 확인해 아래 task들을
  등록했다.

- [x] `V1-T101` `P0` 모바일 게임 HUD 높이를 줄인다.
  390px 화면에서 topbar가 약 297px로 게임 화면의 큰 부분을 차지한다.
  stage badge, score, progress, action을 2단 이하로 정리해 play area를
  우선한다.
  완료: 780px 이하 game topbar를 stage/progress row와 action row의 2단
  구조로 재배치하고, 모바일 chrome budget을 줄였다. 390px 검수에서
  topbar 높이는 약 297px에서 약 140px로 감소했다.

- [x] `V1-T102` `P0` 데스크톱 게임 topbar의 빈 공간을 줄인다.
  1280px 화면에서 topbar가 약 174px로 크고 action row가 별도 줄을
  차지한다. 데스크톱에서는 stage 정보, 진행률, action을 한 줄 또는 낮은
  밀도의 두 줄로 재배치한다.
  완료: 980px 초과 화면에서 stage 정보, progress/score/status, action을
  한 줄 grid로 배치했다. 1280px 검수에서 topbar 높이는 약 174px에서
  약 78px로 감소했다.

- [x] `V1-T103` `P0` 모든 주요 touch target을 44px 이상으로 맞춘다.
  `Log in`, `Games`, `Hint`, `Reset`, `Speak`가 38-40px 높이로 측정된다.
  아이 손가락 기준으로 최소 44px, 가능하면 48px 이상을 목표로 한다.
  완료: 공통 auth/action/icon/completion button의 최소 높이를 44px로 맞추고,
  모바일 override가 speech button을 38px로 줄이지 않게 수정했다. 390px
  주요 게임 route 측정에서 모든 button이 44px 이상임을 확인했다.

- [x] `V1-T104` `P0` `Local play` 상태 표시를 게임 HUD에서 덜 지배적으로
  만든다.
  현재 pink chip이 점수/진행과 같은 무게로 보인다. 저장 상태는 계정 영역
  또는 작고 조용한 상태 text로 이동하고, 아이가 볼 핵심 정보는 score와
  progress로 유지한다.
  완료: `save-text` HUD 상태를 border/background 없는 muted text로 낮춰
  score/progress chip보다 시각적 무게를 줄였다. 390px/1280px 측정에서
  `Local play`가 투명 배경과 muted color로 표시됨을 확인했다.

- [x] `V1-T105` `P0` game type별 stage badge icon과 색을 다르게 만든다.
  모든 게임이 같은 sparkles icon을 써서 Spot, Hidden, Maze, Memory의
  차이가 즉시 보이지 않는다. 각 게임 타입의 상징 icon과 accent color를
  정의한다.
  완료: 공통 `GameShell` stage badge에 game type variant를 추가해 Spot,
  Hidden, Maze, Memory가 각각 다른 lucide icon과 accent color를 사용한다.
  네 게임 route screenshot으로 badge 구분을 확인했다.

- [ ] `V1-T106` `P0` navigation/action button label을 더 명확하게 바꾼다.
  `Games`, `Home`, `Stay`는 어린아이와 보호자 모두에게 애매할 수 있다.
  `Game List`, `Keep Playing`, `Start Over`처럼 행동 결과가 분명한 label을
  검토한다.

- [ ] `V1-T107` `P0` `Reset`의 실수 클릭 위험을 낮춘다.
  현재 `Hint`와 같은 무게로 붙어 있어 실수로 진행을 날릴 수 있다.
  Reset은 보조 style, 길게 누르기, confirm, 또는 overflow action으로
  분리한다.

- [ ] `V1-T108` `P1` 게임 화면의 `Log in` CTA를 더 작게 정리한다.
  로그아웃 상태에서 `Log in`이 full-width action으로 play area를 줄인다.
  저장 유도는 필요하지만 게임 중 핵심 action보다 약하게 보이게 한다.

- [ ] `V1-T109` `P1` progress meter를 더 읽기 쉽게 만든다.
  0% 상태에서는 얇은 빈 선처럼 보여 의미가 약하다. 두께, 시작 marker,
  label, 완료 animation을 조정하고 게임 타입별 progress 의미를 맞춘다.

- [ ] `V1-T110` `P1` 완료 dialog를 더 축하스럽고 게임답게 만든다.
  현재 `Success`, 점수, `Home`/`Stay`만 보여 다소 건조하다. 별, confetti,
  score breakdown, streak reward, 다음 행동 hierarchy를 추가한다.

- [ ] `V1-T111` `P1` 완료 dialog button hierarchy를 재검토한다.
  다음 stage가 없을 때 `Home`과 `Stay`만 있어 흐름이 약하다. `Game List`,
  `Play Again`, `Keep Playing` 중 어떤 행동이 주 행동인지 정한다.

- [ ] `V1-T112` `P1` motion과 animation의 reduce-motion 대응을 추가한다.
  hint pulse, marker pulse, completion feedback은 `prefers-reduced-motion`에서
  줄이거나 정지한다.

- [ ] `V1-T113` `P1` 색만으로 상태를 구분하지 않게 보강한다.
  found, hinted, wrong, complete 상태가 색에 많이 의존한다. icon, pattern,
  shape, label 변화를 함께 사용한다.

- [ ] `V1-T120` `P0` 320px 홈 카드의 한국어 줄바꿈을 고친다.
  `아이 방`, `소풍 놀이터`, `동물 카드`가 글자 단위로 끊겨 보인다.
  한국어 title을 별도 줄이나 pill로 분리하고 `word-break`/width를 조정한다.

- [ ] `V1-T121` `P0` 홈 카드 정보 hierarchy를 정리한다.
  제목, game type, 한국어 title, level, theme가 한 카드 안에서 경쟁한다.
  title, game type, metadata의 시각 순서를 고정하고 사소한 metadata는 더
  작은 badge로 낮춘다.

- [ ] `V1-T122` `P0` 80개 stage를 위한 game type filter를 추가한다.
  v1 목표가 총 80개이므로 단순 세로 list는 탐색 비용이 커진다. Spot,
  Hidden, Maze, Memory tab 또는 segmented control을 제공한다.

- [ ] `V1-T123` `P0` stage가 많아질 때 level/theme 탐색을 지원한다.
  Level, theme, 완료 여부로 정렬하거나 필터링할 수 있어야 한다.

- [ ] `V1-T124` `P0` 홈 카드에 완료/미완료 상태를 표시한다.
  로그인 사용자는 어떤 stage를 끝냈는지, 이어서 할 stage가 무엇인지
  카드에서 바로 알 수 있어야 한다.

- [ ] `V1-T125` `P1` `Today` CTA의 의미를 더 명확히 한다.
  현재 `TODAY Animal Match`만 보여 왜 추천되는지, 시작 버튼인지 약하다.
  `Play Today`, 추천 이유, 완료 여부를 짧게 표현한다.

- [ ] `V1-T126` `P1` 홈 카드 preview asset의 일관성을 높인다.
  Memory preview는 실제 카드 게임 느낌이 약하고, 일부 stage preview는
  밀도가 다르다. game type별 thumbnail framing과 visual style 기준을
  만든다.

- [ ] `V1-T127` `P1` 320px 홈 카드 높이를 줄인다.
  좁은 화면에서 첫 카드가 약 190px까지 커지고 badge가 세로로 쌓인다.
  thumbnail, title, badge 배치를 더 compact하게 조정한다.

- [ ] `V1-T128` `P1` 데스크톱 홈 화면의 stage list 밀도를 개선한다.
  1280px에서도 한 줄 list만 사용해 화면 아래로 길어진다. 80개 stage 전에는
  2-column grid, grouped section, 또는 paged list를 검토한다.

- [ ] `V1-T129` `P1` 홈에서 game type별 visual identity를 강화한다.
  카드의 색, icon, badge가 game type을 즉시 말해주도록 Spot/Hidden/Maze/
  Memory별 accent를 적용한다.

- [ ] `V1-T130` `P1` 로그아웃 홈에서 저장 가치 설명을 작고 명확하게 만든다.
  로그인하지 않아도 플레이 가능하지만, point/streak 저장은 로그인 후
  가능하다는 차이를 부담 없이 알린다.

- [ ] `V1-T140` `P0` Spot 모바일 play area의 빈 세로 여백을 줄인다.
  이미지 위아래 여백이 커서 실제 비교 그림이 작게 보인다. 두 그림은
  좌우 유지하되 available height를 더 적극적으로 사용한다.

- [ ] `V1-T141` `P0` Spot 데스크톱 그림 크기와 gutter를 재조정한다.
  1280px 화면에서 stage panel 양쪽 빈 공간이 크다. 이미지 최대 폭을 키우거나
  panel width를 줄여 비교 대상이 더 크게 보이게 한다.

- [ ] `V1-T142` `P0` Spot의 클릭 가능한 그림과 참고 그림 affordance를
  구분한다.
  `original/changed` label은 쓰지 않더라도, 클릭 가능한 쪽은 subtle focus
  frame이나 cursor feedback으로 더 명확해야 한다.

- [ ] `V1-T143` `P1` Spot에 확대/집중 보기 affordance를 추가한다.
  모바일 좌우 비교는 차이가 작아질 수 있다. 긴 누름 zoom, tap-to-inspect,
  또는 일시 확대 모드를 검토한다.

- [ ] `V1-T144` `P1` Spot correct/hint marker 크기를 target별로 조정한다.
  marker가 작은 차이를 덮거나 큰 차이에 비해 작아 보일 수 있다. bbox/area
  크기를 반영한 marker scale을 검토한다.

- [ ] `V1-T145` `P1` Spot 기본 learning panel 내용을 더 목적 있게 만든다.
  현재 단어 list가 길게 나열된다. 첫 진입 시 stage 목표, 최근 찾은 단어,
  또는 짧은 vocabulary chips 중심으로 정리한다.

- [ ] `V1-T146` `P1` Spot wrong feedback을 더 부드럽고 유용하게 만든다.
  단순 `Wrong`보다 아이에게 부담이 적은 copy와 시각 feedback을 사용하고,
  반복 오답 시 hint로 자연스럽게 이어지게 한다.

- [ ] `V1-T150` `P0` Hidden target pill의 text clipping을 해결한다.
  320/390px에서 target pill 내부 text line-height가 scroll height보다 작게
  측정된다. pill 높이, line-height, font size를 안정화한다.

- [ ] `V1-T151` `P0` Hidden target list의 8개 target 확장 상태를 설계한다.
  v1 조건은 3-8개 target인데 모바일 현재 list는 6개 기준이다. 8개에서도
  scroll affordance, 완료 표시, hint 강조가 선명해야 한다.

- [ ] `V1-T152` `P1` Hidden scene image crop 정책을 검토한다.
  `object-fit: cover`는 장면 가장자리 target을 잘라낼 수 있다. target이
  edge에 있을 때 contain/framing/padding 기준을 정한다.

- [ ] `V1-T153` `P1` Hidden marker visibility를 높인다.
  밝고 복잡한 scene에서 found/hint marker가 묻힐 수 있다. marker contrast,
  halo, pulse, label 없는 상태 표시를 개선한다.

- [ ] `V1-T154` `P1` Hidden target pill의 found/hint 상태를 더 명확히 한다.
  색 변화만으로는 찾은 것과 힌트 대상이 약할 수 있다. check icon, target
  icon, outline pattern을 함께 쓴다.

- [ ] `V1-T155` `P1` Hidden 오답 feedback 위치를 scene 근처로 보강한다.
  현재 message panel만 바뀌면 클릭 지점과 feedback의 연결이 약하다. scene
  안 wrong marker나 작은 shake를 추가한다.

- [ ] `V1-T160` `P0` Maze progress 표시를 goal 중심으로 바꾼다.
  `1/32`는 모든 칸을 방문해야 하는 것처럼 보인다. `Goal`, `2 gems`, 또는
  path progress처럼 미로 규칙과 맞는 지표를 사용한다.

- [ ] `V1-T161` `P0` Maze 모바일 D-pad 배치를 고친다.
  up button이 board 경계에 붙어 떠 있고, control 묶음이 분리돼 보인다.
  네 방향 버튼을 하나의 안정적인 D-pad로 묶어 board 아래에 배치한다.

- [ ] `V1-T162` `P0` Maze 데스크톱 board와 control의 거리감을 줄인다.
  데스크톱에서 board는 왼쪽, controls는 오른쪽 빈 공간에 떨어져 있다.
  controls를 board 가까이에 붙이거나 board 하단으로 통일한다.

- [ ] `V1-T163` `P0` Maze player를 아이 친화적인 캐릭터로 바꾼다.
  현재 red dot은 출발 캐릭터인지 선택 marker인지 약하다. 작은 캐릭터,
  얼굴, 발자국 등으로 이동 주체를 분명히 한다.

- [ ] `V1-T164` `P1` Maze start/goal/collectible affordance를 키운다.
  flag와 gem icon이 작아 목표와 보너스가 눈에 잘 띄지 않는다. icon 크기,
  contrast, cell background를 조정한다.

- [ ] `V1-T165` `P1` Maze wall/path contrast와 visited path 표현을 조정한다.
  길, 벽, 방문 칸, 목표 칸이 한눈에 규칙으로 읽히게 색과 pattern을
  정리한다.

- [ ] `V1-T166` `P1` Maze touch gesture 안내를 개선한다.
  board tap, direction button, drag/swipe 중 어떤 입력이 가능한지 시각적으로
  알기 어렵다. visible control affordance와 feedback을 강화한다.

- [ ] `V1-T170` `P0` Memory 모바일 card grid를 균형 있게 만든다.
  390px에서 8장이 5+3 배열로 보여 카드 게임판답지 않다. 4쌍 stage는
  4x2 또는 2x4처럼 안정적인 grid를 사용한다.

- [ ] `V1-T171` `P0` Memory card 크기를 play area에 맞춰 키운다.
  모바일과 데스크톱 모두 카드가 stage panel에 비해 작고 빈 공간이 많다.
  pair 수별 최대 카드 크기와 grid width를 재정의한다.

- [ ] `V1-T172` `P1` Memory card back을 더 게임답게 디자인한다.
  현재 파란 카드와 노란 점은 장난감 카드 느낌이 약하다. Pico 문양,
  별/스티커, game type accent를 넣은 card back asset을 만든다.

- [ ] `V1-T173` `P1` Memory match feedback을 더 명확히 만든다.
  matched state가 색 변화 중심이다. 카드 bounce, sparkle, pair label, 짧은
  score pop을 추가한다.

- [ ] `V1-T174` `P1` Memory hint 동작을 재설계한다.
  현재 hint는 match mode와 모든 단어를 message panel에 나열한다. 실제 게임
  도움으로 느껴지게 잠깐 카드 한 장 강조, 남은 pair count, 쉬운 pair 추천
  등을 검토한다.

- [ ] `V1-T175` `P1` Memory attempts 표시 위치를 정한다.
  로그인 상태에서는 `tries`가 저장 상태 chip을 대체하고, 로그아웃에서는
  보이지 않는다. tries는 게임 정보로 별도 표시한다.

- [ ] `V1-T176` `P1` Memory 완료 화면에 matched card 결과를 보여준다.
  완료 dialog 뒤에 카드가 흐릿하게 보이지만, 성공 결과 자체는 text뿐이다.
  맞춘 동물/단어 summary나 sticker reward를 보여준다.

- [ ] `V1-T180` `P0` 화면 검수 체크리스트를 QA 문서에 고정한다.
  viewport, route, touch target, text clipping, overflow, completion dialog,
  game type별 핵심 interaction을 반복 검수할 수 있게 문서화한다.

- [ ] `V1-T181` `P1` layout smoke check를 자동화한다.
  최소 viewport에서 horizontal overflow, clipped text, 44px 미만 touch target,
  play area 비율을 감지하는 Playwright 기반 smoke check를 검토한다.

- [ ] `V1-T182` `P1` 80개 stage 기준 selector 성능과 스크롤 UX를 검증한다.
  카드 수가 늘었을 때 첫 화면 로딩, 스크롤 길이, keyboard navigation,
  focus order가 유지되는지 확인한다.

- [ ] `V1-T183` `P1` mobile browser chrome 변동을 다시 확인한다.
  `100dvh` 기반 game shell이 iOS/Android 주소창 변화에서 panel을 자르지
  않는지 실제 기기 또는 emulation으로 검수한다.

- [ ] `V1-T184` `P2` 게임 화면 내 copy 언어 정책을 정리한다.
  stage title은 한국어, subtitle/button은 영어가 섞여 있다. 아이용 게임으로
  어떤 label은 영어 학습용이고 어떤 label은 조작용인지 기준을 만든다.

- [ ] `V1-T185` `P2` game UI sound/visual feedback 강도 기준을 정한다.
  정답, 오답, hint, 완료, streak reward가 과하거나 약하지 않게 feedback
  timing과 반복 빈도를 정의한다.

## 권장 구현 순서

1. `V1-T001`부터 `V1-T004`까지 제품 결정을 먼저 끝낸다.
2. `V1-T010`부터 `V1-T014`까지 공통 registry와 shell을 만든다.
3. `V1-T020`부터 `V1-T027`까지 progress, points, streak를 구현한다.
4. `V1-T031`부터 `V1-T034`까지 기존 틀린그림 찾기를 v1 구조에 맞춘다.
5. 숨은그림 찾기, 메모리 게임, 미로 찾기 순서로 신규 게임을 만든다.
6. 콘텐츠와 에셋 task를 채워 각 게임 타입을 20개 stage로 확장한다.
7. 접근성, 수동 QA, release validation을 마무리한다.
8. `V1-T100` 이후 화면 검수 feedback을 우선순위대로 처리한다.

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
