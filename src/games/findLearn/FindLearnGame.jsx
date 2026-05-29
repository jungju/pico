import { useEffect, useMemo, useRef, useState } from "react";
import { GameShell } from "../GameShell";
import { findDifferenceAt, findObjectAt, getDifferenceArea, getDifferenceMarker, getRelativePoint } from "./hitTesting";
import { DEBUG_AREAS, findLearnStage as fallbackFindLearnStage } from "./stages/stage001";
import { emptyFindLearnProgress, loadFindLearnProgress, saveFindLearnProgress } from "../../ohmeshProgress";

const WRONG_MARKER_TIMEOUT_MS = 900;
const POINTS_PER_DIFFERENCE = 100;

export function FindLearnGame({ authState, authControl, stage = fallbackFindLearnStage, onBack, onNext }) {
  const activeStage = stage || fallbackFindLearnStage;
  const [foundIds, setFoundIds] = useState(() => new Set());
  const [message, setMessage] = useState(() => createReadyMessage(activeStage));
  const [wrongPoint, setWrongPoint] = useState(null);
  const [hintId, setHintId] = useState(null);
  const [completionNoticeOpen, setCompletionNoticeOpen] = useState(false);
  const [progressStatus, setProgressStatus] = useState("local");
  const progressRecordIdRef = useRef(null);
  const progressDataRef = useRef(emptyFindLearnProgress());
  const progressLoadingRef = useRef(false);
  const saveSequenceRef = useRef(0);
  const pictures = getStagePictures(activeStage);
  const differenceIds = useMemo(() => {
    return new Set(activeStage.differences.map((difference) => difference.id));
  }, [activeStage]);
  const foundDifferences = useMemo(() => {
    return activeStage.differences.filter((difference) => foundIds.has(difference.id));
  }, [activeStage, foundIds]);
  const hintDifference = activeStage.differences.find((difference) => difference.id === hintId);
  const remainingDifference = activeStage.differences.find((difference) => !foundIds.has(difference.id));
  const score = calculateScore(foundIds);
  const completed = foundIds.size === activeStage.differences.length;
  const visibleProgressStatus = authState?.status === "authenticated" ? progressStatus : "local";
  const statusText = saveStatusText(visibleProgressStatus);
  const progressPercent =
    activeStage.differences.length > 0 ? Math.round((foundIds.size / activeStage.differences.length) * 100) : 0;

  useEffect(() => {
    if (authState?.status !== "authenticated") {
      progressRecordIdRef.current = null;
      progressDataRef.current = emptyFindLearnProgress();
      progressLoadingRef.current = false;
      return;
    }

    const controller = new AbortController();
    progressLoadingRef.current = true;

    async function loadProgress() {
      try {
        const { record, data } = await loadFindLearnProgress({ signal: controller.signal });
        if (controller.signal.aborted) return;

        progressRecordIdRef.current = record?.id || null;
        progressDataRef.current = data;
        progressLoadingRef.current = false;

        const stageProgress = data.stages?.[activeStage.id];
        if (stageProgress) {
          const savedFoundIds = new Set((stageProgress.foundIds || []).filter((id) => differenceIds.has(id)));
          setFoundIds(savedFoundIds);

          if (stageProgress.completed) {
            setMessage(createCompleteMessage(activeStage, calculateScore(savedFoundIds)));
            setCompletionNoticeOpen(true);
          }
        }

        setProgressStatus("saved");
      } catch {
        progressLoadingRef.current = false;
        if (!controller.signal.aborted) {
          setProgressStatus("error");
        }
      }
    }

    loadProgress();

    return () => {
      progressLoadingRef.current = false;
      controller.abort();
    };
  }, [activeStage, authState?.status, differenceIds]);

  function foundDifference(difference) {
    const nextFoundIds = new Set(foundIds);
    nextFoundIds.add(difference.id);
    const nextCompleted = nextFoundIds.size === activeStage.differences.length;
    const nextScore = calculateScore(nextFoundIds);

    setFoundIds(nextFoundIds);
    setHintId(null);
    setMessage({
      type: nextCompleted ? "complete" : "correct",
      title: nextCompleted ? "Complete" : "Correct",
      body: nextCompleted ? completeMessageBody(activeStage, nextScore) : differenceMessage(difference),
    });
    if (nextCompleted) {
      setCompletionNoticeOpen(true);
    }
    speak(nextCompleted ? `Complete. ${activeStage.title}. ${nextScore} points.` : `Correct. ${differenceSpeech(difference)}`);
    saveStageProgress(nextFoundIds);
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
    const emptyFoundIds = new Set();
    setFoundIds(new Set());
    setHintId(null);
    setWrongPoint(null);
    setCompletionNoticeOpen(false);
    setMessage(createReadyMessage(activeStage));
    saveStageProgress(emptyFoundIds);
  }

  async function saveStageProgress(nextFoundIds) {
    if (authState?.status !== "authenticated" || progressLoadingRef.current) return;

    const now = new Date().toISOString();
    const nextCompleted = nextFoundIds.size === activeStage.differences.length;
    const existingStageProgress = progressDataRef.current.stages?.[activeStage.id];
    const stageProgress = {
      stageId: activeStage.id,
      foundIds: [...nextFoundIds],
      completed: nextCompleted,
      score: calculateScore(nextFoundIds),
      totalDifferences: activeStage.differences.length,
      completedAt: nextCompleted ? existingStageProgress?.completedAt || now : null,
      updatedAt: now,
    };
    const nextData = {
      version: 1,
      stages: {
        ...(progressDataRef.current.stages || {}),
        [activeStage.id]: stageProgress,
      },
    };

    progressDataRef.current = nextData;
    setProgressStatus("saving");

    const saveSequence = saveSequenceRef.current + 1;
    saveSequenceRef.current = saveSequence;

    try {
      const record = await saveFindLearnProgress({
        recordId: progressRecordIdRef.current,
        data: nextData,
      });
      progressRecordIdRef.current = record.id;

      if (saveSequenceRef.current === saveSequence) {
        setProgressStatus("saved");
      }
    } catch {
      if (saveSequenceRef.current === saveSequence) {
        setProgressStatus("error");
      }
    }
  }

  return (
    <GameShell
      authControl={authControl}
      completed={completed}
      completionNotice={{
        hasNext: Boolean(onNext),
        open: completed && completionNoticeOpen,
        score,
        stageTitle: activeStage.titleKo || activeStage.title,
        onBack,
        onClose: () => setCompletionNoticeOpen(false),
        onNext,
      }}
      message={message}
      onBack={onBack}
      onHint={showHint}
      onReset={resetGame}
      onSpeak={() => speak(message.body)}
      progressPercent={progressPercent}
      progressText={`${foundIds.size}/${activeStage.differences.length}`}
      score={score}
      stageSubtitle={stageSubtitle(activeStage)}
      stageTitle={activeStage.titleKo || activeStage.title}
      statusText={statusText}
    >
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
    </GameShell>
  );
}

function Picture({ stage, picture, foundDifferences, hintDifference, wrongPoint, onPictureClick }) {
  const interactive = pictureAcceptsClicks(stage, picture.side);
  const frameClassName = interactive ? "picture-frame" : "picture-frame reference-picture";
  const frameStyle = {
    "--picture-aspect": `${picture.width} / ${picture.height}`,
    "--picture-ratio": `${picture.width / picture.height}`,
  };
  const children = (
    <>
      <PictureImage picture={picture} />
      {DEBUG_AREAS ? <DebugAreas side={picture.side} stage={stage} /> : null}
      {foundDifferences.map((difference) => {
        const point = getDifferenceMarker(difference, picture.side);
        return point ? <Marker className="correct-marker" key={difference.id} point={point} /> : null;
      })}
      {hintDifference ? <HintMarker difference={hintDifference} side={picture.side} /> : null}
      {wrongPoint?.side === picture.side ? <Marker className="wrong-marker" point={wrongPoint} /> : null}
    </>
  );

  if (!interactive) {
    return (
      <div className={frameClassName} style={frameStyle} aria-label="Reference picture">
        {children}
      </div>
    );
  }

  return (
    <button
      className={frameClassName}
      style={frameStyle}
      type="button"
      onClick={(event) => onPictureClick(event, picture.side)}
      aria-label="Find and learn picture"
    >
      {children}
    </button>
  );
}

function pictureAcceptsClicks(stage, side) {
  return (
    stage.differences.some((difference) => getDifferenceArea(difference, side)) ||
    (stage.objects || []).some((object) => !object.targetSide || object.targetSide === side)
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

function stageSubtitle(stage) {
  if (stage.titleKo && stage.titleKo !== stage.title) return stage.title;
  return "Find & Learn";
}

function createCompleteMessage(stage, score) {
  return {
    type: "complete",
    title: "Complete",
    body: completeMessageBody(stage, score),
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

function completeMessageBody(stage, score) {
  return `${stage.titleKo || stage.title} complete · ${score} pts`;
}

function calculateScore(foundIds) {
  return foundIds.size * POINTS_PER_DIFFERENCE;
}

function saveStatusText(status) {
  if (status === "loading") return "Loading";
  if (status === "saving") return "Saving";
  if (status === "saved") return "Saved";
  if (status === "error") return "Save error";
  return "";
}
