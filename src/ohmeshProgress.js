import { ohmeshConfig } from "./ohmeshAuth";

export const FIND_LEARN_PROGRESS_RECORD_TYPE = "find-learn-progress";

export function emptyFindLearnProgress() {
  return {
    version: 1,
    stages: {},
  };
}

export async function loadFindLearnProgress({ signal } = {}) {
  const url = recordsUrl();
  url.searchParams.set("type", FIND_LEARN_PROGRESS_RECORD_TYPE);
  url.searchParams.set("limit", "1");
  url.searchParams.set("offset", "0");

  const response = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });

  if (response.status === 401) {
    return {
      record: null,
      data: emptyFindLearnProgress(),
    };
  }

  const body = await readJson(response);

  if (!response.ok) {
    throw progressError(body?.error || "ohmesh progress load failed", response.status);
  }

  const record = body?.records?.[0] || null;

  return {
    record,
    data: normalizeProgressData(record?.data),
  };
}

export async function saveFindLearnProgress({ recordId, data, signal } = {}) {
  const url = recordId ? recordUrl(recordId) : recordsUrl();
  const response = await fetch(url, {
    method: recordId ? "PATCH" : "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recordId ? { data } : { type: FIND_LEARN_PROGRESS_RECORD_TYPE, data }),
    signal,
  });

  const body = await readJson(response);

  if (!response.ok) {
    throw progressError(body?.error || "ohmesh progress save failed", response.status);
  }

  return body;
}

function normalizeProgressData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return emptyFindLearnProgress();
  }

  const stages = data.stages && typeof data.stages === "object" && !Array.isArray(data.stages) ? data.stages : {};

  return {
    version: 1,
    stages,
  };
}

function recordsUrl() {
  return new URL(`api/apps/${encodeURIComponent(ohmeshConfig.appSlug)}/records`, `${ohmeshConfig.baseUrl}/`);
}

function recordUrl(recordId) {
  return new URL(
    `api/apps/${encodeURIComponent(ohmeshConfig.appSlug)}/records/${encodeURIComponent(recordId)}`,
    `${ohmeshConfig.baseUrl}/`,
  );
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function progressError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}
