import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthContext";
import imgRegister from "../../../images/imgRegister.jpg";
import logo from "../../../images/iconoPororo.png";

const Register = () => {
  const { signUp } = useAuthContext();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState();

  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user.password === user.password_confirmation) {
        await signUp(user.email, user.password);
        navigate("/");
      } else {
        setError("Las contraseñas no coinciden");
        return;
      }
    } catch (error) {
      if (error.code === "auth/invalid-email")
        return setError("Ingresa un Email valido");
      if (error.code === "auth/user-not-found")
        return setError("Usuario no encontrado");
      if (error.code === "auth/wrong-password")
        return setError("Contraseña incorrecta");
      if (error.code === "auth/weak-password")
        return setError("La contraseña debe tener al menos 6 caracteres");
      setError(error.message);
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex items-end h-32 bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Night"
            src={imgRegister}
            className="absolute inset-0 object-cover w-full h-full opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <Link className="block text-white" to="/">
              <span className="sr-only">Home</span>
              <img className="h-8 sm:h-10" src={logo} alt="logo de péliculed" />
            </Link>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Bienvenido a Peliculed
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Crea una cuenta para poder acceder a nuestra web, y seguir al
              tanto todos los titulos que tenemos para ofrecerte.
            </p>
          </div>
        </section>

        <main
          aria-label="Main"
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative block -mt-16 lg:hidden">
              <Link
                className="inline-flex items-center justify-center w-16 h-16 text-blue-600 bg-white rounded-full sm:h-20 sm:w-20"
                to="/"
              >
                <span className="sr-only">Home</span>
                <img
                  className="h-8 sm:h-10"
                  src={logo}
                  alt="logo de péliculed"
                />
              </Link>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Bienvenido a Peliculed
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500">
                Crea una cuenta para poder acceder a nuestra web, y seguir al
                tanto todos los titulos que tenemos para ofrecerte.
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
              className="grid grid-cols-6 gap-6 mt-8"
              onSubmit={handleSubmit}
            >
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>

                <input
                  type="text"
                  id="FirstName"
                  name="first_name"
                  className="w-full mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="LastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apellido
                </label>

                <input
                  type="text"
                  id="LastName"
                  name="last_name"
                  className="w-full mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="Email"
                  name="email"
                  className="w-full mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm"
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>

                <input
                  type="password"
                  id="Password"
                  name="password"
                  className="w-full mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm"
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="PasswordConfirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confrirmar Contraseña
                </label>

                <input
                  type="password"
                  id="PasswordConfirmation"
                  name="password_confirmation"
                  className="w-full mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm"
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button className="inline-block px-5 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg ">
                  Crear Cuenta
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Ya tenes una cuenta?
                  <Link to={"/login"} className="text-gray-700 underline">
                    Logeate!
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Register;
