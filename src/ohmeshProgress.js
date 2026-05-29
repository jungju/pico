import { ohmeshConfig } from "./ohmeshAuth";

export const FIND_LEARN_PROGRESS_RECORD_TYPE = "find-learn-progress";
export const PICO_PROGRESS_RECORD_TYPE = "pico-progress";

export function emptyFindLearnProgress() {
  return {
    version: 1,
    stages: {},
  };
}

export function emptyPicoProgress() {
  return {
    version: 2,
    totalPoints: 0,
    streak: {
      current: 0,
      longest: 0,
      lastQualifiedDate: null,
      lastRewardDate: null,
    },
    games: {},
    stages: {},
  };
}

export async function loadFindLearnProgress({ signal } = {}) {
  return loadProgressRecord({
    emptyData: emptyFindLearnProgress(),
    normalizeData: normalizeFindLearnProgressData,
    recordType: FIND_LEARN_PROGRESS_RECORD_TYPE,
    signal,
  });
}

export async function saveFindLearnProgress({ recordId, data, signal } = {}) {
  return saveProgressRecord({
    data,
    recordId,
    recordType: FIND_LEARN_PROGRESS_RECORD_TYPE,
    signal,
  });
}

export async function loadPicoProgress({ signal } = {}) {
  return loadProgressRecord({
    emptyData: emptyPicoProgress(),
    normalizeData: normalizePicoProgressData,
    recordType: PICO_PROGRESS_RECORD_TYPE,
    signal,
  });
}

export async function savePicoProgress({ recordId, data, signal } = {}) {
  return saveProgressRecord({
    data: normalizePicoProgressData(data),
    recordId,
    recordType: PICO_PROGRESS_RECORD_TYPE,
    signal,
  });
}

async function loadProgressRecord({ emptyData, normalizeData, recordType, signal }) {
  const url = recordsUrl();
  url.searchParams.set("type", recordType);
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
      data: emptyData,
    };
  }

  const body = await readJson(response);

  if (!response.ok) {
    throw progressError(body?.error || "ohmesh progress load failed", response.status);
  }

  const record = body?.records?.[0] || null;

  return {
    record,
    data: normalizeData(record?.data),
  };
}

async function saveProgressRecord({ recordId, recordType, data, signal }) {
  const url = recordId ? recordUrl(recordId) : recordsUrl();
  const response = await fetch(url, {
    method: recordId ? "PATCH" : "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recordId ? { data } : { type: recordType, data }),
    signal,
  });

  const body = await readJson(response);

  if (!response.ok) {
    throw progressError(body?.error || "ohmesh progress save failed", response.status);
  }

  return body;
}

function normalizeFindLearnProgressData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return emptyFindLearnProgress();
  }

  const stages = data.stages && typeof data.stages === "object" && !Array.isArray(data.stages) ? data.stages : {};

  return {
    version: 1,
    stages,
  };
}

function normalizePicoProgressData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return emptyPicoProgress();
  }

  const empty = emptyPicoProgress();

  return {
    version: 2,
    totalPoints: toNonNegativeNumber(data.totalPoints, empty.totalPoints),
    streak: normalizeStreak(data.streak),
    games: normalizeRecordMap(data.games),
    stages: normalizeRecordMap(data.stages),
  };
}

function normalizeStreak(streak) {
  if (!streak || typeof streak !== "object" || Array.isArray(streak)) {
    return emptyPicoProgress().streak;
  }

  return {
    current: toNonNegativeNumber(streak.current, 0),
    longest: toNonNegativeNumber(streak.longest, 0),
    lastQualifiedDate: typeof streak.lastQualifiedDate === "string" ? streak.lastQualifiedDate : null,
    lastRewardDate: typeof streak.lastRewardDate === "string" ? streak.lastRewardDate : null,
  };
}

function normalizeRecordMap(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function toNonNegativeNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
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
