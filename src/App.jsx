import { useEffect, useState } from "react";
import { ArrowRight, LoaderCircle, LogIn, LogOut, UserRound } from "lucide-react";
import { FindLearnGame } from "./games/findLearn/FindLearnGame";
import { gameStages } from "./games/stageRegistry";
import { buildOhmeshLoginUrl, buildOhmeshLogoutUrl, fetchOhmeshSession, removeOhmeshResultParams } from "./ohmeshAuth";

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
    const selectedGame = GAMES.find((game) => game.id === selectedStageId);
    document.title = selectedGame ? `${selectedGame.title} · Pico` : "Pico";
  }, [selectedStageId]);

  function startLogin() {
    window.location.assign(buildOhmeshLoginUrl());
  }

  function startLogout() {
    window.location.assign(buildOhmeshLogoutUrl());
  }

  function openStage(stageId) {
    setSelectedStageId(stageId);
    pushAppPath(stagePath(stageId));
  }

  function openGameSelect() {
    setSelectedStageId(null);
    pushAppPath("/");
  }

  const selectedGame = GAMES.find((game) => game.id === selectedStageId);
  const selectedGameIndex = GAMES.findIndex((game) => game.id === selectedStageId);
  const nextGame = selectedGameIndex >= 0 ? GAMES[selectedGameIndex + 1] : null;

  if (selectedGame) {
    return (
      <FindLearnGame
        authState={authState}
        authControl={<AuthControl authState={authState} compact onLogin={startLogin} onLogout={startLogout} />}
        key={selectedGame.id}
        stage={selectedGame.stage}
        onBack={openGameSelect}
        onNext={nextGame ? () => openStage(nextGame.id) : null}
      />
    );
  }

  return (
    <main className="game-select-shell">
      <header className="game-select-header">
        <h1>Pico</h1>
        <AuthControl authState={authState} onLogin={startLogin} onLogout={startLogout} />
      </header>

      <section className="game-list" aria-label="Games">
        {GAMES.map((game) => (
          <button className="game-option" type="button" key={game.id} onClick={() => openStage(game.id)}>
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

function getStageIdFromLocation() {
  if (typeof window === "undefined") return null;

  const stageId = stageIdFromPath(window.location.pathname);
  return GAMES.some((game) => game.id === stageId) ? stageId : null;
}

function stageIdFromPath(pathname) {
  if (!pathname.startsWith(GAME_PATH_PREFIX)) return null;

  const [rawStageId] = pathname.slice(GAME_PATH_PREFIX.length).split("/");
  if (!rawStageId) return null;

  try {
    return decodeURIComponent(rawStageId);
  } catch {
    return null;
  }
}

function stagePath(stageId) {
  return `${GAME_PATH_PREFIX}${encodeURIComponent(stageId)}`;
}

function pushAppPath(path) {
  if (window.location.pathname === path && window.location.search === "") return;
  window.history.pushState({}, "", path);
}
