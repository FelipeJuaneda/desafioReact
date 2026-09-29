import { useState, type ChangeEvent, type MouseEvent } from "react";
import { useAuthContext } from "@/features/auth/useAuthContext";
import { getErrorCode, getErrorMessage } from "@/lib/errors";

const RecoverPassword = () => {
  const [error, setError] = useState<string>();
  const { resetPassword } = useAuthContext();
  const [email, setEmail] = useState<string>();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleResetPassword = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email) return setError("Por favor, ingresar email");
    try {
      await resetPassword(email);
    } catch (error) {
      const code = getErrorCode(error);
      if (code === "auth/invalid-email") return setError("Ingresa un Email valido");
      if (code === "auth/user-not-found") return setError("El Email ingresado no se encontro");
      setError(getErrorMessage(error));
    }
  };
  return (
    <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Recupera tu contraseña</h1>

        <p className="mt-4 text-gray-500">
          ¡Ingresa tu email, y te enviaremos los pasos para que puedas cambiar tu contraseña!
        </p>
      </div>
      {error && <span>{error}</span>}
      <form action="" className="mx-auto mt-8 mb-0 max-w-md space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>

          <div className="relative">
            <input
              type="email"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-xs"
              placeholder="Enter email"
              onChange={handleChange}
            />

            <span className="absolute inset-y-0 right-4 inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="inline-block w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
          onClick={handleResetPassword}
        >
          Enviar!
        </button>
      </form>
    </div>
  );
};

export default RecoverPassword;
