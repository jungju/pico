import { INITIAL_STATE } from "./constants";

export function createItem({ title, body }) {
  const now = new Date().toISOString();

  return {
    id: `pico-${Math.random().toString(36).slice(2, 10)}`,
    title: title.trim(),
    body: body.trim(),
    done: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeState(value) {
  const source = value && typeof value === "object" ? value : {};
  const items = Array.isArray(source.items) ? source.items : [];

  return {
    v: 1,
    items: items
      .map(normalizeItem)
      .filter(Boolean)
      .sort((firstItem, secondItem) => {
        if (firstItem.done !== secondItem.done) return firstItem.done ? 1 : -1;
        return new Date(secondItem.updatedAt).getTime() - new Date(firstItem.updatedAt).getTime();
      }),
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : null,
  };
}

function normalizeItem(item) {
  if (!item || typeof item !== "object") return null;

  const title = typeof item.title === "string" ? item.title.trim() : "";
  const body = typeof item.body === "string" ? item.body.trim() : "";

  if (!title && !body) return null;

  const now = new Date().toISOString();

  return {
    id: typeof item.id === "string" && item.id ? item.id : `pico-${Math.random().toString(36).slice(2, 10)}`,
    title: title || body.split("\n")[0].slice(0, 80) || "Untitled",
    body,
    done: Boolean(item.done),
    createdAt: typeof item.createdAt === "string" ? item.createdAt : now,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : now,
  };
}

export function touchState(state, items) {
  return normalizeState({
    ...state,
    items,
    updatedAt: new Date().toISOString(),
  });
}

export function mergeStates(localState, remoteState) {
  const byId = new Map();

  for (const item of normalizeState(remoteState).items) {
    byId.set(item.id, item);
  }

  for (const item of normalizeState(localState).items) {
    const existingItem = byId.get(item.id);
    if (!existingItem || new Date(item.updatedAt) > new Date(existingItem.updatedAt)) {
      byId.set(item.id, item);
    }
  }

  return normalizeState({
    ...INITIAL_STATE,
    items: [...byId.values()],
    updatedAt: new Date().toISOString(),
  });
}
