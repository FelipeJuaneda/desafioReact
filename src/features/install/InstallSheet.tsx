import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  RiAddBoxLine,
  RiBookmarkLine,
  RiCloseLine,
  RiFlashlightLine,
  RiWifiOffLine,
} from "@remixicon/react";
import { m } from "motion/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { iosBrowserHasTopShare, promptInstall, type InstallMethod } from "./installState";

/** Phone or computer: the copy says where the app will live. */
const COPY = {
  phone: {
    title: "PelicuLed en tu inicio",
    first: "Abre al instante, desde tu pantalla de inicio",
  },
  desktop: {
    title: "PelicuLed como app",
    first: "Abre al instante, en su propia ventana y sin pestañas",
  },
};

const benefits = (first: string) => [
  { icon: RiFlashlightLine, text: first },
  { icon: RiWifiOffLine, text: "Funciona sin conexión con lo que ya viste" },
  { icon: RiBookmarkLine, text: "Tu lista y tus plataformas, siempre a mano" },
];

/** iOS's share glyph (a tray with an arrow up), drawn because no icon set matches it. */
const IosShareIcon = () => (
  <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor">
    <path d="M12 3v12M8 7l4-4 4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 10H5v11h14V10h-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Step = ({ number, children }: { number: string; children: ReactNode }) => (
  <li className="flex items-center gap-3 text-body text-emulsion">
    <span className="grid size-8 shrink-0 place-items-center rounded-perf border border-edge font-code text-code font-medium text-edge tabular-nums">
      {number}
    </span>
    <span className="flex flex-wrap items-center gap-x-1.5">{children}</span>
  </li>
);

const Keycap = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-perf border border-control-line bg-leader px-2 py-0.5 font-semibold [&_svg]:size-5">
    {children}
  </span>
);

interface InstallSheetProps {
  open: boolean;
  method: InstallMethod;
  onClose: () => void;
}

/**
 * The invitation to install, printed as a cinema ticket: the admission (what you get) above
 * the tear line, the stub (how to get it) below. A bottom sheet on phones, a card elsewhere.
 */
export const InstallSheet = ({ open, method, onClose }: InstallSheetProps) => {
  const copy = COPY[window.matchMedia("(min-width: 48rem)").matches ? "desktop" : "phone"];
  return (
    <Dialog open={open} onClose={onClose} className="relative z-(--z-dialog)">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-leader/85 transition-opacity duration-(--duration-slow) data-closed:opacity-0 motion-reduce:transition-none"
      />
      <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-(--spacing-gutter)">
        <DialogPanel
          transition
          className="relative w-full max-w-md pb-[env(safe-area-inset-bottom)] transition duration-(--duration-slow) ease-out data-closed:translate-y-full data-closed:opacity-0 motion-reduce:transition-none sm:data-closed:translate-y-6"
        >
          {/* The admission: what installing gets you. */}
          <div className="relative grid gap-5 rounded-t-sheet border border-b-0 border-frameline bg-acetate px-6 pt-6 pb-7">
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label="Cerrar"
              onClick={onClose}
              className="absolute top-3 right-3"
            >
              <RiCloseLine aria-hidden />
            </Button>
            <div className="flex items-center gap-4 pr-10">
              <img
                src="/icon-192.png"
                alt=""
                width={64}
                height={64}
                className="size-16 rounded-sheet outline outline-1 -outline-offset-1 outline-frameline"
              />
              <div className="grid gap-1">
                <DialogTitle className="font-display text-display-md leading-none font-extrabold text-balance text-emulsion uppercase">
                  {copy.title}
                </DialogTitle>
                <p className="text-small text-emulsion-muted">Gratis, sin tienda de apps.</p>
              </div>
            </div>
            <ul className="grid gap-3">
              {benefits(copy.first).map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-body text-emulsion">
                  <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-edge" />
                  {text}
                </li>
              ))}
            </ul>
            {/* The stamp lands once the ticket is in place. */}
            <m.p
              aria-hidden
              initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ delay: 0.32, duration: DURATION.base, ease: EASE_OUT }}
              className="absolute right-6 -bottom-4 z-10 rounded-perf border-2 border-edge bg-acetate px-2 py-1 font-code text-code font-medium text-edge uppercase [font-stretch:75%]"
            >
              Admite uno
            </m.p>
          </div>

          {/* The tear line: a dashed cut between two punched notches. */}
          <div aria-hidden className="relative h-0 border-x border-frameline">
            <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full border border-frameline bg-leader" />
            <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full border border-frameline bg-leader" />
            <span className="absolute inset-x-4 top-0 border-t-2 border-dashed border-frameline" />
          </div>

          {/* The stub: how to get it on this device. */}
          <div className="grid gap-4 rounded-b-sheet border border-t-0 border-frameline bg-acetate-raised px-6 pt-7 pb-6 max-sm:rounded-b-none">
            {method === "ios" ? (
              <>
                <p className="font-code text-code font-medium text-emulsion-muted uppercase [font-stretch:75%]">
                  En iPhone y iPad
                </p>
                <ol className="grid gap-3">
                  <Step number="01">
                    Tocá
                    <Keycap>
                      <IosShareIcon />
                      Compartir
                    </Keycap>
                    {iosBrowserHasTopShare() ? "arriba, en la barra" : "abajo, en Safari"}
                  </Step>
                  <Step number="02">
                    Elegí
                    <Keycap>
                      <RiAddBoxLine aria-hidden />
                      Agregar a inicio
                    </Keycap>
                  </Step>
                </ol>
                <Button variant="secondary" onClick={onClose}>
                  Entendido
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    void promptInstall().finally(onClose);
                  }}
                >
                  Instalar app
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Ahora no
                </Button>
              </>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default InstallSheet;
