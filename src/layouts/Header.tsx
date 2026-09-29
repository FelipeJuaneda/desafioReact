import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import logo from "@/assets/images/iconoPororo.png";
import { Link, NavLink } from "react-router";
import { useAuthContext } from "@/features/auth/useAuthContext";
import "@/layouts/Header.css";

const Header = () => {
  const { user, logout } = useAuthContext();
  const handleLogOut = async () => {
    await logout();
  };
  const navigation = [
    { name: "Peliculas", to: "/popularFilms" },
    { name: "Series", to: "/popularTv" },
    { name: "Personas", to: "/popularPeople" },
  ];

  return (
    <header>
      <Popover className="relative px-4 640:py-3 sm:py-5 sm:px-6 lg:py-7 lg:px-8">
        <nav className="relative flex items-center justify-around sm:h-10" aria-label="Global">
          <div className="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
            <div className="flex w-full items-center justify-between md:w-auto">
              <span className="sr-only">Peliculed</span>

              {/* LOGO */}
              <Link to={"/"}>
                <img alt="Workflow" className="h-8 w-auto sm:h-10" src={logo} />
              </Link>

              <div className="-mr-2 flex items-center md:hidden">
                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
          </div>
          <div className="hidden md:ml-10 md:block md:space-x-8 md:pr-4">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className="navLink font-medium text-gray-500 hover:text-gray-900"
              >
                {item.name}
              </NavLink>
            ))}
            <Link
              to="/favoriteList"
              className="font-medium text-rojo-principal-800 hover:text-rojo-principal-700"
            >
              Mis Favoritos
            </Link>
            {user === null ? (
              <Link to={"/login"} className="font-medium text-[#198754] hover:text-[#1d8b58e7]">
                Iniciar Sesión
              </Link>
            ) : (
              <Link
                to={"/login"}
                onClick={handleLogOut}
                className="text-red font-medium hover:text-rojo-principal-800"
              >
                Cerrar Sesión
              </Link>
            )}
          </div>
        </nav>

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
            className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
          >
            <div className="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5">
              <div className="flex items-center justify-between px-4 pt-3">
                <div>
                  <img className="h-8 w-auto" src={logo} alt="" />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close main menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex">
                <Link
                  to={"/favoriteList"}
                  className="block w-full bg-gray-50 px-2 py-2 text-center font-medium text-red-500 hover:bg-gray-100 hover:text-red-400"
                >
                  Mis Favoritos
                </Link>
                {user === null ? (
                  <Link
                    to={"/login"}
                    className="block w-full bg-gray-50 px-2 py-2 text-center font-medium text-[#198754] hover:bg-gray-100 hover:text-[#1d8b58e7]"
                  >
                    Iniciar Sesión
                  </Link>
                ) : (
                  <Link
                    to={"/login"}
                    onClick={handleLogOut}
                    className="text-red block w-full bg-gray-50 px-2 py-2 text-center font-medium hover:bg-gray-100 hover:text-red-500"
                  >
                    Cerrar Sesión
                  </Link>
                )}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </header>
  );
};

export default Header;
