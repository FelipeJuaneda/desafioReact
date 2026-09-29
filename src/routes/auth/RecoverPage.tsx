import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { paths } from "@/app/paths";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { AuthLayout, authLinkClass, FormAlert } from "@/features/auth/AuthLayout";
import { authErrorMessage } from "@/features/auth/authErrors";
import { safeReturnTo, withReturnTo } from "@/features/auth/returnTo";
import { useAuthContext } from "@/features/auth/useAuthContext";
import { emailError, useFocusFirstInvalid } from "@/features/auth/validation";

const RecoverPage = () => {
  const { resetPassword } = useAuthContext();
  const [params] = useSearchParams();
  const signIn = withReturnTo(paths.signIn, safeReturnTo(params.get("volver")));
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [attempt, setAttempt] = useState(0);
  const formRef = useFocusFirstInvalid(attempt);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = emailError(email);
    setError(invalid);
    setAttempt((n) => n + 1);
    if (invalid) return;
    setStatus("sending");
    setFormError(undefined);
    try {
      await resetPassword(email.trim());
      setStatus("sent");
    } catch (reason) {
      setFormError(authErrorMessage(reason));
      setStatus("idle");
    }
  };

  if (status === "sent") {
    // With email enumeration protection Firebase never says whether the account exists.
    return (
      <AuthLayout
        documentTitle="Revisá tu correo"
        title="Revisá tu correo"
        scene="Recuperar"
        take={attempt}
        lead={
          <>
            Si hay una cuenta con{" "}
            <strong className="font-semibold text-emulsion">{email.trim()}</strong>, te llegó un
            enlace para crear una contraseña nueva. Puede tardar unos minutos: mirá también en spam.
          </>
        }
      >
        <ButtonLink to={signIn}>Volver a ingresar</ButtonLink>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      documentTitle="Recuperar contraseña"
      title="Una toma más"
      lead="¿Olvidaste tu contraseña? Te mandamos un enlace por email para crear una nueva."
      scene="Recuperar"
      take={attempt + 1}
      footer={
        <p>
          ¿Te acordaste?{" "}
          <Link to={signIn} className={authLinkClass}>
            Ingresá
          </Link>
        </p>
      }
    >
      <form
        ref={formRef}
        noValidate
        onSubmit={(event) => void submit(event)}
        className="grid gap-5"
      >
        <FormAlert>{formError}</FormAlert>
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={error}
        />
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : "Enviar enlace"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RecoverPage;
