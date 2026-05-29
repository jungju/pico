import { useEffect, useRef, useState } from "react";
import { GameShell } from "../GameShell";
import { POINT_EVENTS, POINT_VALUES } from "../points";
import { closeMismatchedMemoryCards, createMemoryRunState, flipMemoryCard, isMemoryCardFaceUp } from "./engine";

const MISMATCH_DELAY_MS = 760;

export function MemoryCardsGame({ authState, authControl, stage, stageEntry, onBack, onNext, onPointEvent, onStageComplete }) {
  const completionBonus = stageEntry?.points?.completionBonus ?? stage.points?.completionBonus ?? POINT_VALUES.STAGE_COMPLETION_BONUS;
  const [runState, setRunState] = useState(() => createMemoryRunState(stage));
  const [message, setMessage] = useState(() => createReadyMessage(stage));
  const [hintCardIds, setHintCardIds] = useState(() => new Set());
  const [completionNoticeOpen, setCompletionNoticeOpen] = useState(false);
  const mismatchTimerRef = useRef(null);
  const hintTimerRef = useRef(null);
  const completed = runState.completed;
  const score = calculateScore(runState, stage.pairs.length, completionBonus);
  const progressPercent = stage.pairs.length > 0 ? Math.round((runState.matchedPairIds.length / stage.pairs.length) * 100) : 0;
  const statusText = authState?.status === "authenticated" ? `${runState.attempts} tries` : "Local play";
  const gridStyle = {
    "--memory-columns": memoryColumnCount(runState.deck.length),
    "--memory-card-max": `${memoryCardMaxSize(runState.deck.length)}px`,
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(mismatchTimerRef.current);
      window.clearTimeout(hintTimerRef.current);
    };
  }, []);

  function handleCardClick(cardId) {
    const result = flipMemoryCard(stage, runState, cardId);
    if (!result.changed) return;

    clearHintCards();
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
    clearHintCards();
    setRunState(createMemoryRunState(stage));
    setMessage(createReadyMessage(stage));
    setCompletionNoticeOpen(false);
  }

  function showHint() {
    const hint = createMemoryHint(stage, runState);
    if (!hint) return;

    window.clearTimeout(hintTimerRef.current);
    setHintCardIds(new Set(hint.cardIds));
    setMessage({
      type: "word",
      title: hint.title,
      body: hint.body,
    });
    hintTimerRef.current = window.setTimeout(() => setHintCardIds(new Set()), 1500);
  }

  function clearHintCards() {
    window.clearTimeout(hintTimerRef.current);
    setHintCardIds(new Set());
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
              hinted={hintCardIds.has(card.id)}
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

function MemoryCard({ card, faceUp, hinted, matched, onClick }) {
  return (
    <button
      className={`memory-card${faceUp ? " face-up" : ""}${hinted ? " hinted" : ""}${matched ? " matched" : ""}`}
      type="button"
      disabled={matched}
      onClick={() => onClick(card.id)}
      aria-label={faceUp ? card.word : "Memory card"}
    >
      <span className="memory-card-back" aria-hidden={faceUp ? "true" : "false"} />
      <span className="memory-card-front" aria-hidden={faceUp ? "false" : "true"}>
        <CardFace card={card} />
      </span>
      {matched ? <span className="memory-match-badge" aria-hidden="true">Match +{POINT_VALUES.MEMORY_PAIR_MATCHED}</span> : null}
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

function memoryCardMaxSize(cardCount) {
  if (cardCount <= 8) return 136;
  if (cardCount <= 12) return 120;
  if (cardCount <= 16) return 106;
  return 90;
}

function createMemoryHint(stage, runState) {
  if (runState.completed) return null;

  const remainingPairs = Math.max(0, stage.pairs.length - runState.matchedPairIds.length);
  const [openCardId] = runState.openCardIds;
  const openCard = runState.deck.find((card) => card.id === openCardId);

  if (openCard) {
    const matchCard = runState.deck.find((card) => {
      return card.pairId === openCard.pairId && card.id !== openCard.id && !runState.matchedPairIds.includes(card.pairId);
    });

    if (matchCard) {
      return {
        cardIds: [matchCard.id],
        title: openCard.word,
        body: `Find its match · ${remainingPairs} pairs left`,
      };
    }
  }

  const nextCard = runState.deck.find((card) => {
    return !runState.matchedPairIds.includes(card.pairId) && !runState.openCardIds.includes(card.id);
  });

  return {
    cardIds: nextCard ? [nextCard.id] : [],
    title: "Hint",
    body: `${remainingPairs} pairs left · Try this card.`,
  };
}

function speak(text) {
  if (!text || typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}
