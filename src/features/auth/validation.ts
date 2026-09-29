import { useEffect, useRef } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailError = (email: string) =>
  !email.trim()
    ? "Ingresá tu email."
    : !EMAIL.test(email.trim())
      ? "Ese email no parece válido. Revisá que esté bien escrito."
      : undefined;

export const hasErrors = (errors: Record<string, string | undefined>) =>
  Object.values(errors).some(Boolean);

/**
 * After a submit with errors, moves focus to the first invalid field so keyboard and
 * screen-reader users land on the problem. `attempt` changes on every submit.
 */
export const useFocusFirstInvalid = (attempt: number) => {
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (attempt === 0) return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [attempt]);
  return formRef;
};
