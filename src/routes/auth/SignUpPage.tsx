import { useState, type FormEvent } from "react";
import { Link, Navigate, useSearchParams } from "react-router";
import { paths } from "@/app/paths";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { AuthLayout, authLinkClass, FormAlert, GoogleButton } from "@/features/auth/AuthLayout";
import { authErrorMessage } from "@/features/auth/authErrors";
import { PasswordField } from "@/features/auth/PasswordField";
import { safeReturnTo, withReturnTo } from "@/features/auth/returnTo";
import { useAuthContext } from "@/features/auth/useAuthContext";
import { emailError, hasErrors, useFocusFirstInvalid } from "@/features/auth/validation";

// Firebase's own minimum; checked here too so the person hears it before submitting.
const MIN_PASSWORD = 6;

const SignUpPage = () => {
  const { user, signUp, loginWithGoogle } = useAuthContext();
  const [params] = useSearchParams();
  const returnTo = safeReturnTo(params.get("volver"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmation?: string;
  }>({});
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const formRef = useFocusFirstInvalid(attempt);

  if (user) return <Navigate to={returnTo} replace />;

  const run = async (action: () => Promise<unknown>) => {
    setPending(true);
    setFormError(undefined);
    try {
      await action();
    } catch (error) {
      setFormError(authErrorMessage(error));
      setPending(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = {
      email: emailError(email),
      password:
        password.length < MIN_PASSWORD
          ? `La contraseña tiene que tener al menos ${MIN_PASSWORD} caracteres.`
          : undefined,
      confirmation: confirmation !== password ? "Las contraseñas no coinciden." : undefined,
    };
    setErrors(next);
    setAttempt((n) => n + 1);
    if (!hasErrors(next)) void run(() => signUp(email.trim(), password));
  };

  return (
    <AuthLayout
      documentTitle="Crear cuenta"
      title="Tu butaca te espera"
      lead="Creá tu cuenta y armá tu lista de películas y series: te sigue a cualquier dispositivo."
      scene="Registro"
      take={attempt + 1}
      footer={
        <p>
          ¿Ya tenés cuenta?{" "}
          <Link to={withReturnTo(paths.signIn, returnTo)} className={authLinkClass}>
            Ingresá
          </Link>
        </p>
      }
    >
      <form ref={formRef} noValidate onSubmit={submit} className="grid gap-5">
        <FormAlert>{formError}</FormAlert>
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <PasswordField
          label="Contraseña"
          name="password"
          autoComplete="new-password"
          hint={`Al menos ${MIN_PASSWORD} caracteres.`}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />
        <PasswordField
          label="Repetí la contraseña"
          name="confirmation"
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          error={errors.confirmation}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Creando tu cuenta…" : "Crear cuenta"}
        </Button>
        <GoogleButton disabled={pending} onClick={() => void run(loginWithGoogle)} />
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;
