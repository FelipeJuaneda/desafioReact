// The installable app: registers the service worker once the page is idle (it then caches the
// whole app for offline use) and offers new versions instead of swapping them under the viewer.
import { toast } from "sonner";

const whenIdle = (task: () => void) =>
  "requestIdleCallback" in window
    ? window.requestIdleCallback(task, { timeout: 5000 })
    : setTimeout(task, 3000);

export const startPwa = () => {
  // Development serves unbundled modules; automated browsers mock the network themselves.
  if (import.meta.env.DEV || navigator.webdriver || !("serviceWorker" in navigator)) return;

  whenIdle(() => {
    void import("virtual:pwa-register").then(({ registerSW }) => {
      const update = registerSW({
        onNeedRefresh: () =>
          toast("Hay una versión nueva de PelicuLed", {
            description: "Actualizá para ver lo último.",
            duration: Infinity,
            action: { label: "Actualizar", onClick: () => void update(true) },
          }),
        onOfflineReady: () =>
          toast("PelicuLed ya funciona sin conexión", {
            description: "Lo que ya viste y tu lista quedan disponibles.",
          }),
      });
    });
  });

  window.addEventListener("offline", () =>
    toast("Sin conexión", { description: "Te mostramos lo último que viste." }),
  );
  window.addEventListener("online", () => toast("Volviste a estar en línea"));
};
