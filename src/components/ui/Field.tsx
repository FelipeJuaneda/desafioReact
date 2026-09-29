import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { RiErrorWarningLine } from "@remixicon/react";
import { cn } from "@/lib/cn";

type Tone = "projection" | "lighttable";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  tone?: Tone;
  /** Element placed inside the input on the right (e.g. show-password button). */
  trailing?: ReactNode;
}

const tones: Record<Tone, { label: string; input: string; hint: string; error: string }> = {
  projection: {
    label: "text-emulsion",
    input:
      "border-control-line bg-leader text-emulsion placeholder:text-emulsion-subtle hover:border-emulsion-muted " +
      "focus-visible:outline-edge aria-invalid:border-danger",
    hint: "text-emulsion-muted",
    error: "text-danger",
  },
  lighttable: {
    label: "text-lt-ink",
    input:
      "border-lt-control-line bg-lt-surface text-lt-ink placeholder:text-lt-muted hover:border-lt-ink " +
      "focus-visible:outline-lt-ink aria-invalid:border-lt-danger",
    hint: "text-lt-muted",
    error: "text-lt-danger",
  },
};

export const Field = ({
  label,
  hint,
  error,
  tone = "projection",
  trailing,
  className,
  ...input
}: FieldProps) => {
  const id = useId();
  const messageId = `${id}-message`;
  const t = tones[tone];
  const message = error ?? hint;

  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-[0.9375rem] font-semibold", t.label)}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "min-h-12 w-full rounded-aperture border px-3.5 py-3 font-body text-body",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            trailing ? "pr-14" : undefined,
            t.input,
          )}
          {...input}
        />
        {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
      </div>
      {message && (
        <p
          id={messageId}
          className={cn("flex items-start gap-1.5 text-small", error ? t.error : t.hint)}
        >
          {error && <RiErrorWarningLine aria-hidden className="mt-0.5 size-4 shrink-0" />}
          {message}
        </p>
      )}
    </div>
  );
};
