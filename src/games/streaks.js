const DAY_MS = 24 * 60 * 60 * 1000;

export function qualifyDailyVisit(progress, { now = new Date() } = {}) {
  const today = localDateKey(now);
  const nextProgress = cloneProgress(progress);
  const lastQualifiedDate = nextProgress.streak.lastQualifiedDate;

  if (lastQualifiedDate === today) {
    return {
      progress: nextProgress,
      qualified: false,
    };
  }

  const nextCurrent = isYesterday(lastQualifiedDate, today) ? nextProgress.streak.current + 1 : 1;

  nextProgress.streak = {
    ...nextProgress.streak,
    current: nextCurrent,
    longest: Math.max(nextProgress.streak.longest, nextCurrent),
    lastQualifiedDate: today,
  };

  return {
    progress: nextProgress,
    qualified: true,
  };
}

export function localDateKey(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isYesterday(previousDateKey, todayKey) {
  if (!previousDateKey) return false;

  const previousDate = localDateFromKey(previousDateKey);
  const todayDate = localDateFromKey(todayKey);

  if (!previousDate || !todayDate) return false;

  return dateUtcTime(todayDate) - dateUtcTime(previousDate) === DAY_MS;
}

function localDateFromKey(dateKey) {
  const [year, month, day] = String(dateKey).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function dateUtcTime(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function cloneProgress(progress) {
  return {
    ...progress,
    streak: {
      current: toNonNegativeNumber(progress?.streak?.current, 0),
      longest: toNonNegativeNumber(progress?.streak?.longest, 0),
      lastQualifiedDate: progress?.streak?.lastQualifiedDate || null,
      lastRewardDate: progress?.streak?.lastRewardDate || null,
    },
  };
}

function toNonNegativeNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}
