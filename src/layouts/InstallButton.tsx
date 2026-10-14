import { useEffect, useState } from "react";

/** Chrome / Edge / Android's install event (not in TypeScript's DOM types yet). */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * "Instalar la app": shown only when the browser offers installation and PelicuLed isn't
 * already running installed. Safari has no install event, so it never shows there.
 */
export const InstallButton = () => {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const offer = (event: Event) => {
      // Keep the browser's own mini-infobar from popping up: the footer offers it instead.
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const installed = () => setPrompt(null);
    window.addEventListener("beforeinstallprompt", offer);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", offer);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  if (!prompt) return null;
  return (
    <button
      type="button"
      onClick={() => {
        void prompt.prompt();
        void prompt.userChoice.finally(() => setPrompt(null));
      }}
      className="min-h-11 rounded-perf font-semibold text-edge underline decoration-edge/40 underline-offset-4 hover:decoration-edge focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
    >
      Instalar la app
    </button>
  );
};
