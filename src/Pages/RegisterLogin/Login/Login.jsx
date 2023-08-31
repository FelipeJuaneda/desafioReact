import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthContext";
import imgLogin from "../../../images/imgLogin.jpg";

const Login = () => {
  const { login, loginWithGoogle, loginWithFacebook } = useAuthContext();
  const navigate = useNavigate();
  const [viewPassword, setViewPassword] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState();

  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(user.email, user.password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/invalid-email")
        return setError("Ingresa un Email valido");
      if (error.code === "auth/user-not-found")
        return setError("Usuario no encontrado");
      if (error.code === "auth/wrong-password")
        return setError("Contraseña incorrecta");
      setError(error.message);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user")
        return setError("Pestaña cerrada por el usuario");
      setError(error.message);
    }
  };
  const handleFacebookSignIn = async () => {
    try {
      await loginWithFacebook();
      navigate("/");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user")
        return setError("Pestaña cerrada por el usuario");
      if (error.code === "auth/account-exists-with-different-credential")
        return setError("Cuenta existente con diferente credencial");
      setError(error.message);
    }
  };

  const handleViewPassword = () => {
    setViewPassword(!viewPassword);
  };

  return (
    <section className="relative flex flex-wrap lg:h-screen lg:items-center">
      <div className="w-full px-4 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">
            ¡Bienvenido de nuevo a Peliculed!
          </h1>

          <p className="my-4 text-gray-500">
            Ingresa tu email y contraseña para acceder a las mejores peliculas
            del mundo!
          </p>
        </div>
        {error && (
          <div className="container border-l-4 border-amber-500 bg-amber-200">
            <div className="flex justify-center gap-3 p-2 ml-2">
              <strong>Warning </strong> <span>{error}</span>
            </div>
          </div>
        )}

        <form
          className="max-w-md mx-auto mt-6 mb-0 space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="sr-only">Email</label>

            <div className="relative">
              <input
                name="email"
                type="email"
                className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                placeholder="Ingresa tu email"
                onChange={handleChange}
              />

              <span className="absolute inset-y-0 inline-flex items-center right-4">
                <i className="text-lg text-gray-400 ri-at-line" />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <div className="relative">
              <input
                name="password"
                type={viewPassword ? "text" : "password"}
                className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                placeholder="Ingresa contraseña"
                onChange={handleChange}
              />

              <span
                onClick={handleViewPassword}
                className="absolute inset-y-0 inline-flex items-center cursor-pointer right-4"
              >
                {viewPassword ? (
                  <i className="text-lg text-gray-400 ri-eye-line" />
                ) : (
                  <i className="text-lg text-gray-400 ri-eye-off-line" />
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              No tienes cuenta?
              <Link to={"/register"} className="underline">
                Registrate!
              </Link>
            </p>

            <button
              type="submit"
              className="inline-block px-5 py-3 ml-3 text-sm font-medium text-white bg-blue-500 rounded-lg"
            >
              Ingresar
            </button>
          </div>
          <div className="mt-0 text-sm text-gray-500">
            <Link to="/recoverPassword">Olvidaste tu contraseña?</Link>
          </div>
        </form>
        <div>
          <div className="text-center font-cineFontFamily mt-7 mb-7">
            <span>Otras opciones para acceder</span>
          </div>
          <div className="flex justify-evenly">
            <button onClick={handleGoogleSignIn}>
              <i className="text-5xl ri-google-fill" />
            </button>
            <button onClick={handleFacebookSignIn}>
              <i className="text-5xl ri-facebook-fill" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-full h-64 sm:h-96 lg:h-full lg:w-1/2 1024:mt-5">
        <img
          alt="Pagina login de peliculed"
          src={imgLogin}
          className="absolute inset-0 object-cover w-full h-full"
        />
      </div>
    </section>
  );
};

export default Login;
