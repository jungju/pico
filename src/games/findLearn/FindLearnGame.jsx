import { useMemo, useState } from "react";
import { ArrowLeft, Lightbulb, RotateCcw, Volume2 } from "lucide-react";
import { findDifferenceAt, findObjectAt, getDifferenceArea, getDifferenceMarker, getRelativePoint } from "./hitTesting";
import { DEBUG_AREAS, findLearnStage as fallbackFindLearnStage } from "./stages/stage001";

const WRONG_MARKER_TIMEOUT_MS = 900;

export function FindLearnGame({ authControl, stage = fallbackFindLearnStage, onBack }) {
  const activeStage = stage || fallbackFindLearnStage;
  const [foundIds, setFoundIds] = useState(() => new Set());
  const [message, setMessage] = useState(() => createReadyMessage(activeStage));
  const [wrongPoint, setWrongPoint] = useState(null);
  const [hintId, setHintId] = useState(null);
  const pictures = getStagePictures(activeStage);
  const foundDifferences = useMemo(() => {
    return activeStage.differences.filter((difference) => foundIds.has(difference.id));
  }, [activeStage, foundIds]);
  const hintDifference = activeStage.differences.find((difference) => difference.id === hintId);
  const remainingDifference = activeStage.differences.find((difference) => !foundIds.has(difference.id));

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
      body: differenceMessage(difference),
    });
    speak(`Correct. ${differenceSpeech(difference)}`);
  }

  function showWord(object) {
    setMessage({
      type: "word",
      title: `${object.word} ${object.phonetic}`,
      body: `${object.meaning} · ${object.sentence} ${object.translation}`,
    });
    speak(`${object.word}. ${object.sentence}`);
  }

  function showWrong(point, side) {
    setWrongPoint({ ...point, side });
    setMessage({
      type: "wrong",
      title: "Wrong",
      body: "Look closely.",
    });
    speak("Wrong.");
    window.setTimeout(() => setWrongPoint(null), WRONG_MARKER_TIMEOUT_MS);
  }

  function findDifferenceAtPoint(point, side) {
    return findDifferenceAt(point, activeStage, foundIds, side);
  }

  function findObjectAtPoint(point, side) {
    return findObjectAt(point, activeStage, side);
  }

  function handlePictureClick(event, side) {
    const point = getRelativePoint(event, event.currentTarget);
    const difference = findDifferenceAtPoint(point, side);

    if (difference) {
      foundDifference(difference);
      return;
    }

    const object = findObjectAtPoint(point, side);

    if (object) {
      showWord(object);
      return;
    }

    showWrong(point, side);
  }

  function showHint() {
    if (!remainingDifference) return;
    setHintId(remainingDifference.id);
  }

  function resetGame() {
    setFoundIds(new Set());
    setHintId(null);
    setWrongPoint(null);
    setMessage(createReadyMessage(activeStage));
  }

  return (
    <main className="game-shell">
      <section className="game-topbar" aria-label="Game status">
        <div className="progress-text" aria-live="polite">
          {foundIds.size}/{activeStage.differences.length}
        </div>
        <div className="game-actions">
          {authControl}
          {onBack ? (
            <button className="icon-button" type="button" onClick={onBack} aria-label="Back to games">
              <ArrowLeft aria-hidden="true" size={19} />
            </button>
          ) : null}
          <button className="icon-button" type="button" onClick={showHint} aria-label="Hint">
            <Lightbulb aria-hidden="true" size={19} />
          </button>
          <button className="icon-button" type="button" onClick={resetGame} aria-label="Reset">
            <RotateCcw aria-hidden="true" size={19} />
          </button>
        </div>
      </section>

      <section className="pictures-grid" aria-label={activeStage.title}>
        {pictures.map((picture) => (
          <Picture
            foundDifferences={foundDifferences}
            hintDifference={hintDifference}
            key={picture.side}
            picture={picture}
            stage={activeStage}
            wrongPoint={wrongPoint}
            onPictureClick={handlePictureClick}
          />
        ))}
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

function Picture({ stage, picture, foundDifferences, hintDifference, wrongPoint, onPictureClick }) {
  return (
    <button
      className="picture-frame"
      style={{ "--picture-aspect": `${picture.width} / ${picture.height}` }}
      type="button"
      onClick={(event) => onPictureClick(event, picture.side)}
      aria-label="Find and learn picture"
    >
      <PictureImage picture={picture} />
      {DEBUG_AREAS ? <DebugAreas side={picture.side} stage={stage} /> : null}
      {foundDifferences.map((difference) => {
        const point = getDifferenceMarker(difference, picture.side);
        return point ? <Marker className="correct-marker" key={difference.id} point={point} /> : null;
      })}
      {hintDifference ? <HintMarker difference={hintDifference} side={picture.side} /> : null}
      {wrongPoint?.side === picture.side ? <Marker className="wrong-marker" point={wrongPoint} /> : null}
    </button>
  );
}

function PictureImage({ picture }) {
  if (picture.layout === "split-image") {
    return (
      <img
        className="split-picture-image"
        src={picture.image}
        alt=""
        draggable="false"
        style={{
          width: `${(picture.imageWidth / picture.panel.width) * 100}%`,
          height: `${(picture.imageHeight / picture.panel.height) * 100}%`,
          left: `${(-picture.panel.x / picture.panel.width) * 100}%`,
          top: `${(-picture.panel.y / picture.panel.height) * 100}%`,
        }}
      />
    );
  }

  return <img src={picture.image} alt="" draggable="false" />;
}

function HintMarker({ difference, side }) {
  const point = getDifferenceMarker(difference, side);
  return point ? <Marker className="hint-marker" point={point} /> : null;
}

function Marker({ className, point }) {
  return <span className={`picture-marker ${className}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} />;
}

function DebugAreas({ stage, side }) {
  return (
    <svg className="debug-areas" viewBox="0 0 100 100" aria-hidden="true">
      {(stage.objects || []).map((object) => (
        <AreaShape className="object-area" area={object.area} key={`object-${object.id}`} />
      ))}
      {stage.differences.map((difference) => {
        const area = getDifferenceArea(difference, side);
        return area ? <AreaShape className="difference-area" area={area} key={`difference-${difference.id}`} /> : null;
      })}
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

function getStagePictures(stage) {
  if (stage.layout === "split-image") {
    return ["left", "right"].map((side) => {
      const panel = stage.panels[side];

      return {
        side,
        layout: "split-image",
        image: stage.combinedImage,
        imageWidth: stage.imageWidth,
        imageHeight: stage.imageHeight,
        panel,
        width: panel.width,
        height: panel.height,
      };
    });
  }

  return [
    {
      side: "original",
      image: stage.images.original,
      width: 1,
      height: 1,
    },
    {
      side: "changed",
      image: stage.images.changed,
      width: 1,
      height: 1,
    },
  ];
}

function createReadyMessage(stage) {
  const objects = stage.objects || [];
  const words = objects.length > 0 ? objects.map((object) => object.word) : stage.differences.map(readableDifferenceName);

  return {
    type: "ready",
    title: stage.titleKo ? stage.titleKo : "Ready",
    body: words.slice(0, 6).join(" · "),
  };
}

function readableDifferenceName(difference) {
  return difference.word || difference.labelKo || difference.label;
}

function differenceMessage(difference) {
  return [difference.label, difference.translation].filter(Boolean).join(" ");
}

function differenceSpeech(difference) {
  return difference.voiceText || difference.sentence || difference.label;
}
