import { ArrowRight, CheckCircle2, Grid2X2, Home, Lightbulb, Route, RotateCcw, ScanSearch, Search, Sparkles, Star, Trophy, Volume2 } from "lucide-react";
import { GAME_TYPES, gameTypeLabel } from "./gameTypes";

const GAME_BADGE_META = {
  [GAME_TYPES.SPOT_THE_DIFFERENCE]: {
    className: "spot-the-difference",
    Icon: ScanSearch,
  },
  [GAME_TYPES.HIDDEN_OBJECTS]: {
    className: "hidden-objects",
    Icon: Search,
  },
  [GAME_TYPES.MAZE]: {
    className: "maze",
    Icon: Route,
  },
  [GAME_TYPES.MEMORY_CARDS]: {
    className: "memory-cards",
    Icon: Grid2X2,
  },
};

export function GameShell({
  authControl,
  children,
  completed,
  completionNotice,
  message,
  hintPrompted = false,
  onBack,
  onHint,
  onReset,
  onSpeak,
  progressPercent,
  progressText,
  score,
  gameType,
  stageSubtitle,
  stageTitle,
  statusText,
}) {
  const badgeMeta = GAME_BADGE_META[gameType] || {
    className: "default-game",
    Icon: Sparkles,
  };
  const BadgeIcon = badgeMeta.Icon;
  const badgeLabel = gameTypeLabel(gameType);

  return (
    <main className="game-shell">
      <section className="game-topbar" aria-label="Game status">
        <div className={`stage-badge ${badgeMeta.className}`}>
          <span className="stage-badge-icon" role="img" aria-label={badgeLabel} title={badgeLabel}>
            <BadgeIcon aria-hidden="true" size={23} />
          </span>
          <span className="stage-copy">
            <strong>{stageTitle}</strong>
            <span>{stageSubtitle}</span>
          </span>
        </div>

        <div className="progress-hud" style={{ "--progress-value": `${progressPercent}%` }} aria-live="polite">
          <span className="hud-chip progress-chip">
            <Star aria-hidden="true" size={18} />
            <span>{progressText}</span>
          </span>
          <span className="hud-chip score-chip">
            <Trophy aria-hidden="true" size={18} />
            <span>{score} pts</span>
          </span>
          {completed ? (
            <span className="hud-chip complete-text">
              <CheckCircle2 aria-hidden="true" size={17} />
              <span>Done</span>
            </span>
          ) : null}
          {statusText ? <span className="hud-chip save-text">{statusText}</span> : null}
          <span className="progress-meter" aria-hidden="true">
            <span />
          </span>
        </div>

        <div className="game-actions">
          <div className="nav-action-group">
            {onBack ? (
              <button
                className="action-button game-list-button"
                type="button"
                onClick={onBack}
                aria-label="Go to game list"
                title="Go to game list"
              >
                <Home aria-hidden="true" size={18} />
                <span>Game List</span>
              </button>
            ) : null}
          </div>
          <div className="tool-action-group" aria-label="Game tools">
            <button
              className={`action-button tool-action-button hint-action-button${hintPrompted ? " hint-prompted" : ""}`}
              type="button"
              onClick={onHint}
              aria-label={hintPrompted ? "Show hint. A hint is ready." : "Show hint"}
              title={hintPrompted ? "Hint is ready" : "Show hint"}
            >
              <Lightbulb aria-hidden="true" size={19} />
              <span>Hint</span>
            </button>
            <button className="action-button tool-action-button" type="button" onClick={onReset} aria-label="Reset stage" title="Reset stage">
              <RotateCcw aria-hidden="true" size={19} />
              <span>Reset</span>
            </button>
          </div>
          <div className="account-action-group">{authControl}</div>
        </div>
      </section>

      {children}

      <section className={`learning-panel ${message.type}`} aria-live="polite">
        <button className="icon-button" type="button" onClick={onSpeak} aria-label="Speak">
          <Volume2 aria-hidden="true" size={19} />
        </button>
        <div>
          <strong>{message.title}</strong>
          <p>{message.body}</p>
        </div>
      </section>

      {completionNotice?.open ? <CompletionNotice {...completionNotice} /> : null}
    </main>
  );
}

function CompletionNotice({ hasNext, score, stageTitle, onBack, onClose, onNext }) {
  return (
    <div className="completion-overlay" role="dialog" aria-modal="true" aria-labelledby="completion-title">
      <div className="completion-panel">
        <div>
          <strong id="completion-title">Success</strong>
          <p>
            {stageTitle} · {score} pts
          </p>
        </div>
        <div className="completion-actions">
          {hasNext ? (
            <button className="completion-action primary" type="button" onClick={onNext} aria-label="Go to next stage" title="Next stage">
              <ArrowRight aria-hidden="true" size={18} />
              <span>Next Stage</span>
            </button>
          ) : null}
          <button className="completion-action" type="button" onClick={onBack} aria-label="Go home to game list" title="Game list">
            <Home aria-hidden="true" size={18} />
            <span>Game List</span>
          </button>
          <button className="completion-action ghost" type="button" onClick={onClose} aria-label="Keep playing this stage" title="Keep playing">
            <span>Keep Playing</span>
          </button>
        </div>
      </div>
    </div>
  );
}
