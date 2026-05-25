import { useEffect, useState } from "react";
import { ArrowRight, LoaderCircle, LogIn, LogOut, UserRound } from "lucide-react";
import { FindLearnGame } from "./games/findLearn/FindLearnGame";
import { defaultFindLearnStage, findLearnStages } from "./games/findLearn/stages";
import { buildOhmeshLoginUrl, buildOhmeshLogoutUrl, fetchOhmeshSession, removeOhmeshResultParams } from "./ohmeshAuth";

const GAMES = findLearnStages.map((stage) => ({
  id: stage.id,
  title: stage.title,
  category: stage.titleKo ? `Find & Learn · ${stage.titleKo}` : "Find & Learn",
  image: stage.previewImage || stage.images?.changed || defaultFindLearnStage.previewImage,
  stage,
}));

export default function App() {
  const [selectedStageId, setSelectedStageId] = useState(null);
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

  function startLogin() {
    window.location.assign(buildOhmeshLoginUrl());
  }

  function startLogout() {
    window.location.assign(buildOhmeshLogoutUrl());
  }

  const selectedGame = GAMES.find((game) => game.id === selectedStageId);

  if (selectedGame) {
    return (
      <FindLearnGame
        authState={authState}
        authControl={<AuthControl authState={authState} compact onLogin={startLogin} onLogout={startLogout} />}
        key={selectedGame.id}
        stage={selectedGame.stage}
        onBack={() => setSelectedStageId(null)}
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
          <button className="game-option" type="button" key={game.id} onClick={() => setSelectedStageId(game.id)}>
            <span className="game-option-media">
              <img src={game.image} alt="" draggable="false" />
            </span>
            <span className="game-option-copy">
              <strong>{game.title}</strong>
              <span>{game.category}</span>
            </span>
            <ArrowRight aria-hidden="true" size={22} />
          </button>
        ))}
      </section>
    </main>
  );
}

function AuthControl({ authState, compact = false, onLogin, onLogout }) {
  const className = compact ? "auth-control compact" : "auth-control";
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
        <button className="icon-button" type="button" onClick={onLogout} aria-label="Log out of ohmesh">
          <LogOut aria-hidden="true" size={19} />
        </button>
      </div>
    );
  }

  const loading = authState.status === "loading";
  const errorTitle = authState.status === "error" ? authState.error?.message : undefined;

  return (
    <div className={className}>
      <button
        className={`auth-button${authState.status === "error" ? " auth-error" : ""}`}
        type="button"
        disabled={loading}
        onClick={onLogin}
        aria-label={loading ? "Checking ohmesh login" : "Log in with ohmesh"}
        title={errorTitle}
      >
        {loading ? (
          <LoaderCircle className="auth-spinner" aria-hidden="true" size={18} />
        ) : (
          <LogIn aria-hidden="true" size={18} />
        )}
        <span>{loading ? "Checking" : "Log in"}</span>
      </button>
    </div>
  );
}

function displayName(user) {
  return user.name || user.email || "Pico user";
}
