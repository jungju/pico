import { useEffect, useRef, useState } from "react";
import { GameShell } from "../GameShell";
import { POINT_EVENTS, POINT_VALUES } from "../points";
import { closeMismatchedMemoryCards, createMemoryRunState, flipMemoryCard, isMemoryCardFaceUp } from "./engine";

const MISMATCH_DELAY_MS = 760;

export function MemoryCardsGame({ authState, authControl, stage, stageEntry, onBack, onNext, onPointEvent, onStageComplete }) {
  const completionBonus = stageEntry?.points?.completionBonus ?? stage.points?.completionBonus ?? POINT_VALUES.STAGE_COMPLETION_BONUS;
  const [runState, setRunState] = useState(() => createMemoryRunState(stage));
  const [message, setMessage] = useState(() => createReadyMessage(stage));
  const [completionNoticeOpen, setCompletionNoticeOpen] = useState(false);
  const mismatchTimerRef = useRef(null);
  const completed = runState.completed;
  const score = calculateScore(runState, stage.pairs.length, completionBonus);
  const progressPercent = stage.pairs.length > 0 ? Math.round((runState.matchedPairIds.length / stage.pairs.length) * 100) : 0;
  const statusText = authState?.status === "authenticated" ? `${runState.attempts} tries` : "Local play";
  const gridStyle = {
    "--memory-columns": memoryColumnCount(runState.deck.length),
  };

  useEffect(() => {
    return () => window.clearTimeout(mismatchTimerRef.current);
  }, []);

  function handleCardClick(cardId) {
    const result = flipMemoryCard(stage, runState, cardId);
    if (!result.changed) return;

    setRunState(result.state);

    if (result.reason === "opened") {
      setMessage(cardMessage(result.flippedCard));
      speak(cardSpeech(result.flippedCard));
      return;
    }

    if (result.matchedPair) {
      setMessage(matchMessage(result.matchedPair, result.state.completed));
      speak(matchSpeech(result.matchedPair, result.state.completed));
      onPointEvent?.({ event: POINT_EVENTS.MEMORY_PAIR_MATCHED, itemId: result.matchedPair.id });
      if (result.state.completed) {
        onStageComplete?.();
        setCompletionNoticeOpen(true);
      }
    } else {
      setMessage({
        type: "wrong",
        title: "Try again",
        body: "Look for the matching card.",
      });
      speak("Try again.");
    }

    if (result.needsMismatchDelay) {
      window.clearTimeout(mismatchTimerRef.current);
      mismatchTimerRef.current = window.setTimeout(() => {
        setRunState((currentState) => closeMismatchedMemoryCards(currentState));
      }, MISMATCH_DELAY_MS);
    }
  }

  function resetGame() {
    window.clearTimeout(mismatchTimerRef.current);
    setRunState(createMemoryRunState(stage));
    setMessage(createReadyMessage(stage));
    setCompletionNoticeOpen(false);
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
      onHint={() => setMessage(createHintMessage(stage))}
      onReset={resetGame}
      onSpeak={() => speak(message.body)}
      progressPercent={progressPercent}
      progressText={`${runState.matchedPairIds.length}/${stage.pairs.length}`}
      score={score}
      stageSubtitle={stage.title}
      stageTitle={stage.titleKo || stage.title}
      statusText={statusText}
    >
      <section className="memory-stage" aria-label={stage.title}>
        <div className="memory-card-grid" style={gridStyle}>
          {runState.deck.map((card) => (
            <MemoryCard
              card={card}
              faceUp={isMemoryCardFaceUp(runState, card)}
              key={card.id}
              matched={runState.matchedPairIds.includes(card.pairId)}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </section>
    </GameShell>
  );
}

function MemoryCard({ card, faceUp, matched, onClick }) {
  return (
    <button
      className={`memory-card${faceUp ? " face-up" : ""}${matched ? " matched" : ""}`}
      type="button"
      disabled={matched}
      onClick={() => onClick(card.id)}
      aria-label={faceUp ? card.word : "Memory card"}
    >
      <span className="memory-card-back" aria-hidden={faceUp ? "true" : "false"} />
      <span className="memory-card-front" aria-hidden={faceUp ? "false" : "true"}>
        <CardFace card={card} />
      </span>
    </button>
  );
}

function CardFace({ card }) {
  if (card.face.image) {
    return <img src={card.face.image} alt={card.face.alt || card.word} draggable="false" />;
  }

  if (card.face.emoji) {
    return <span className="memory-card-emoji">{card.face.emoji}</span>;
  }

  return (
    <span className="memory-card-word">
      <strong>{card.face.label || card.word}</strong>
      <small>{card.meaning}</small>
    </span>
  );
}

function createReadyMessage(stage) {
  return {
    type: "ready",
    title: stage.titleKo || stage.title,
    body: `${stage.pairs.length} pairs`,
  };
}

function createHintMessage(stage) {
  return {
    type: "word",
    title: "Hint",
    body: `${stage.matchMode.replace("_", " ")} · ${stage.pairs.map((pair) => pair.word).join(" · ")}`,
  };
}

function cardMessage(card) {
  return {
    type: "word",
    title: card.word,
    body: [card.meaning, card.sentence, card.translation].filter(Boolean).join(" · "),
  };
}

function matchMessage(pair, completed) {
  return {
    type: completed ? "complete" : "correct",
    title: completed ? "Complete" : pair.word,
    body: completed ? "All pairs matched." : `${pair.meaning} · Match`,
  };
}

function cardSpeech(card) {
  return `${card.word}. ${card.sentence || ""}`.trim();
}

function matchSpeech(pair, completed) {
  return completed ? `Complete. ${pair.word}.` : `Match. ${pair.word}.`;
}

function calculateScore(runState, totalPairs, completionBonus = POINT_VALUES.STAGE_COMPLETION_BONUS) {
  const pairPoints = runState.matchedPairIds.length * POINT_VALUES.MEMORY_PAIR_MATCHED;
  return pairPoints + (totalPairs > 0 && runState.completed ? completionBonus : 0);
}

function memoryColumnCount(cardCount) {
  if (cardCount <= 8) return 4;
  if (cardCount <= 16) return 4;
  return 6;
}

function speak(text) {
  if (!text || typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}
