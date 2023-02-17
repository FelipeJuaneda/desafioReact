/* This example requires Tailwind CSS v2.0+ */
import React from "react";
import { Link} from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import Header from "../Header/Header";
import { animateScroll as scroll } from "react-scroll";
import { useAuthContext } from "../../contexts/AuthContext";
export default function Home() {
  const { setStartsList, setPagination } = useAppContext();
  const { user, logout, loading } = useAuthContext();
  const handleLogOut = async () => {
    await logout();
  };

  console.log(user);
  const buttonsHome = [
    {
      id: 1,
      title: "Peliculas Populares",
      divFather: "mt-3 shadow",
      to: "/popularFilms",
      linkClass:
        "w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#198754] hover:bg-[#41aa79] md:py-4 md:text-lg md:px-10",
    },
    {
      id: 2,
      title: "Series Populares",
      divFather: "mt-3 sm:mt-0 sm:ml-3",
      to: "/popularTv",
      linkClass:
        "w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#198754] bg-indigo-100 hover:bg-[#19875415] hover:text-[#1d8b58e7] md:py-4 md:text-lg md:px-10",
    },
  ];
  const imgsHome = [
    "https://i.ibb.co/PZhq2YZ/fotoHome.jpg",
    "https://i.ibb.co/pJ3gHF3/pexels-tima-miroshnichenko-7991158.jpg",
    "https://i.ibb.co/2S1f1hW/pexels-pixabay-33129.jpg",
    "https://i.ibb.co/wCWPRzq/pexels-martin-lopez-1117132.jpg",
    "https://i.ibb.co/m5pxcRN/pexels-cottonbro-8263345.jpg",
  ];
  const randomImgs = imgsHome[Math.floor(imgsHome.length * Math.random())];

  if (loading) return <h1>cargando...</h1>;
  return (
    <>
      <div className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="absolute inset-y-0 right-0 hidden w-48 h-full text-white transform translate-x-1/2 lg:block"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <Header />

            <main className="px-4 mx-auto mt-10 max-w-7xl sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">PELICULED</span>{" "}
                  <span className="block text-[#198754] xl:inline">
                    Bienvenidos.
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Millones de películas, programas de televisión y personas por
                  descubrir. Explora ahora.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {buttonsHome.map((boton) => {
                    return (
                      <div key={boton.id} className={boton.divFather}>
                        <Link
                          to={boton.to}
                          onClick={() => {
                            scroll.scrollTo(630);
                            setStartsList(undefined);
                            setPagination(1);
                          }}
                          className={boton.linkClass}
                        >
                          {boton.title}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="object-cover w-full h-56 sm:h-72 md:h-96 lg:w-full lg:h-full"
            src={randomImgs}
            alt=""
          />
        </div>
      </div>
      <div>
        <span>Bienvenido {user.email}</span>
        <button onClick={handleLogOut}>Cerrar sesion</button>
      </div>
    </>
  );
}
