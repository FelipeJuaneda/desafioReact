import { openInstallSheet, useInstallMethod } from "@/features/install/installState";

/** "Descargar app": shown wherever PelicuLed can be installed and isn't yet. */
export const InstallButton = ({ className }: { className?: string }) => {
  const method = useInstallMethod();
  if (!method) return null;
  return (
    <button
      type="button"
      onClick={openInstallSheet}
      className={
        className ??
        "min-h-11 rounded-perf font-semibold text-edge underline decoration-edge/40 underline-offset-4 hover:decoration-edge focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
      }
    >
      Descargar app
    </button>
  );
};
