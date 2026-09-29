import { RiErrorWarningLine, RiGoogleFill } from "@remixicon/react";
import { m } from "motion/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { PosterStrip, PosterWall } from "@/features/auth/PosterWall";
import { DURATION, EASE_IN_OUT, EASE_OUT, RISE } from "@/lib/motion";

const pad = (n: number) => String(n).padStart(2, "0");
const today = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

/** Black-and-white clapper stripes, the one place the palette goes pure contrast. */
const STRIPES =
  "bg-[repeating-linear-gradient(-55deg,var(--color-emulsion)_0_1.1rem,var(--color-leader)_1.1rem_2.2rem)]";

/**
 * The clapper sticks. Each take remounts the top stick shut, and it swings open again: the clap
 * happens on every submit, and the first one opens the slate when the screen arrives.
 */
const Clapper = ({ take }: { take: number }) => (
  <div aria-hidden className="relative h-20">
    <div
      className={`absolute inset-x-0 bottom-0 h-8 rounded-t-aperture border border-b-0 border-frameline ${STRIPES}`}
    />
    <m.div
      key={take}
      className={`absolute inset-x-0 bottom-8 h-8 origin-[1.25rem_100%] rounded-aperture border border-frameline ${STRIPES} bg-position-[1.1rem_0]`}
      initial={{ rotate: 0 }}
      // A wide slate: a few degrees already lift the far end several centimetres.
      animate={{ rotate: -6 }}
      transition={{ duration: 0.7, delay: take === 1 ? 0.35 : 0.12, ease: EASE_IN_OUT }}
    />
    {/* Hinge */}
    <span className="absolute bottom-6 left-3 size-4 rounded-full border-2 border-frameline bg-acetate-raised" />
  </div>
);

const SlateCell = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <div className="grid h-full gap-0.5 bg-acetate px-4 py-2.5 sm:gap-1 sm:py-3">
    <span className="font-code text-code font-medium text-emulsion-subtle uppercase [font-stretch:75%]">
      {label}
    </span>
    <span
      className={`font-display text-[1.375rem] leading-none font-extrabold uppercase tabular-nums sm:text-[1.75rem] ${accent ? "text-edge" : "text-emulsion"}`}
    >
      {value}
    </span>
  </div>
);

interface AuthLayoutProps {
  /** The screen's big line ("Volvé a la sala"): the page's h1. */
  title: string;
  lead: ReactNode;
  /** Chalked on the slate: "Ingresar", "Registro"… */
  scene: string;
  /** Take number: goes up with every attempt. */
  take?: number;
  /** Browser tab title. */
  documentTitle: string;
  children: ReactNode;
  /** Links to the sibling screens, under the slate. */
  footer?: ReactNode;
}

/**
 * Account screens as a film set: the house full of this week's posters on one side, the slate
 * on the other. The form is written on the slate; every submit is a new take.
 */
export const AuthLayout = ({
  title,
  lead,
  scene,
  take = 1,
  documentTitle,
  children,
  footer,
}: AuthLayoutProps) => (
  <div className="relative min-h-[calc(100dvh-4rem)] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,40rem)]">
    <title>{`${documentTitle} · PelicuLed`}</title>
    <PosterWall className="sticky top-16 hidden h-[calc(100dvh-4rem)] lg:block" />

    <div className="grid content-start gap-7 px-(--spacing-gutter) pt-6 pb-16 lg:content-center lg:py-12 lg:pr-[max(var(--spacing-gutter),calc((100vw-90rem)/2+var(--spacing-gutter)))]">
      <PosterStrip className="-mx-(--spacing-gutter) h-32 lg:hidden" />

      <m.header
        className="grid gap-3"
        initial={RISE.initial}
        animate={RISE.animate}
        transition={RISE.transition}
      >
        <p className="font-code text-code font-medium text-edge uppercase [font-stretch:75%]">
          PelicuLed · Tu cuenta
        </p>
        <h1 className="font-display text-display-xl font-extrabold text-balance text-emulsion uppercase">
          {title}
        </h1>
        <p className="max-w-[46ch] text-body-lg text-emulsion-muted">{lead}</p>
      </m.header>

      <m.section
        aria-label={documentTitle}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow * 1.6, delay: 0.08, ease: EASE_OUT }}
      >
        <Clapper take={take} />
        <div className="rounded-b-sheet border border-frameline bg-acetate">
          {/* Chalk lines: the grid's 1px gaps show the frameline color behind the cells. */}
          <div
            aria-hidden
            className="grid grid-cols-2 gap-px border-b border-frameline bg-frameline sm:grid-cols-4"
          >
            <SlateCell label="Prod." value="PelicuLed" />
            <SlateCell label="Escena" value={scene} />
            <m.div
              key={take}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DURATION.base }}
            >
              <SlateCell label="Toma" value={pad(take)} accent />
            </m.div>
            <SlateCell label="Fecha" value={today.format(new Date())} />
          </div>
          <div className="p-5 sm:p-7">{children}</div>
        </div>
      </m.section>

      {footer && <div className="text-body text-emulsion-muted">{footer}</div>}
    </div>
  </div>
);

/** Problems with the whole form (Firebase said no), announced as soon as they appear. */
export const FormAlert = ({ children }: { children?: ReactNode }) => (
  <div role="alert" className="empty:hidden">
    {children && (
      <p className="flex items-start gap-2 rounded-aperture border-l-2 border-danger bg-leader p-3 text-body text-emulsion">
        <RiErrorWarningLine aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
        {children}
      </p>
    )}
  </div>
);

export const GoogleButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => (
  <>
    <div aria-hidden className="flex items-center gap-3 font-code text-code text-emulsion-subtle">
      <span className="h-px flex-1 bg-frameline" />O<span className="h-px flex-1 bg-frameline" />
    </div>
    <Button variant="secondary" onClick={onClick} disabled={disabled}>
      <RiGoogleFill aria-hidden />
      Continuar con Google
    </Button>
  </>
);

/** Inline link on the projection ground. */
export const authLinkClass =
  "font-semibold text-emulsion underline decoration-edge/50 underline-offset-4 hover:decoration-edge " +
  "rounded-perf focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge";
