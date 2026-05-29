import { useEffect, useState } from "react";
import { ArrowRight, Flame, LoaderCircle, LogIn, LogOut, Sparkles, Trophy, UserRound } from "lucide-react";
import { FindLearnGame } from "./games/findLearn/FindLearnGame";
import { GAME_TYPES } from "./games/gameTypes";
import { HiddenObjectsGame } from "./games/hiddenObjects/HiddenObjectsGame";
import { MazeGame } from "./games/maze/MazeGame";
import { MemoryCardsGame } from "./games/memoryCards/MemoryCardsGame";
import { gameStages } from "./games/stageRegistry";
import { buildOhmeshLoginUrl, buildOhmeshLogoutUrl, fetchOhmeshSession, removeOhmeshResultParams } from "./ohmeshAuth";
import { emptyPicoProgress, loadPicoProgress } from "./ohmeshProgress";

const GAMES = gameStages.map((stageEntry) => ({
  ...stageEntry,
  image: stageEntry.previewImage,
}));
const GAME_PATH_PREFIX = "/games/";

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
      return;
    }

    const controller = new AbortController();

    async function loadProgress() {
      try {
        const { data } = await loadPicoProgress({ signal: controller.signal });
        if (controller.signal.aborted) return;
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

  const selectedGame = GAMES.find((game) => game.id === selectedStageId);
  const selectedGameIndex = GAMES.findIndex((game) => game.id === selectedStageId);
  const nextGame = selectedGameIndex >= 0 ? GAMES[selectedGameIndex + 1] : null;
  const todaysGame = getTodaysGame(GAMES);
  const showProgressSummary = authState.status === "authenticated";

  if (selectedGame) {
    const gameProps = {
      authState,
      authControl: <AuthControl authState={authState} compact onLogin={startLogin} onLogout={startLogout} />,
      key: selectedGame.id,
      stage: selectedGame.stage,
      stageEntry: selectedGame,
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

      {showProgressSummary ? <PlayerProgressSummary progressState={picoProgressState} /> : null}

      {todaysGame ? (
        <section className="today-play" aria-label="Today's play">
          <button className="today-play-option" type="button" onClick={() => openStage(todaysGame)}>
            <span className="today-play-icon">
              <Sparkles aria-hidden="true" size={24} />
            </span>
            <span className="today-play-copy">
              <span>Today</span>
              <strong>{todaysGame.title}</strong>
            </span>
            <ArrowRight aria-hidden="true" size={22} />
          </button>
        </section>
      ) : null}

      <section className="game-list" aria-label="Games">
        {GAMES.map((game) => (
          <button className="game-option" type="button" key={game.id} onClick={() => openStage(game)}>
            <span className="game-option-media">
              <img src={game.image} alt="" draggable="false" />
            </span>
            <span className="game-option-copy">
              <strong>{game.title}</strong>
              <span>{game.category}</span>
              <span className="game-option-badges">
                {game.badges.map((badge) => (
                  <span className="game-option-badge" key={badge}>
                    {badge}
                  </span>
                ))}
              </span>
            </span>
            <ArrowRight aria-hidden="true" size={22} />
          </button>
        ))}
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

function getTodaysGame(games) {
  return [...games].sort((a, b) => a.level - b.level || a.title.localeCompare(b.title))[0] || null;
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
