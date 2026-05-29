import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Flame,
  Grid2X2,
  LoaderCircle,
  LogIn,
  LogOut,
  Play,
  Route,
  ScanSearch,
  Search,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";
import { FindLearnGame } from "./games/findLearn/FindLearnGame";
import { GAME_TYPES, gameTypeLabel } from "./games/gameTypes";
import { HiddenObjectsGame } from "./games/hiddenObjects/HiddenObjectsGame";
import { MazeGame } from "./games/maze/MazeGame";
import { MemoryCardsGame } from "./games/memoryCards/MemoryCardsGame";
import { awardStageCompletionBonus, awardStageEventPoints } from "./games/points";
import { gameStages } from "./games/stageRegistry";
import { awardDailyStreakReward, qualifyDailyVisit } from "./games/streaks";
import { buildOhmeshLoginUrl, buildOhmeshLogoutUrl, fetchOhmeshSession, removeOhmeshResultParams } from "./ohmeshAuth";
import { emptyPicoProgress, loadPicoProgress, savePicoProgress } from "./ohmeshProgress";

const GAMES = gameStages.map((stageEntry) => ({
  ...stageEntry,
  image: stageEntry.previewImage,
}));
const GAME_PATH_PREFIX = "/games/";
const GAME_FILTERS = [
  { id: "all", label: "All" },
  { id: GAME_TYPES.SPOT_THE_DIFFERENCE, label: "Spot" },
  { id: GAME_TYPES.HIDDEN_OBJECTS, label: "Hidden" },
  { id: GAME_TYPES.MAZE, label: "Maze" },
  { id: GAME_TYPES.MEMORY_CARDS, label: "Memory" },
];
const GAME_TYPE_META = {
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

export default function App() {
  const [selectedStageId, setSelectedStageId] = useState(() => getStageIdFromLocation());
  const [authState, setAuthState] = useState({
    status: "loading",
    session: null,
    error: null,
  });
  const [picoProgressState, setPicoProgressState] = useState({
    status: "local",
    data: emptyPicoProgress(),
  });
  const [selectedGameTypeFilter, setSelectedGameTypeFilter] = useState("all");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState("all");
  const [selectedThemeFilter, setSelectedThemeFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const picoProgressRecordIdRef = useRef(null);
  const picoProgressDataRef = useRef(emptyPicoProgress());
  const picoProgressSaveSequenceRef = useRef(0);

  useEffect(() => {
    removeOhmeshResultParams();

    const controller = new AbortController();

    async function loadSession() {
      try {
        const session = await fetchOhmeshSession({ signal: controller.signal });
        setAuthState({
          status: session ? "authenticated" : "anonymous",
          session,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        setAuthState({
          status: "error",
          session: null,
          error,
        });
      }
    }

    loadSession();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handlePopState() {
      setSelectedStageId(getStageIdFromLocation());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (authState.status !== "authenticated") {
      picoProgressRecordIdRef.current = null;
      picoProgressDataRef.current = emptyPicoProgress();
      return;
    }

    const controller = new AbortController();

    async function loadProgress() {
      try {
        const { record, data } = await loadPicoProgress({ signal: controller.signal });
        if (controller.signal.aborted) return;
        picoProgressRecordIdRef.current = record?.id || null;
        picoProgressDataRef.current = data;
        setPicoProgressState({
          status: "ready",
          data,
        });
      } catch {
        if (controller.signal.aborted) return;
        setPicoProgressState({
          status: "error",
          data: emptyPicoProgress(),
        });
        picoProgressDataRef.current = emptyPicoProgress();
      }
    }

    loadProgress();

    return () => controller.abort();
  }, [authState.status]);

  useEffect(() => {
    const selectedGame = GAMES.find((game) => game.id === selectedStageId);
    document.title = selectedGame ? `${selectedGame.title} · Pico` : "Pico";
  }, [selectedStageId]);

  function startLogin() {
    window.location.assign(buildOhmeshLoginUrl());
  }

  function startLogout() {
    window.location.assign(buildOhmeshLogoutUrl());
  }

  function openStage(stage) {
    setSelectedStageId(stage.id);
    pushAppPath(stagePath(stage));
  }

  function openGameSelect() {
    setSelectedStageId(null);
    pushAppPath("/");
  }

  function awardPicoStageEvent(stageEntry, payload) {
    updatePicoProgress((progress, now) => {
      const result = awardStageEventPoints(progress, stageEntry, {
        ...payload,
        now,
      });

      return result.awardedPoints > 0 ? qualifyAndRewardDailyVisit(result.progress, now) : result.progress;
    });
  }

  function completePicoStage(stageEntry) {
    updatePicoProgress((progress, now) => {
      const result = awardStageCompletionBonus(progress, stageEntry, { now });
      return qualifyAndRewardDailyVisit(result.progress, now);
    });
  }

  function updatePicoProgress(updater) {
    if (authState.status !== "authenticated") return;

    const now = new Date().toISOString();
    const nextData = updater(picoProgressDataRef.current, now);
    picoProgressDataRef.current = nextData;
    setPicoProgressState({
      status: "saving",
      data: nextData,
    });

    const saveSequence = picoProgressSaveSequenceRef.current + 1;
    picoProgressSaveSequenceRef.current = saveSequence;

    savePicoProgress({
      recordId: picoProgressRecordIdRef.current,
      data: nextData,
    })
      .then((record) => {
        picoProgressRecordIdRef.current = record.id;
        if (picoProgressSaveSequenceRef.current === saveSequence) {
          setPicoProgressState({
            status: "ready",
            data: picoProgressDataRef.current,
          });
        }
      })
      .catch(() => {
        if (picoProgressSaveSequenceRef.current === saveSequence) {
          setPicoProgressState({
            status: "error",
            data: picoProgressDataRef.current,
          });
        }
      });
  }

  const selectedGame = GAMES.find((game) => game.id === selectedStageId);
  const selectedGameIndex = GAMES.findIndex((game) => game.id === selectedStageId);
  const nextGame = selectedGameIndex >= 0 ? GAMES[selectedGameIndex + 1] : null;
  const showProgressSummary = authState.status === "authenticated";
  const showSaveValueNote = authState.status === "anonymous" || authState.status === "error";
  const stageProgress = picoProgressState.data?.stages || {};
  const todaysGame = getTodaysGame(GAMES, stageProgress);
  const todaysGameCompleted = todaysGame ? Boolean(stageProgress[todaysGame.id]?.completed) : false;
  const todayStatusLabel = showProgressSummary ? (todaysGameCompleted ? "Done" : "Open") : "Ready";
  const todayReason = todaysGame
    ? getTodayReason(todaysGame, {
        completed: todaysGameCompleted,
        showProgress: showProgressSummary,
      })
    : "";
  const levelOptions = uniqueSorted(GAMES.map((game) => game.level));
  const themeOptions = uniqueSorted(GAMES.map((game) => game.theme));
  const filteredGames = GAMES.filter((game) => {
    if (selectedGameTypeFilter !== "all" && game.gameType !== selectedGameTypeFilter) return false;
    if (selectedLevelFilter !== "all" && String(game.level) !== selectedLevelFilter) return false;
    if (selectedThemeFilter !== "all" && game.theme !== selectedThemeFilter) return false;
    if (selectedStatusFilter !== "all") {
      const completed = Boolean(stageProgress[game.id]?.completed);
      if (selectedStatusFilter === "done" && !completed) return false;
      if (selectedStatusFilter === "open" && completed) return false;
    }
    return true;
  });

  if (selectedGame) {
    const gameProps = {
      authState,
      authControl: <AuthControl authState={authState} compact onLogin={startLogin} onLogout={startLogout} />,
      key: selectedGame.id,
      stage: selectedGame.stage,
      stageEntry: selectedGame,
      onPointEvent: (payload) => awardPicoStageEvent(selectedGame, payload),
      onStageComplete: () => completePicoStage(selectedGame),
      onBack: openGameSelect,
      onNext: nextGame ? () => openStage(nextGame) : null,
    };

    if (selectedGame.gameType === GAME_TYPES.HIDDEN_OBJECTS) {
      return <HiddenObjectsGame {...gameProps} />;
    }

    if (selectedGame.gameType === GAME_TYPES.MAZE) {
      return <MazeGame {...gameProps} />;
    }

    if (selectedGame.gameType === GAME_TYPES.MEMORY_CARDS) {
      return <MemoryCardsGame {...gameProps} />;
    }

    return (
      <FindLearnGame {...gameProps} />
    );
  }

  return (
    <main className="game-select-shell">
      <header className="game-select-header">
        <h1>Pico</h1>
        <AuthControl authState={authState} onLogin={startLogin} onLogout={startLogout} />
      </header>

      {showSaveValueNote ? <SaveValueNote onLogin={startLogin} /> : null}

      {showProgressSummary ? <PlayerProgressSummary progressState={picoProgressState} /> : null}

      {todaysGame ? (
        <section className="today-play" aria-label="Today's play">
          <button className="today-play-option" type="button" onClick={() => openStage(todaysGame)}>
            <span className="today-play-icon">
              <Sparkles aria-hidden="true" size={24} />
            </span>
            <span className="today-play-copy">
              <span className="today-play-meta">
                <span className="today-play-kicker">Play Today</span>
                <span className={`today-play-status ${todaysGameCompleted ? "done" : "open"}`}>{todayStatusLabel}</span>
              </span>
              <strong>{todaysGame.title}</strong>
              <span className="today-play-reason">{todayReason}</span>
            </span>
            <span className="today-play-action">
              <Play aria-hidden="true" size={16} />
              <span>Start</span>
            </span>
          </button>
        </section>
      ) : null}

      <section className="game-filter" aria-label="Game type filter">
        {GAME_FILTERS.map((filter) => {
          const count = filter.id === "all" ? GAMES.length : GAMES.filter((game) => game.gameType === filter.id).length;
          const selected = selectedGameTypeFilter === filter.id;
          return (
            <button
              className={`game-filter-option${selected ? " selected" : ""}`}
              type="button"
              key={filter.id}
              onClick={() => setSelectedGameTypeFilter(filter.id)}
              aria-pressed={selected}
            >
              <span>{filter.label}</span>
              <strong>{count}</strong>
            </button>
          );
        })}
      </section>

      <section className="stage-refinements" aria-label="Stage filters">
        <label className="stage-filter-field">
          <span>Level</span>
          <select value={selectedLevelFilter} onChange={(event) => setSelectedLevelFilter(event.target.value)}>
            <option value="all">All</option>
            {levelOptions.map((level) => (
              <option value={String(level)} key={level}>
                Level {level}
              </option>
            ))}
          </select>
        </label>
        <label className="stage-filter-field">
          <span>Theme</span>
          <select value={selectedThemeFilter} onChange={(event) => setSelectedThemeFilter(event.target.value)}>
            <option value="all">All</option>
            {themeOptions.map((theme) => (
              <option value={theme} key={theme}>
                {formatFilterLabel(theme)}
              </option>
            ))}
          </select>
        </label>
        <label className="stage-filter-field">
          <span>Status</span>
          <select value={selectedStatusFilter} onChange={(event) => setSelectedStatusFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="done">Done</option>
          </select>
        </label>
      </section>

      <section className="game-list" aria-label="Games">
        {filteredGames.length ? (
          filteredGames.map((game) => {
            const completed = Boolean(stageProgress[game.id]?.completed);
            const typeMeta = gameTypeMeta(game.gameType);
            const TypeIcon = typeMeta.Icon;
            return (
              <button
                className={`game-option ${typeMeta.className}`}
                type="button"
                key={game.id}
                onClick={() => openStage(game)}
              >
                <span className={`game-option-media ${typeMeta.className}`}>
                  <img src={game.image} alt="" draggable="false" />
                </span>
                <span className="game-option-copy">
                  <strong>{game.title}</strong>
                  <span className="game-option-type">
                    <TypeIcon aria-hidden="true" size={13} />
                    {gameTypeLabel(game.gameType)}
                  </span>
                  {game.titleKo ? (
                    <span className="game-option-title-ko" lang="ko">
                      {game.titleKo}
                    </span>
                  ) : null}
                  <span className="game-option-badges">
                    {showProgressSummary ? (
                      <span className={`game-option-status ${completed ? "done" : "open"}`}>{completed ? "Done" : "Open"}</span>
                    ) : null}
                    {game.badges.map((badge) => (
                      <span className="game-option-badge" key={badge}>
                        {badge}
                      </span>
                    ))}
                  </span>
                </span>
                <ArrowRight aria-hidden="true" size={22} />
              </button>
            );
          })
        ) : (
          <p className="game-list-empty">No stages match these filters.</p>
        )}
      </section>
    </main>
  );
}

function PlayerProgressSummary({ progressState }) {
  const progress = progressState.data || emptyPicoProgress();
  const loading = progressState.status === "loading";
  const error = progressState.status === "error";

  return (
    <section className={`player-progress${error ? " error" : ""}`} aria-label="Player progress">
      <span className="player-progress-chip">
        <Trophy aria-hidden="true" size={19} />
        <strong>{loading ? "..." : progress.totalPoints}</strong>
        <span>pts</span>
      </span>
      <span className="player-progress-chip">
        <Flame aria-hidden="true" size={19} />
        <strong>{loading ? "..." : progress.streak.current}</strong>
        <span>streak</span>
      </span>
    </section>
  );
}

function SaveValueNote({ onLogin }) {
  return (
    <section className="save-value-note" aria-label="Save progress">
      <span>Play now. Log in to save points and streaks.</span>
      <button className="save-value-action" type="button" onClick={onLogin}>
        <LogIn aria-hidden="true" size={16} />
        <span>Save progress</span>
      </button>
    </section>
  );
}

function AuthControl({ authState, compact = false, onLogin, onLogout }) {
  const className = `auth-control${compact ? " compact" : ""}`;
  const user = authState.session?.user;

  if (authState.status === "authenticated" && user) {
    return (
      <div className={className}>
        <span className="auth-user">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" draggable="false" />
          ) : (
            <UserRound aria-hidden="true" size={19} />
          )}
          <span className="auth-name">{displayName(user)}</span>
        </span>
        <button className="auth-button logout-button" type="button" onClick={onLogout} aria-label="Log out of ohmesh" title="Log out">
          <LogOut aria-hidden="true" size={19} />
          <span>Log out</span>
        </button>
      </div>
    );
  }

  const loading = authState.status === "loading";
  const errorTitle = authState.status === "error" ? authState.error?.message : undefined;
  const loginTitle = errorTitle || (loading ? "Checking ohmesh login" : "Log in with ohmesh");

  return (
    <div className={className}>
      <button
        className={`auth-button${authState.status === "error" ? " auth-error" : ""}`}
        type="button"
        disabled={loading}
        onClick={onLogin}
        aria-label={loading ? "Checking ohmesh login" : "Log in with ohmesh"}
        title={loginTitle}
      >
        {loading ? (
          <LoaderCircle className="auth-spinner" aria-hidden="true" size={18} />
        ) : (
          <LogIn aria-hidden="true" size={18} />
        )}
        <span>{loading ? "Checking login" : "Log in"}</span>
      </button>
    </div>
  );
}

function displayName(user) {
  return user.name || user.email || "Pico user";
}

function gameTypeMeta(gameType) {
  return GAME_TYPE_META[gameType] || {
    className: gameType.replaceAll("_", "-"),
    Icon: Sparkles,
  };
}

function getTodaysGame(games, stageProgress = {}) {
  const sortedGames = [...games].sort((a, b) => a.level - b.level || a.title.localeCompare(b.title));
  return sortedGames.find((game) => !stageProgress[game.id]?.completed) || sortedGames[0] || null;
}

function getTodayReason(game, { completed, showProgress }) {
  const typeLabel = gameTypeLabel(game.gameType);
  const levelLabel = `Level ${game.level}`;

  if (showProgress && !completed) return `Next open ${typeLabel} stage · ${levelLabel}`;
  if (showProgress && completed) return `Completed pick · play again for practice`;
  return `${typeLabel} warm-up · ${levelLabel}`;
}

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null))].sort((a, b) => {
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b));
  });
}

function formatFilterLabel(value) {
  return String(value)
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function qualifyAndRewardDailyVisit(progress, now) {
  const visit = qualifyDailyVisit(progress, { now: new Date(now) });
  return awardDailyStreakReward(visit.progress, { now: new Date(now) }).progress;
}

function getStageIdFromLocation() {
  if (typeof window === "undefined") return null;

  const stageId = stageIdFromPath(window.location.pathname);
  return GAMES.some((game) => game.id === stageId) ? stageId : null;
}

function stageIdFromPath(pathname) {
  if (!pathname.startsWith(GAME_PATH_PREFIX)) return null;

  const segments = pathname.slice(GAME_PATH_PREFIX.length).split("/").filter(Boolean);
  const rawStageId = segments.length >= 2 ? segments[1] : segments[0];
  if (!rawStageId) return null;

  try {
    return decodeURIComponent(rawStageId);
  } catch {
    return null;
  }
}

function stagePath(stage) {
  return `${GAME_PATH_PREFIX}${encodeURIComponent(stage.gameType)}/${encodeURIComponent(stage.id)}`;
}

function pushAppPath(path) {
  if (window.location.pathname === path && window.location.search === "") return;
  window.history.pushState({}, "", path);
}
