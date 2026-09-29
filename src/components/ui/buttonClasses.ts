import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Square button that only shows an icon; requires an aria-label. */
  iconOnly?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-aperture font-body font-bold tracking-[0.01em] " +
  "transition-colors duration-(--duration-fast) ease-out select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge " +
  "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed [&_svg]:size-5 [&_svg]:shrink-0";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-edge text-on-edge hover:bg-edge-hover active:bg-emulsion " +
    "disabled:bg-acetate-raised disabled:text-emulsion-subtle",
  secondary:
    "border border-control-line text-emulsion hover:border-emulsion-muted hover:bg-acetate " +
    "aria-pressed:border-edge aria-pressed:text-edge disabled:text-emulsion-subtle",
  ghost: "text-emulsion hover:bg-acetate disabled:text-emulsion-subtle",
};

const sizes: Record<ButtonSize, { text: string; icon: string }> = {
  md: { text: "min-h-12 px-5 text-[0.9375rem]", icon: "size-12" },
  sm: { text: "min-h-11 px-4 text-small", icon: "size-11" },
};

/** Button look, shared by <Button> and link-shaped buttons. */
export const buttonClasses = ({
  variant = "primary",
  size = "md",
  iconOnly,
  className,
}: ButtonStyleProps) =>
  cn(base, variants[variant], iconOnly ? sizes[size].icon : sizes[size].text, className);
