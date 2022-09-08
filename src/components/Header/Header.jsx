import React, { useState } from "react";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import logo from "../images/iconoPororo.png";
import { Link } from "react-router-dom";
import { animateScroll as scroll, scroller } from "react-scroll";

const Header = () => {
  const navigation = [
    { name: "Peliculas", to: "/popularFilms", scrollTo: 600 },
    { name: "Series", to: "/popularTv", scrollTo: 600 },
    { name: "Personas", to: "/popularPeople", scrollTo: 600 },
  ];
  const [scrollActive, setScrollActive] = useState(false);

  let ubicacionActual = window.pageYOffset;
  const effectScroll = () => {
    // if (window.scrollY >= 75 && window.screen.width < 768) {
    //   setScrollActive(true);
    // } else {
    //   setScrollActive(false);
    // }

    let desplazamientoActual = window.pageYOffset;
    if (
      ubicacionActual >= desplazamientoActual &&
      window.screen.width < 768 &&
      window.scrollY > 0
    ) {
      setScrollActive(true);
    } else {
      setScrollActive(false);
    }
    ubicacionActual = desplazamientoActual;
  };
  window.addEventListener("scroll", effectScroll);
  return (
    <header
      className={
        scrollActive
          ? "fixed w-full top-0 p-3 bg-[#198754ea] transition duration-200"
          : "768:pt-6"
      }
    >
      <Popover>
        <div className="px-4 pt-6 relativ sm:px-6 lg:px-8 768:p-0">
          <nav
            className="relative flex items-center justify-between sm:h-10 lg:justify-start"
            aria-label="Global"
          >
            <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
              <div className="flex items-center justify-between w-full md:w-auto">
                <span className="sr-only">Peliculed</span>

                {/* LOGO */}
                <Link to={"/"}>
                  <img
                    alt="Workflow"
                    className="w-auto h-8 sm:h-10"
                    src={logo}
                  />
                </Link>

                <div className="flex items-center -mr-2 md:hidden">
                  <Popover.Button className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    <MenuIcon className="w-6 h-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="font-medium text-gray-500 hover:text-gray-900"
                  onClick={() => {
                    scroll.scrollTo(item.scrollTo);
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="/"
                className="font-medium text-[#198754] hover:text-[#1d8b58e7]"
              >
                Iniciar Sesión
              </a>
              <Link
                to="/favoriteList"
                onClick={() => scroll.scrollTo(650)}
                className="font-medium text-red-500 hover:text-red-400"
              >
                Mis Favoritos
              </Link>
            </div>
          </nav>
        </div>

        <Transition
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute inset-x-0 top-0 z-10 p-2 transition origin-top-right transform md:hidden"
          >
            <div className="overflow-hidden bg-white rounded-lg shadow-md ring-1 ring-black ring-opacity-5">
              <div className="flex items-center justify-between px-5 pt-4">
                <div>
                  <img className="w-auto h-8" src={logo} alt="" />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close main menu</span>
                    <XIcon className="w-6 h-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => {
                      scroll.scrollTo(item.scrollTo);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex">
                <a
                  href="/"
                  className="block w-full px-5 py-3 font-medium text-center text-indigo-600 bg-gray-50 hover:bg-gray-100"
                >
                  Iniciar Sesión
                </a>
                <Link
                  to={"/favoriteList"}
                  onClick={() => {
                    scroll.scrollTo(600);
                  }}
                  className="block w-full px-5 py-3 font-medium text-center text-red-500 hover:text-red-400 bg-gray-50 hover:bg-gray-100"
                >
                  Mis Favoritos
                </Link>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </header>
  );
};

export default Header;
