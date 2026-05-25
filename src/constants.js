export const APP_NAME = "Pico";
export const OHMESH_BASE_URL =
  import.meta.env.VITE_OHMESH_BASE_URL?.replace(/\/+$/, "") || "https://ohmesh.jjgo.io";
export const OHMESH_APP_SLUG = import.meta.env.VITE_OHMESH_APP_SLUG || "pico";
export const RECORD_TYPE = "pico-state";
export const LOCAL_STORAGE_KEY = "pico:v1:state";
export const PENDING_LOCAL_SYNC_KEY = "pico:v1:pending-local-sync";
export const INITIAL_STATE = {
  v: 1,
  items: [],
  updatedAt: null,
};
