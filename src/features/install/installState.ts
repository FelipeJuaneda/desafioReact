// Can PelicuLed be installed here, and how? Chrome, Edge and Android fire `beforeinstallprompt`
// (often before React mounts, so it is caught at startup and kept here); iPhone and iPad
// Safari never do and install through Share > "Agregar a inicio".
import { useSyncExternalStore } from "react";

/** Chrome / Edge / Android's install event (not in TypeScript's DOM types yet). */
export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallMethod = "prompt" | "ios" | null;

let deferred: InstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

/** Already running as the installed app (home screen icon, app window). */
export const isStandalone = () =>
  // matchMedia is missing in some embedded and test environments.
  window.matchMedia?.("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  // iPadOS reports itself as a Mac; touch gives it away.
  (/macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

/** Chrome, Firefox and Edge on iOS keep Share in their top bar; Safari keeps it at the bottom. */
export const iosBrowserHasTopShare = () => /CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

/** Call once at startup: keeps the install event for when the viewer asks for it. */
export const captureInstallPrompt = () => {
  window.addEventListener("beforeinstallprompt", (event) => {
    // No browser mini-infobar: PelicuLed offers it in its own words.
    event.preventDefault();
    deferred = event as InstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    deferred = null;
    notify();
  });
};

const method = (): InstallMethod => {
  if (installed || isStandalone()) return null;
  if (deferred) return "prompt";
  return isIos() ? "ios" : null;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** How this device installs the app, or null (installed already, or not installable). */
export const useInstallMethod = () => useSyncExternalStore(subscribe, method, () => null);

/** Shows the browser's own install dialog. Resolves true when the viewer accepted. */
export const promptInstall = async () => {
  if (!deferred) return false;
  const event = deferred;
  deferred = null;
  await event.prompt();
  const { outcome } = await event.userChoice;
  notify();
  return outcome === "accepted";
};

// The first-visit offer appears once; after that the "Descargar app" buttons stay.
const OFFERED_KEY = "peliculed:install-offered";

export const wasOffered = () => {
  try {
    return localStorage.getItem(OFFERED_KEY) !== null;
  } catch {
    return true;
  }
};

export const markOffered = () => {
  try {
    localStorage.setItem(OFFERED_KEY, new Date().toISOString());
  } catch {
    // Without storage it may show again next visit; harmless.
  }
};

// Any "Descargar app" button opens the same sheet, wherever it lives.
const OPEN_EVENT = "peliculed:install";
export const openInstallSheet = () => window.dispatchEvent(new Event(OPEN_EVENT));
export const onOpenInstallSheet = (handler: () => void) => {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
};
