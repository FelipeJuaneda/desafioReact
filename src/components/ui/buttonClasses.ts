import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";
export type ButtonTone = "projection" | "lighttable";

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ground the button sits on: dark projection (default) or the light table. */
  tone?: ButtonTone;
  /** Square button that only shows an icon; requires an aria-label. */
  iconOnly?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-aperture font-body font-bold tracking-[0.01em] " +
  "transition-colors duration-(--duration-fast) ease-out select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed [&_svg]:size-5 [&_svg]:shrink-0";

const variants: Record<ButtonTone, Record<ButtonVariant, string>> = {
  projection: {
    primary:
      "bg-edge text-on-edge hover:bg-edge-hover active:bg-emulsion focus-visible:outline-edge " +
      "disabled:bg-acetate-raised disabled:text-emulsion-subtle",
    secondary:
      "border border-control-line text-emulsion hover:border-emulsion-muted hover:bg-acetate " +
      "focus-visible:outline-edge aria-pressed:border-edge aria-pressed:text-edge disabled:text-emulsion-subtle",
    ghost:
      "text-emulsion hover:bg-acetate focus-visible:outline-edge disabled:text-emulsion-subtle",
  },
  // On the light table the focus ring is ink: amber on cream would not reach 3:1.
  lighttable: {
    primary:
      "bg-lt-ink text-lt-ground hover:bg-lt-muted focus-visible:outline-lt-ink " +
      "disabled:bg-lt-line disabled:text-lt-muted",
    secondary:
      "border border-lt-control-line text-lt-ink hover:border-lt-ink hover:bg-lt-ground " +
      "focus-visible:outline-lt-ink disabled:text-lt-muted aria-pressed:border-lt-ink aria-pressed:bg-lt-ink " +
      "aria-pressed:text-lt-ground aria-pressed:hover:bg-lt-muted",
    ghost: "text-lt-ink hover:bg-lt-ground focus-visible:outline-lt-ink disabled:text-lt-muted",
  },
};

const sizes: Record<ButtonSize, { text: string; icon: string }> = {
  md: { text: "min-h-12 px-5 text-[0.9375rem]", icon: "size-12" },
  sm: { text: "min-h-11 px-4 text-small", icon: "size-11" },
};

/** Button look, shared by <Button> and link-shaped buttons. */
export const buttonClasses = ({
  variant = "primary",
  size = "md",
  tone = "projection",
  iconOnly,
  className,
}: ButtonStyleProps) =>
  cn(base, variants[tone][variant], iconOnly ? sizes[size].icon : sizes[size].text, className);
