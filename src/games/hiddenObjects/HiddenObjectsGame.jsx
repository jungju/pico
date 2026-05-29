import { useMemo, useState } from "react";
import { CheckCircle2, LocateFixed } from "lucide-react";
import { GameShell } from "../GameShell";
import { POINT_EVENTS, POINT_VALUES } from "../points";
import { findHiddenTargetAt, getHiddenTargetMarker, getRelativePoint } from "./hitTesting";

export function HiddenObjectsGame({ authState, authControl, stage, stageEntry, onBack, onNext, onPointEvent, onStageComplete }) {
  const completionBonus = stageEntry?.points?.completionBonus ?? stage.points?.completionBonus ?? POINT_VALUES.STAGE_COMPLETION_BONUS;
  const [foundIds, setFoundIds] = useState(() => new Set());
  const [message, setMessage] = useState(() => createReadyMessage(stage));
  const [hintId, setHintId] = useState(null);
  const [completionNoticeOpen, setCompletionNoticeOpen] = useState(false);
  const foundTargets = useMemo(() => stage.targets.filter((target) => foundIds.has(target.id)), [foundIds, stage.targets]);
  const remainingTarget = stage.targets.find((target) => !foundIds.has(target.id));
  const hintTarget = stage.targets.find((target) => target.id === hintId);
  const completed = foundIds.size === stage.targets.length;
  const progressPercent = stage.targets.length > 0 ? Math.round((foundIds.size / stage.targets.length) * 100) : 0;
  const score = calculateScore(foundIds, stage.targets.length, completionBonus);
  const statusText = authState?.status === "authenticated" ? "Ready" : "Local play";
  const sceneStyle = {
    "--hidden-scene-aspect": `${stage.scene.width} / ${stage.scene.height}`,
  };

  function handleSceneClick(event) {
    const point = getRelativePoint(event, event.currentTarget);
    const target = findHiddenTargetAt(point, stage, foundIds);

    if (target) {
      foundTarget(target);
      return;
    }

    setMessage({
      type: "wrong",
      title: "Try again",
      body: "Look around the picture.",
    });
    speak("Try again.");
  }

  function foundTarget(target) {
    const nextFoundIds = new Set(foundIds);
    nextFoundIds.add(target.id);
    const nextCompleted = nextFoundIds.size === stage.targets.length;
    const nextScore = calculateScore(nextFoundIds, stage.targets.length, completionBonus);

    setFoundIds(nextFoundIds);
    setHintId(null);
    setMessage({
      type: nextCompleted ? "complete" : "correct",
      title: nextCompleted ? "Complete" : target.word,
      body: nextCompleted ? completeMessageBody(stage, nextScore) : targetMessage(target),
    });
    onPointEvent?.({ event: POINT_EVENTS.HIDDEN_OBJECT_FOUND, itemId: target.id });

    if (nextCompleted) {
      onStageComplete?.();
      setCompletionNoticeOpen(true);
    }

    speak(nextCompleted ? `Complete. ${stage.title}. ${nextScore} points.` : `${target.word}. ${target.sentence || "Good find."}`);
  }

  function showHint() {
    if (!remainingTarget) return;
    setHintId(remainingTarget.id);
    setMessage({
      type: "word",
      title: remainingTarget.word,
      body: remainingTarget.hint || `Find ${remainingTarget.word}.`,
    });
  }

  function resetGame() {
    setFoundIds(new Set());
    setHintId(null);
    setCompletionNoticeOpen(false);
    setMessage(createReadyMessage(stage));
  }

  return (
    <GameShell
      authControl={authControl}
      completed={completed}
      completionNotice={{
        hasNext: Boolean(onNext),
        open: completed && completionNoticeOpen,
        score,
        stageTitle: stage.titleKo || stage.title,
        onBack,
        onClose: () => setCompletionNoticeOpen(false),
        onNext,
      }}
      message={message}
      gameType={stageEntry?.gameType}
      onBack={onBack}
      onHint={showHint}
      onReset={resetGame}
      onSpeak={() => speak(message.body)}
      progressPercent={progressPercent}
      progressText={`${foundIds.size}/${stage.targets.length}`}
      score={score}
      stageSubtitle={stage.title}
      stageTitle={stage.titleKo || stage.title}
      statusText={statusText}
    >
      <section className="hidden-objects-stage" style={sceneStyle} aria-label={stage.title}>
        <button className="hidden-scene" type="button" onClick={handleSceneClick} aria-label="Hidden objects scene">
          <img src={stage.scene.image} alt={stage.scene.alt} draggable="false" />
          {foundTargets.map((target) => (
            <HiddenTargetMarker className="found-target-marker" key={target.id} target={target} />
          ))}
          {hintTarget ? <HiddenTargetMarker className="hint-marker" target={hintTarget} /> : null}
        </button>

        <div
          className={`hidden-target-list${stage.targets.length > 6 ? " many-targets" : ""}`}
          aria-label="Targets"
          data-target-count={stage.targets.length}
        >
          {stage.targets.map((target) => {
            const found = foundIds.has(target.id);
            const hinted = target.id === hintId;
            return (
              <span className={`hidden-target-pill${found ? " found" : ""}${hinted ? " hinted" : ""}`} key={target.id}>
                <span className="hidden-target-text">
                  <strong>{target.word}</strong>
                  <span className="hidden-target-meaning">{target.meaning}</span>
                </span>
                {found || hinted ? (
                  <span className="hidden-target-state" title={found ? "Found target" : "Hint target"}>
                    {found ? <CheckCircle2 aria-hidden="true" size={16} strokeWidth={3} /> : <LocateFixed aria-hidden="true" size={16} strokeWidth={3} />}
                    <span>{found ? "Found" : "Hint"}</span>
                  </span>
                ) : null}
              </span>
            );
          })}
        </div>
      </section>
    </GameShell>
  );
}

function HiddenTargetMarker({ className, target }) {
  const point = getHiddenTargetMarker(target);
  return point ? <span className={`picture-marker ${className}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} /> : null;
}

function createReadyMessage(stage) {
  return {
    type: "ready",
    title: stage.titleKo || stage.title,
    body: stage.targets.map((target) => target.word).join(" · "),
  };
}

function targetMessage(target) {
  return [target.meaning, target.sentence, target.translation].filter(Boolean).join(" · ");
}

function completeMessageBody(stage, score) {
  return `${stage.titleKo || stage.title} complete · ${score} pts`;
}

function calculateScore(foundIds, totalTargets, completionBonus = POINT_VALUES.STAGE_COMPLETION_BONUS) {
  const targetPoints = foundIds.size * POINT_VALUES.HIDDEN_OBJECT_FOUND;
  const hasCompletedStage = totalTargets > 0 && foundIds.size === totalTargets;
  return targetPoints + (hasCompletedStage ? completionBonus : 0);
}

function speak(text) {
  if (!text || typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}
