import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";
import { buttonClasses, type ButtonStyleProps } from "@/components/ui/buttonClasses";

type ButtonProps = ButtonStyleProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

export const Button = ({
  variant,
  size,
  iconOnly,
  className,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={buttonClasses({ variant, size, iconOnly, className })}
    {...props}
  />
);

/** A link that looks like a button: navigation stays a real <a>. */
export const ButtonLink = ({
  variant,
  size,
  iconOnly,
  className,
  ...props
}: ButtonStyleProps & LinkProps) => (
  <Link className={buttonClasses({ variant, size, iconOnly, className })} {...props} />
);
