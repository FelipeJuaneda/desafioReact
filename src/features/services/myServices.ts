// "Mis plataformas": the streaming services the viewer has, chosen once and used across the
// app (catalog filter, "Lo tenés" on title pages, the recommender's last question). Kept on the
// device, so it works without an account.
import { useSyncExternalStore } from "react";

const KEY = "peliculed:services";
const EVENT = "peliculed:services";

/** Subscription and free services that matter in Argentina, in TMDB's AR order. */
export const SERVICES = [8, 119, 337, 1899, 350, 531, 2302, 11] as const;

const isService = (id: unknown): id is number =>
  typeof id === "number" && (SERVICES as readonly number[]).includes(id);

const readRaw = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

const parse = (raw: string | null): number[] => {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? [...new Set(parsed.filter(isService))] : [];
  } catch {
    return [];
  }
};

// useSyncExternalStore needs the same array while nothing changed: cache it by the raw value.
let cache: { raw: string | null; value: number[] } | null = null;
const getSnapshot = () => {
  const raw = readRaw();
  if (cache?.raw !== raw) cache = { raw, value: parse(raw) };
  return cache.value;
};
const EMPTY: number[] = [];

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  // Another tab changed them.
  const onStorage = (event: StorageEvent) => event.key === KEY && onChange();
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
};

export const setMyServices = (ids: number[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify([...new Set(ids.filter(isService))]));
  } catch {
    // Private mode or full storage: nothing to keep it in.
  }
  window.dispatchEvent(new Event(EVENT));
};

/** The viewer's services (TMDB provider ids), [] until they choose. */
export const useMyServices = () => useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
