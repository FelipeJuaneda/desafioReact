/* This example requires Tailwind CSS v2.0+ */
import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import imgHome from "../images/fotoHome.jpg";

export default function Home() {

    const scrollToPopularFilmsTv = () => {
        window.scrollTo({
          top: 630,
          behavior: "smooth",
        });
      };


  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <Header />

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
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
                <div className="mt-3 shadow">
                  <Link
                    to={"/popularFilms"}
                    onClick={()=>{scrollToPopularFilmsTv()}}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#198754] hover:bg-[#41aa79] md:py-4 md:text-lg md:px-10"
                  >
                    Peliculas Populares
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to={"/popularTv"}
                    onClick={()=>{scrollToPopularFilmsTv()}}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#198754] bg-indigo-100 hover:bg-[#19875415] hover:text-[#1d8b58e7] md:py-4 md:text-lg md:px-10"
                  >
                    Series Populares
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src={imgHome}
          alt=""
        />
      </div>
    </div>
  );
}
