import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Database,
  LogIn,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { APP_NAME, OHMESH_APP_SLUG, RECORD_TYPE } from "./constants";
import { createItem, mergeStates, normalizeState, touchState } from "./picoState";
import {
  clearPendingLocalSync,
  createLoginUrl,
  getResponseErrorMessage,
  hasPendingLocalSync,
  markPendingLocalSync,
  ohmeshFetch,
  readLocalState,
  readResponseJson,
  readRoutePath,
  selectLatestRecord,
  userLabel,
  writeLocalState,
} from "./ohmeshClient";

const EMPTY_FORM = { title: "", body: "" };

export default function App() {
  const [routePath] = useState(readRoutePath);
  const [picoState, setPicoState] = useState(readLocalState);
  const [form, setForm] = useState(EMPTY_FORM);
  const [query, setQuery] = useState("");
  const [authState, setAuthState] = useState({
    status: "checking",
    user: null,
    app: null,
    message: "Checking",
  });
  const [record, setRecord] = useState(null);
  const [remoteReady, setRemoteReady] = useState(false);
  const [syncState, setSyncState] = useState({
    status: "local",
    message: "Local",
  });
  const savedJsonRef = useRef("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return picoState.items;

    return picoState.items.filter((item) => {
      return `${item.title}\n${item.body}`.toLowerCase().includes(normalizedQuery);
    });
  }, [picoState.items, query]);

  const clearRemoteState = useCallback(() => {
    setRecord(null);
    setRemoteReady(false);
    savedJsonRef.current = "";
  }, []);

  const handleSessionProblem = useCallback(
    (response) => {
      if (response.status === 401) {
        clearRemoteState();
        setAuthState({
          status: "signed-out",
          user: null,
          app: null,
          message: "Signed out",
        });
        setSyncState({ status: "local", message: "Local" });
        return true;
      }

      if (response.status === 403) {
        clearRemoteState();
        setAuthState({
          status: "wrong-app",
          user: null,
          app: null,
          message: "Wrong app session",
        });
        setSyncState({ status: "error", message: "Session mismatch" });
        return true;
      }

      return false;
    },
    [clearRemoteState]
  );

  const loadAuthState = useCallback(async () => {
    try {
      const response = await ohmeshFetch("/auth/me");

      if (response.status === 401) {
        clearRemoteState();
        setAuthState({
          status: "signed-out",
          user: null,
          app: null,
          message: "Signed out",
        });
        setSyncState({ status: "local", message: "Local" });
        return;
      }

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response, "Could not check session."));
      }

      const sessionInfo = await readResponseJson(response);

      if (sessionInfo?.app?.slug && sessionInfo.app.slug !== OHMESH_APP_SLUG) {
        clearRemoteState();
        setAuthState({
          status: "wrong-app",
          user: sessionInfo.user || null,
          app: sessionInfo.app || null,
          message: "Wrong app session",
        });
        setSyncState({ status: "error", message: "Session mismatch" });
        return;
      }

      setAuthState({
        status: "signed-in",
        user: sessionInfo?.user || null,
        app: sessionInfo?.app || null,
        message: "",
      });
    } catch (error) {
      clearRemoteState();
      setAuthState({
        status: "error",
        user: null,
        app: null,
        message: error instanceof Error ? error.message : "Could not check session.",
      });
      setSyncState({ status: "local", message: "Local" });
    }
  }, [clearRemoteState]);

  useEffect(() => {
    let ignore = false;

    async function loadAuthAfterMount() {
      await Promise.resolve();
      if (!ignore) loadAuthState();
    }

    loadAuthAfterMount();

    return () => {
      ignore = true;
    };
  }, [loadAuthState, routePath]);

  useEffect(() => {
    if (authState.status === "signed-in") return;
    writeLocalState(picoState);
  }, [authState.status, picoState]);

  useEffect(() => {
    if (authState.status !== "signed-in") return undefined;

    let ignore = false;

    async function loadRemoteState() {
      setRemoteReady(false);
      setRecord(null);
      setSyncState({ status: "loading", message: "Loading" });
      savedJsonRef.current = "";

      try {
        const response = await ohmeshFetch(
          `/api/apps/${OHMESH_APP_SLUG}/records?type=${encodeURIComponent(RECORD_TYPE)}&limit=100&offset=0`
        );

        if (ignore || handleSessionProblem(response)) return;

        if (!response.ok) {
          throw new Error(await getResponseErrorMessage(response, "Could not load records."));
        }

        const records = await readResponseJson(response);
        const latestRecord = selectLatestRecord(Array.isArray(records) ? records : []);
        const remoteState = normalizeState(latestRecord?.data);
        const nextState = hasPendingLocalSync() ? mergeStates(readLocalState(), remoteState) : remoteState;

        if (ignore) return;

        setRecord(latestRecord);
        setPicoState(nextState);
        setRemoteReady(true);
        savedJsonRef.current = JSON.stringify(nextState);
        setSyncState({ status: "saved", message: "Saved" });

        if (hasPendingLocalSync()) {
          clearPendingLocalSync();
        }
      } catch (error) {
        if (ignore) return;
        setRemoteReady(false);
        setSyncState({
          status: "error",
          message: error instanceof Error ? error.message : "Load error",
        });
      }
    }

    loadRemoteState();

    return () => {
      ignore = true;
    };
  }, [authState.status, handleSessionProblem]);

  useEffect(() => {
    if (authState.status !== "signed-in" || !remoteReady) return undefined;

    const stateJson = JSON.stringify(picoState);
    if (stateJson === savedJsonRef.current) return undefined;

    setSyncState({ status: "saving", message: "Saving" });

    const timer = window.setTimeout(async () => {
      const payload = {
        type: RECORD_TYPE,
        data: normalizeState(picoState),
      };

      try {
        const response = record
          ? await ohmeshFetch(`/api/apps/${OHMESH_APP_SLUG}/records/${record.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ data: payload.data }),
            })
          : await ohmeshFetch(`/api/apps/${OHMESH_APP_SLUG}/records`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

        if (handleSessionProblem(response)) return;

        if (!response.ok) {
          throw new Error(await getResponseErrorMessage(response, "Could not save."));
        }

        const savedRecord = await readResponseJson(response);
        setRecord(savedRecord || record);
        savedJsonRef.current = stateJson;
        writeLocalState(picoState);
        setSyncState({ status: "saved", message: "Saved" });
      } catch (error) {
        setSyncState({
          status: "error",
          message: error instanceof Error ? error.message : "Save error",
        });
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [authState.status, handleSessionProblem, picoState, record, remoteReady]);

  function updateItems(updater) {
    setPicoState((currentState) => touchState(currentState, updater(currentState.items)));
  }

  function addItem(event) {
    event.preventDefault();
    if (!form.title.trim() && !form.body.trim()) return;

    const item = createItem({
      title: form.title || form.body.split("\n")[0],
      body: form.body,
    });

    updateItems((items) => [item, ...items]);
    setForm(EMPTY_FORM);
  }

  function toggleItem(itemId) {
    updateItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, done: !item.done, updatedAt: new Date().toISOString() }
          : item
      )
    );
  }

  function deleteItem(itemId) {
    updateItems((items) => items.filter((item) => item.id !== itemId));
  }

  async function logout() {
    try {
      await ohmeshFetch("/auth/logout", { method: "POST" });
    } finally {
      clearRemoteState();
      setAuthState({
        status: "signed-out",
        user: null,
        app: null,
        message: "Signed out",
      });
      setSyncState({ status: "local", message: "Local" });
    }
  }

  function login(provider) {
    if (picoState.items.length > 0) markPendingLocalSync();
    window.location.href = createLoginUrl(provider);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">jjgo.io</p>
          <h1>{APP_NAME}</h1>
        </div>

        <div className="topbar-actions">
          <StatusBadge authState={authState} syncState={syncState} />
          {authState.status === "signed-in" ? (
            <button className="button ghost" type="button" onClick={logout}>
              <LogOut aria-hidden="true" size={18} />
              Log out
            </button>
          ) : (
            <div className="login-group" aria-label="Login providers">
              <button className="button" type="button" onClick={() => login("google")}>
                <LogIn aria-hidden="true" size={18} />
                Google
              </button>
              <button className="button ghost" type="button" onClick={() => login("github")}>
                GitHub
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="toolbar" aria-label="Pico controls">
        <label className="search-box">
          <Search aria-hidden="true" size={18} />
          <span className="sr-only">Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            type="search"
          />
        </label>
        <button className="icon-button" type="button" onClick={loadAuthState} aria-label="Refresh">
          <RefreshCw aria-hidden="true" size={18} />
        </button>
      </section>

      <form className="composer" onSubmit={addItem}>
        <input
          value={form.title}
          onChange={(event) => setForm((currentForm) => ({ ...currentForm, title: event.target.value }))}
          placeholder="Title"
          maxLength={120}
        />
        <textarea
          value={form.body}
          onChange={(event) => setForm((currentForm) => ({ ...currentForm, body: event.target.value }))}
          placeholder="Body"
          rows={4}
        />
        <button className="button primary" type="submit">
          <Plus aria-hidden="true" size={18} />
          Add
        </button>
      </form>

      <section className="content-grid" aria-label="Pico items">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <article className={item.done ? "item-card done" : "item-card"} key={item.id}>
              <button
                className="icon-button"
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-label={item.done ? "Mark open" : "Mark done"}
              >
                {item.done ? (
                  <CheckCircle2 aria-hidden="true" size={19} />
                ) : (
                  <Circle aria-hidden="true" size={19} />
                )}
              </button>
              <div className="item-body">
                <h2>{item.title}</h2>
                {item.body ? <p>{item.body}</p> : null}
                <time dateTime={item.updatedAt}>{formatShortDate(item.updatedAt)}</time>
              </div>
              <button
                className="icon-button danger"
                type="button"
                onClick={() => deleteItem(item.id)}
                aria-label="Delete"
              >
                <Trash2 aria-hidden="true" size={18} />
              </button>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <Database aria-hidden="true" size={22} />
            <span>No items</span>
          </div>
        )}
      </section>
    </main>
  );
}

function StatusBadge({ authState, syncState }) {
  const label =
    authState.status === "signed-in"
      ? `${userLabel(authState.user)} · ${syncState.message}`
      : authState.message || syncState.message;

  return (
    <span className={`status-badge ${syncState.status}`} title={label}>
      <Database aria-hidden="true" size={15} />
      {label}
    </span>
  );
}

function formatShortDate(value) {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}
