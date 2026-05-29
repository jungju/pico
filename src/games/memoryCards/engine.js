export function createMemoryRunState(stage, { seed = stage.id } = {}) {
  return {
    deck: createMemoryDeck(stage, { seed }),
    openCardIds: [],
    matchedPairIds: [],
    attempts: 0,
    completed: false,
  };
}

export function createMemoryDeck(stage, { seed = stage.id } = {}) {
  const cards = stage.pairs.flatMap((pair) => {
    return pair.cardFaces.map((face, faceIndex) => ({
      id: `${pair.id}:${face.id || faceIndex}`,
      pairId: pair.id,
      faceIndex,
      face,
      word: pair.word,
      meaning: pair.meaning,
      phonetic: pair.phonetic,
      sentence: pair.sentence,
      translation: pair.translation,
      audio: face.audio || pair.audio,
    }));
  });

  return shuffle(cards, seed);
}

export function flipMemoryCard(stage, state, cardId) {
  const card = state.deck.find((item) => item.id === cardId);
  if (!card || state.matchedPairIds.includes(card.pairId) || state.openCardIds.includes(cardId)) {
    return unchangedResult(state, "ignored");
  }

  if (state.openCardIds.length >= 2) {
    return unchangedResult(state, "waiting-for-mismatch-close");
  }

  const nextOpenCardIds = [...state.openCardIds, cardId];
  const result = {
    flippedCard: card,
    matchedPair: null,
    mismatchCardIds: [],
    needsMismatchDelay: false,
  };

  if (nextOpenCardIds.length === 1) {
    return {
      ...result,
      changed: true,
      reason: "opened",
      state: {
        ...state,
        openCardIds: nextOpenCardIds,
      },
    };
  }

  const [firstCardId, secondCardId] = nextOpenCardIds;
  const firstCard = state.deck.find((item) => item.id === firstCardId);
  const matched = firstCard?.pairId === card.pairId;
  const attempts = state.attempts + 1;

  if (matched) {
    const matchedPairIds = [...state.matchedPairIds, card.pairId];
    const completed = matchedPairIds.length === stage.pairs.length;

    return {
      ...result,
      changed: true,
      reason: completed ? "completed" : "matched",
      matchedPair: stage.pairs.find((pair) => pair.id === card.pairId) || null,
      state: {
        ...state,
        openCardIds: [],
        matchedPairIds,
        attempts,
        completed,
      },
    };
  }

  return {
    ...result,
    changed: true,
    reason: "mismatch",
    mismatchCardIds: [firstCardId, secondCardId],
    needsMismatchDelay: true,
    state: {
      ...state,
      openCardIds: nextOpenCardIds,
      attempts,
    },
  };
}

export function closeMismatchedMemoryCards(state) {
  return {
    ...state,
    openCardIds: [],
  };
}

export function isMemoryCardFaceUp(state, card) {
  return state.openCardIds.includes(card.id) || state.matchedPairIds.includes(card.pairId);
}

function unchangedResult(state, reason) {
  return {
    changed: false,
    reason,
    flippedCard: null,
    matchedPair: null,
    mismatchCardIds: [],
    needsMismatchDelay: false,
    state,
  };
}

function shuffle(cards, seed) {
  const nextCards = [...cards];
  const random = seededRandom(seed);

  for (let index = nextCards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [nextCards[index], nextCards[swapIndex]] = [nextCards[swapIndex], nextCards[index]];
  }

  return nextCards;
}

function seededRandom(seed) {
  let value = hashString(seed);

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function hashString(value) {
  return [...String(value)].reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 2166136261);
}
