import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../../../contexts/AuthContext";
import { getErrorCode, getErrorMessage } from "../../../utils/errors";
import imgLogin from "../../../images/imgLogin.jpg";

const Login = () => {
  const { login, loginWithGoogle, loginWithFacebook } = useAuthContext();
  const navigate = useNavigate();
  const [viewPassword, setViewPassword] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>();

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [name]: value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(user.email, user.password);
      navigate("/");
    } catch (error) {
      const code = getErrorCode(error);
      if (code === "auth/invalid-email") return setError("Ingresa un Email valido");
      if (code === "auth/user-not-found") return setError("Usuario no encontrado");
      if (code === "auth/wrong-password") return setError("Contraseña incorrecta");
      setError(getErrorMessage(error));
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      if (getErrorCode(error) === "auth/popup-closed-by-user")
        return setError("Pestaña cerrada por el usuario");
      setError(getErrorMessage(error));
    }
  };
  const handleFacebookSignIn = async () => {
    try {
      await loginWithFacebook();
      navigate("/");
    } catch (error) {
      const code = getErrorCode(error);
      if (code === "auth/popup-closed-by-user") return setError("Pestaña cerrada por el usuario");
      if (code === "auth/account-exists-with-different-credential")
        return setError("Cuenta existente con diferente credencial");
      setError(getErrorMessage(error));
    }
  };

  const handleViewPassword = () => {
    setViewPassword(!viewPassword);
  };

  return (
    <section className="relative flex flex-wrap lg:h-screen lg:items-center">
      <div className="w-full px-4 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">¡Bienvenido de nuevo a Peliculed!</h1>

          <p className="my-4 text-gray-500">
            Ingresa tu email y contraseña para acceder a las mejores peliculas del mundo!
          </p>
        </div>
        {error && (
          <div className="container border-l-4 border-amber-500 bg-amber-200">
            <div className="ml-2 flex justify-center gap-3 p-2">
              <strong>Warning </strong> <span>{error}</span>
            </div>
          </div>
        )}

        <form className="mx-auto mt-6 mb-0 max-w-md space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="sr-only">Email</label>

            <div className="relative">
              <input
                name="email"
                type="email"
                className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                placeholder="Ingresa tu email"
                onChange={handleChange}
              />

              <span className="absolute inset-y-0 right-4 inline-flex items-center">
                <i className="ri-at-line text-lg text-gray-400" />
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
                className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                placeholder="Ingresa contraseña"
                onChange={handleChange}
              />

              <span
                onClick={handleViewPassword}
                className="absolute inset-y-0 right-4 inline-flex cursor-pointer items-center"
              >
                {viewPassword ? (
                  <i className="ri-eye-line text-lg text-gray-400" />
                ) : (
                  <i className="ri-eye-off-line text-lg text-gray-400" />
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
              className="ml-3 inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
            >
              Ingresar
            </button>
          </div>
          <div className="mt-0 text-sm text-gray-500">
            <Link to="/recoverPassword">Olvidaste tu contraseña?</Link>
          </div>
        </form>
        <div>
          <div className="mt-7 mb-7 text-center font-cineFontFamily">
            <span>Otras opciones para acceder</span>
          </div>
          <div className="flex justify-evenly">
            <button onClick={handleGoogleSignIn}>
              <i className="ri-google-fill text-5xl" />
            </button>
            <button onClick={handleFacebookSignIn}>
              <i className="ri-facebook-fill text-5xl" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-64 w-full 1024:mt-5 sm:h-96 lg:h-full lg:w-1/2">
        <img
          alt="Pagina login de peliculed"
          src={imgLogin}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  );
};

export default Login;
