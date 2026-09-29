import { RiErrorWarningLine, RiGoogleFill } from "@remixicon/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface AuthLayoutProps {
  title: string;
  lead: ReactNode;
  children: ReactNode;
  /** Links to the sibling screens (sign up, sign in…), under the sheet. */
  footer?: ReactNode;
}

/** Account screens: one sheet laid on the light table, nothing else competing with the form. */
export const AuthLayout = ({ title, lead, children, footer }: AuthLayoutProps) => (
  <div className="min-h-[calc(100dvh-4rem)] bg-lt-ground px-(--spacing-gutter) pt-8 pb-16 text-lt-ink [color-scheme:light] selection:bg-lt-ink selection:text-lt-ground sm:pt-16">
    <title>{`${title} · PelicuLed`}</title>
    <div className="mx-auto grid max-w-md gap-6">
      <section
        aria-labelledby="auth-title"
        className="grid gap-6 rounded-sheet bg-lt-surface p-6 shadow-strip sm:p-8"
      >
        <header className="grid gap-2">
          <h1 id="auth-title" className="font-display text-display-lg font-extrabold uppercase">
            {title}
          </h1>
          <p className="text-body text-lt-muted">{lead}</p>
        </header>
        {children}
      </section>
      {footer && (
        <div className="grid gap-2 px-2 text-center text-body text-lt-muted">{footer}</div>
      )}
    </div>
  </div>
);

/** Problems with the whole form (Firebase said no), announced as soon as they appear. */
export const FormAlert = ({ children }: { children?: ReactNode }) => (
  <div role="alert" className="empty:hidden">
    {children && (
      <p className="flex items-start gap-2 rounded-aperture border-l-2 border-lt-danger bg-lt-ground p-3 text-body text-lt-ink">
        <RiErrorWarningLine aria-hidden className="mt-0.5 size-5 shrink-0 text-lt-danger" />
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
    <div aria-hidden className="flex items-center gap-3 text-small text-lt-muted">
      <span className="h-px flex-1 bg-lt-line" />o<span className="h-px flex-1 bg-lt-line" />
    </div>
    <Button variant="secondary" tone="lighttable" onClick={onClick} disabled={disabled}>
      <RiGoogleFill aria-hidden />
      Continuar con Google
    </Button>
  </>
);

/** Inline link on the light table: ink, underlined, amber-free focus ring. */
export const authLinkClass =
  "font-semibold text-lt-ink underline decoration-lt-control-line underline-offset-4 hover:decoration-lt-ink " +
  "rounded-perf focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lt-ink";
