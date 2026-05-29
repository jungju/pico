import { ArrowRight, CheckCircle2, Home, Lightbulb, RotateCcw, Sparkles, Star, Trophy, Volume2 } from "lucide-react";

export function GameShell({
  authControl,
  children,
  completed,
  completionNotice,
  message,
  onBack,
  onHint,
  onReset,
  onSpeak,
  progressPercent,
  progressText,
  score,
  stageSubtitle,
  stageTitle,
  statusText,
}) {
  return (
    <main className="game-shell">
      <section className="game-topbar" aria-label="Game status">
        <div className="stage-badge">
          <span className="stage-badge-icon">
            <Sparkles aria-hidden="true" size={23} />
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
                <span>Games</span>
              </button>
            ) : null}
          </div>
          <div className="tool-action-group" aria-label="Game tools">
            <button className="action-button tool-action-button" type="button" onClick={onHint} aria-label="Show hint" title="Show hint">
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
            <button className="completion-action primary" type="button" onClick={onNext}>
              <ArrowRight aria-hidden="true" size={18} />
              <span>Next</span>
            </button>
          ) : null}
          <button className="completion-action" type="button" onClick={onBack}>
            <Home aria-hidden="true" size={18} />
            <span>Home</span>
          </button>
          <button className="completion-action ghost" type="button" onClick={onClose}>
            <span>Stay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
