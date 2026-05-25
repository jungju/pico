import { useMemo, useState } from "react";
import { Lightbulb, RotateCcw, Volume2 } from "lucide-react";
import { findDifferenceAt, findObjectAt, getRelativePoint } from "./hitTesting";
import { DEBUG_AREAS, findLearnStage } from "./stages/stage001";

const WRONG_MARKER_TIMEOUT_MS = 900;

export function FindLearnGame() {
  const [foundIds, setFoundIds] = useState(() => new Set());
  const [message, setMessage] = useState({
    type: "ready",
    title: "Ready",
    body: "cat · sun · house · tree · flower",
  });
  const [wrongPoint, setWrongPoint] = useState(null);
  const [hintId, setHintId] = useState(null);
  const foundDifferences = useMemo(() => {
    return findLearnStage.differences.filter((difference) => foundIds.has(difference.id));
  }, [foundIds]);
  const hintDifference = findLearnStage.differences.find((difference) => difference.id === hintId);
  const remainingDifference = findLearnStage.differences.find((difference) => !foundIds.has(difference.id));

  function foundDifference(difference) {
    setFoundIds((currentFoundIds) => {
      const nextFoundIds = new Set(currentFoundIds);
      nextFoundIds.add(difference.id);
      return nextFoundIds;
    });
    setHintId(null);
    setMessage({
      type: "correct",
      title: "Correct",
      body: difference.label,
    });
  }

  function showWord(object) {
    setMessage({
      type: "word",
      title: `${object.word} ${object.phonetic}`,
      body: `${object.meaning} · ${object.sentence} ${object.translation}`,
    });
    speak(`${object.word}. ${object.sentence}`);
  }

  function showWrong(point) {
    setWrongPoint(point);
    setMessage({
      type: "wrong",
      title: "Try again",
      body: "Look closely.",
    });
    window.setTimeout(() => setWrongPoint(null), WRONG_MARKER_TIMEOUT_MS);
  }

  function findDifferenceAtPoint(point) {
    return findDifferenceAt(point, findLearnStage, foundIds);
  }

  function findObjectAtPoint(point) {
    return findObjectAt(point, findLearnStage);
  }

  function handlePictureClick(event) {
    const point = getRelativePoint(event, event.currentTarget);
    const difference = findDifferenceAtPoint(point);

    if (difference) {
      foundDifference(difference);
      return;
    }

    const object = findObjectAtPoint(point);

    if (object) {
      showWord(object);
      return;
    }

    showWrong(point);
  }

  function showHint() {
    if (!remainingDifference) return;
    setHintId(remainingDifference.id);
  }

  function resetGame() {
    setFoundIds(new Set());
    setHintId(null);
    setWrongPoint(null);
    setMessage({
      type: "ready",
      title: "Ready",
      body: "cat · sun · house · tree · flower",
    });
  }

  return (
    <main className="game-shell">
      <section className="game-topbar" aria-label="Game status">
        <div className="progress-text" aria-live="polite">
          {foundIds.size}/{findLearnStage.differences.length}
        </div>
        <div className="game-actions">
          <button className="icon-button" type="button" onClick={showHint} aria-label="Hint">
            <Lightbulb aria-hidden="true" size={19} />
          </button>
          <button className="icon-button" type="button" onClick={resetGame} aria-label="Reset">
            <RotateCcw aria-hidden="true" size={19} />
          </button>
        </div>
      </section>

      <section className="pictures-grid" aria-label={findLearnStage.title}>
        <Picture
          image={findLearnStage.images.original}
          foundDifferences={foundDifferences}
          hintDifference={hintDifference}
          wrongPoint={wrongPoint}
          onPictureClick={handlePictureClick}
        />
        <Picture
          image={findLearnStage.images.changed}
          foundDifferences={foundDifferences}
          hintDifference={hintDifference}
          wrongPoint={wrongPoint}
          onPictureClick={handlePictureClick}
        />
      </section>

      <section className={`learning-panel ${message.type}`} aria-live="polite">
        <button className="icon-button" type="button" onClick={() => speak(message.body)} aria-label="Speak">
          <Volume2 aria-hidden="true" size={19} />
        </button>
        <div>
          <strong>{message.title}</strong>
          <p>{message.body}</p>
        </div>
      </section>
    </main>
  );
}

function Picture({ image, foundDifferences, hintDifference, wrongPoint, onPictureClick }) {
  return (
    <button className="picture-frame" type="button" onClick={onPictureClick} aria-label="Find and learn picture">
      <img src={image} alt="" draggable="false" />
      {DEBUG_AREAS ? <DebugAreas /> : null}
      {foundDifferences.map((difference) => (
        <Marker className="correct-marker" key={difference.id} point={difference.marker} />
      ))}
      {hintDifference ? <Marker className="hint-marker" point={hintDifference.marker} /> : null}
      {wrongPoint ? <Marker className="wrong-marker" point={wrongPoint} /> : null}
    </button>
  );
}

function Marker({ className, point }) {
  return <span className={`picture-marker ${className}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} />;
}

function DebugAreas() {
  return (
    <svg className="debug-areas" viewBox="0 0 100 100" aria-hidden="true">
      {findLearnStage.objects.map((object) => (
        <AreaShape className="object-area" area={object.area} key={`object-${object.id}`} />
      ))}
      {findLearnStage.differences.map((difference) => (
        <AreaShape className="difference-area" area={difference.area} key={`difference-${difference.id}`} />
      ))}
    </svg>
  );
}

function AreaShape({ area, className }) {
  if (area.type === "circle") {
    return <circle className={className} cx={area.x} cy={area.y} r={area.r} />;
  }

  if (area.type === "rect") {
    return <rect className={className} x={area.x} y={area.y} width={area.w} height={area.h} />;
  }

  if (area.type === "polygon") {
    return <polygon className={className} points={area.points.map((point) => point.join(",")).join(" ")} />;
  }

  return null;
}

function speak(text) {
  if (!text || typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}
