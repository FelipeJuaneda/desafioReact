import type { ReactNode } from "react";
import { EdgeCode } from "@/components/ui/EdgeCode";

interface EndOfReelProps {
  /** Printed on the edge code, e.g. "404". */
  code: string;
  title: string;
  children: ReactNode;
  actions: ReactNode;
}

/**
 * Dead ends as the last frame of a reel: the projected scope frame with "Fin" on it,
 * the error code on the edge, and a way back.
 */
export const EndOfReel = ({ code, title, children, actions }: EndOfReelProps) => (
  <div className="mx-auto grid max-w-(--container-reel) gap-4 px-(--spacing-gutter) pt-6 pb-16 text-emulsion lg:pt-10">
    <div
      aria-hidden
      className="grid aspect-[2.39/1] place-items-center rounded-aperture bg-black outline -outline-offset-1 outline-frameline"
    >
      <p className="font-display text-[clamp(4.5rem,16vw,11rem)] leading-none font-extrabold text-emulsion uppercase">
        Fin
      </p>
    </div>
    <EdgeCode items={[{ label: code, emphasis: true }, { label: "Fin del rollo" }]} />
    <h1 className="max-w-[20ch] font-display text-display-xl font-extrabold text-balance uppercase">
      {title}
    </h1>
    <div className="max-w-[60ch] text-body-lg text-emulsion-muted">{children}</div>
    <div className="flex flex-wrap gap-3 pt-2">{actions}</div>
  </div>
);
