# Pico V1 Feedback Policy

This document defines the v1 intensity rules for game feedback. Pico should
feel playful and responsive without becoming noisy, stressful, or tiring for a
child replaying stages.

## Principles

- Feedback confirms an action; it should not interrupt play.
- Correct feedback is warmer and stronger than wrong feedback.
- Wrong feedback is gentle and short. It should guide another try, not punish.
- Hint feedback should be visible enough to help but should not auto-solve the
  game unless the game explicitly defines that behavior.
- Completion feedback is the strongest moment, but it still avoids long motion
  or sound loops.

## Timing

| Feedback | Visual Timing | Speech Timing | Repeat Rule |
| --- | --- | --- | --- |
| Correct target/object/card | `300-700ms` pop, marker, or badge emphasis | One short phrase or target word | Once per successful action |
| Wrong click/path/mismatch | `300-800ms` small marker, nudge, or soft panel state | One short `Try again` style phrase | No repeated sound while the state is still visible |
| Hint | `900-1500ms` highlight or pulse | Optional; prefer message panel over speech | One highlighted target/card per press |
| Collectible | `300-700ms` marker or message pop | Collectible word only when useful | Once per collectible |
| Stage complete | Static celebration plus short pop/confetti accent | One completion phrase | Once when completion opens |
| Streak/reward | Small chip or summary update | No required speech in v1 | Once per daily reward |

## Motion Limits

- Repeating pulse should be reserved for hint affordances only.
- Avoid more than one simultaneous motion source in the same play area.
- Completion decoration can be static after the first entrance animation.
- `prefers-reduced-motion: reduce` must stop repeated pulse, nudge, sparkle,
  and pop animations while preserving static emphasis.

## Audio Limits

- Prefer Web Speech API phrases under three seconds.
- Do not stack speech. New speech should cancel the previous utterance.
- Use target words, `Correct`, `Try again`, `Match`, and `Complete` style
  phrases. Avoid long bilingual narration during play.
- Wrong feedback should not repeat aggressively on rapid taps.

## Game-Type Notes

- Spot: correct/hint markers should stay visible; wrong feedback stays softer
  than correct feedback.
- Hidden: found/hint/wrong scene markers should be short and local to the
  clicked target or hint target.
- Maze: blocked movement can nudge the player marker, but the board should not
  shake as a whole.
- Memory: match feedback can use sparkle/pop and `Match +100`; hint feedback
  highlights one useful card briefly.

## QA Questions

- Can the child keep playing immediately after feedback?
- Does the feedback explain state without adding long instructions?
- Is there a static state difference after motion stops?
- Does reduced-motion mode keep the same information without animation?
- Would repeated misses or repeated hints become noisy?
