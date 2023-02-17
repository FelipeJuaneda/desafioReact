import React, { useState } from "react";
import { useAuthContext } from "../../../contexts/AuthContext";

const RecoverPassword = () => {
  const [error, setError] = useState();
  const { resetPassword } = useAuthContext();
  const [email, setEmail] = useState();
  console.log(email);
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) return setError("Por favor, ingresar email");
    try {
      await resetPassword(email);
    } catch (error) {
        if(error.code==="auth/invalid-email")return setError("Ingresa un Email valido")
        if(error.code==="auth/user-not-found")return setError("El Email ingresado no se encontro")
      setError(error.message);
    }
  };
  return (
    <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Recupera tu contraseña
        </h1>

        <p className="mt-4 text-gray-500">
          ¡Ingresa tu email, y te enviaremos los pasos para que puedas cambiar
          tu contraseña!
        </p>
      </div>
      {error && <span>{error}</span>}
      <form action="" className="max-w-md mx-auto mt-8 mb-0 space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>

          <div className="relative">
            <input
              type="email"
              className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
              placeholder="Enter email"
              onChange={handleChange}
            />

            <span className="absolute inset-y-0 inline-flex items-center right-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-400"
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
          className="inline-block w-full px-5 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg"
          onClick={handleResetPassword}
        >
          Enviar!
        </button>
      </form>
    </div>
  );
};

export default RecoverPassword;
