import {
  LOCAL_STORAGE_KEY,
  OHMESH_APP_SLUG,
  OHMESH_BASE_URL,
  PENDING_LOCAL_SYNC_KEY,
} from "./constants";
import { normalizeState } from "./picoState";

export function readRoutePath() {
  if (typeof window === "undefined") return "/";

  const searchParams = new URLSearchParams(window.location.search);
  const redirectedPath = searchParams.get("path");

  if (redirectedPath) {
    window.history.replaceState({}, "", redirectedPath);
  }

  return window.location.pathname || "/";
}

export function readLocalState() {
  if (typeof window === "undefined") return normalizeState(null);

  try {
    return normalizeState(JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"));
  } catch {
    return normalizeState(null);
  }
}

export function writeLocalState(state) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalizeState(state)));
  } catch {
    // Local storage failure should not block the current editing session.
  }
}

export function markPendingLocalSync() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PENDING_LOCAL_SYNC_KEY, "1");
  } catch {
    // Login can continue without the pending marker.
  }
}

export function hasPendingLocalSync() {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(PENDING_LOCAL_SYNC_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearPendingLocalSync() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(PENDING_LOCAL_SYNC_KEY);
  } catch {
    // The next successful sync can clear it again.
  }
}

function currentRedirectUrl() {
  if (typeof window === "undefined") return "https://pico.jjgo.io/";

  const url = new URL(window.location.href);
  url.hash = "";
  return url.toString();
}

export function createLoginUrl(provider) {
  const url = new URL(`/auth/${provider}/login`, OHMESH_BASE_URL);
  url.searchParams.set("app", OHMESH_APP_SLUG);
  url.searchParams.set("redirect_url", currentRedirectUrl());
  return url.toString();
}

export function ohmeshFetch(path, options = {}) {
  return fetch(`${OHMESH_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
  });
}

export async function readResponseJson(response) {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function getResponseErrorMessage(response, fallbackMessage) {
  const errorBody = await readResponseJson(response);
  return errorBody?.error || fallbackMessage || `ohmesh request failed (${response.status})`;
}

export function selectLatestRecord(records) {
  return [...records].sort((firstRecord, secondRecord) => {
    const firstTime = new Date(firstRecord.updated_at || firstRecord.created_at || 0).getTime();
    const secondTime = new Date(secondRecord.updated_at || secondRecord.created_at || 0).getTime();
    return secondTime - firstTime;
  })[0] || null;
}

export function userLabel(user) {
  return user?.name || user?.email || "Signed in";
}
