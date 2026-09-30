import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { RiErrorWarningLine } from "@remixicon/react";
import { cn } from "@/lib/cn";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  /** Element placed inside the input on the right (e.g. show-password button). */
  trailing?: ReactNode;
}

export const Field = ({ label, hint, error, trailing, className, ...input }: FieldProps) => {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={id} className="text-[0.9375rem] font-semibold text-emulsion">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "min-h-12 w-full rounded-aperture border px-3.5 py-3 font-body text-body",
            "border-control-line bg-leader text-emulsion placeholder:text-emulsion-subtle hover:border-emulsion-muted",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge aria-invalid:border-danger",
            trailing ? "pr-14" : undefined,
          )}
          {...input}
        />
        {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
      </div>
      {message && (
        <p
          id={messageId}
          className={cn(
            "flex items-start gap-1.5 text-small",
            error ? "text-danger" : "text-emulsion-muted",
          )}
        >
          {error && <RiErrorWarningLine aria-hidden className="mt-0.5 size-4 shrink-0" />}
          {message}
        </p>
      )}
    </div>
  );
};
