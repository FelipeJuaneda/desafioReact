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

const SignInPage = () => {
  const { user, login, loginWithGoogle } = useAuthContext();
  const [params] = useSearchParams();
  const returnTo = safeReturnTo(params.get("volver"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const formRef = useFocusFirstInvalid(attempt);

  // Signed in (now or already): go back to where the person was headed.
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
      password: password ? undefined : "Ingresá tu contraseña.",
    };
    setErrors(next);
    setAttempt((n) => n + 1);
    if (!hasErrors(next)) void run(() => login(email.trim(), password));
  };

  return (
    <AuthLayout
      title="Ingresar"
      lead="Entrá a tu cuenta para guardar títulos en Mi lista."
      footer={
        <p>
          ¿No tenés cuenta?{" "}
          <Link to={withReturnTo(paths.signUp, returnTo)} className={authLinkClass}>
            Creá una
          </Link>
        </p>
      }
    >
      <form ref={formRef} noValidate onSubmit={submit} className="grid gap-5">
        <FormAlert>{formError}</FormAlert>
        <Field
          tone="lighttable"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <div className="grid gap-2">
          <PasswordField
            label="Contraseña"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
          />
          <Link
            to={withReturnTo(paths.recover, returnTo)}
            className={`${authLinkClass} justify-self-start text-small`}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Button type="submit" tone="lighttable" disabled={pending}>
          {pending ? "Ingresando…" : "Ingresar"}
        </Button>
        <GoogleButton disabled={pending} onClick={() => void run(loginWithGoogle)} />
      </form>
    </AuthLayout>
  );
};

export default SignInPage;
