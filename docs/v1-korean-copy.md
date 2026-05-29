# Pico V1 Korean Copy Review

이 문서는 v1 한국어 보조 텍스트를 visual-first 게임 흐름에 맞게 유지하기
위한 기준과 현재 리뷰 결과를 기록한다.

## Copy Principles

- 한국어는 아이의 이해를 돕는 보조 정보로 둔다.
- 게임 진행을 설명하는 긴 문장보다 짧은 뜻과 자연스러운 번역을 우선한다.
- 보호자가 봐도 의미가 분명하되, 아이 화면을 텍스트로 채우지 않는다.
- Stage title은 짧은 명사형을 우선한다.

## Current Review

| Area | Examples | Result |
| --- | --- | --- |
| Stage titles | `아이 방`, `소풍 숨은그림`, `정원 미로`, `동물 카드` | Short and clear |
| Hidden Objects meanings | `사과`, `연`, `책`, `숟가락`, `오리`, `공` | Age-appropriate |
| Maze collectible meanings | `별`, `보석` | Short and visual |
| Memory meanings | `고양이`, `강아지`, `새`, `물고기` | Child-friendly |
| Sentence translations | `사과를 찾았어요.`, `새가 날 수 있어요.` | Natural and short |

## Follow-Up Rule

When adding a stage, review Korean copy with `docs/v1-vocabulary-qa.md`.
Prefer short nouns for meanings and one short sentence for translations.

## Game Screen Language Policy

Pico v1 intentionally mixes Korean support copy with English learning/game
labels. Keep the distinction stable:

| Surface | Language | Rule |
| --- | --- | --- |
| Stage title in the main badge | Korean first | Use `titleKo` when available so the child knows the scene context quickly. |
| Stage subtitle | English | Use the English title to reinforce the learning context without making it the main command. |
| Target words, card words, collectible words | English | These are the learning objects and should remain in English. |
| Meanings and translations | Korean | Keep them short and supportive, not explanatory paragraphs. |
| Primary controls | English | Use stable, short commands such as `Game List`, `Hint`, `Reset`, `Start`, `Speak`. Pair them with icons. |
| Status and score | English abbreviations | Use `pts`, `tries`, `Local play`, `Ready`, `Done`, `Open` consistently. |
| Feedback titles | Short English | Use `Correct`, `Try again`, `Complete`, or the target word. |
| Feedback body | English plus optional Korean meaning | Prefer the learned word, short English sentence, and Korean meaning/translation only when it helps. |
| Completion actions | English | Keep `Next Stage`, `Play Again`, `Game List`, `Keep Playing` consistent across game types. |

Do not add long bilingual explanations to the game surface. If an interaction
needs explanation, prefer a clearer icon, marker, badge, or layout affordance
before adding copy.
