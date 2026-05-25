const DEFAULT_OHMESH_BASE_URL = "https://ohmesh.jjgo.io";
const DEFAULT_OHMESH_APP_SLUG = "pico";
const OAUTH_RESULT_PARAMS = ["ohmesh_login", "ohmesh_logout"];

export const ohmeshConfig = {
  baseUrl: trimTrailingSlash(import.meta.env.VITE_OHMESH_BASE_URL || DEFAULT_OHMESH_BASE_URL),
  appSlug: import.meta.env.VITE_OHMESH_APP_SLUG || DEFAULT_OHMESH_APP_SLUG,
};

export function buildOhmeshLoginUrl() {
  const url = buildOhmeshUrl("login");
  url.searchParams.set("app", ohmeshConfig.appSlug);
  url.searchParams.set("redirect_url", currentAppUrl());
  return url.toString();
}

export function buildOhmeshLogoutUrl() {
  const url = buildOhmeshUrl("logout");
  url.searchParams.set("app", ohmeshConfig.appSlug);
  url.searchParams.set("redirect_url", currentAppUrl());
  return url.toString();
}

export async function fetchOhmeshSession({ signal } = {}) {
  const url = buildOhmeshUrl("auth/me");
  url.searchParams.set("app", ohmeshConfig.appSlug);

  const response = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });

  if (response.status === 401) {
    return null;
  }

  const data = await readJson(response);

  if (!response.ok) {
    throw sessionError(data?.error || "ohmesh session check failed", response.status);
  }

  if (data?.app?.slug !== ohmeshConfig.appSlug) {
    throw sessionError("ohmesh session belongs to another app", 403);
  }

  return data;
}

export function removeOhmeshResultParams() {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  let changed = false;

  for (const param of OAUTH_RESULT_PARAMS) {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      changed = true;
    }
  }

  if (changed) {
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }
}

function buildOhmeshUrl(path) {
  return new URL(path, `${ohmeshConfig.baseUrl}/`);
}

function currentAppUrl() {
  const url = new URL(window.location.href);
  url.hash = "";

  for (const param of OAUTH_RESULT_PARAMS) {
    url.searchParams.delete(param);
  }

  return url.toString();
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function sessionError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function trimTrailingSlash(value) {
  return String(value).trim().replace(/\/+$/, "");
}
