import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import logo from "../../images/iconoPororo.png";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import "./Header.css";

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
      <Popover className="relative px-4 640:py-3 sm:py-5 lg:py-7 sm:px-6 lg:px-8">
        <nav
          className="relative flex items-center justify-around sm:h-10 "
          aria-label="Global"
        >
          <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
            <div className="flex items-center justify-between w-full md:w-auto">
              <span className="sr-only">Peliculed</span>

              {/* LOGO */}
              <Link to={"/"}>
                <img alt="Workflow" className="w-auto h-8 sm:h-10" src={logo} />
              </Link>

              <div className="flex items-center -mr-2 md:hidden">
                <Popover.Button className="inline-flex items-center justify-center p-1 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon className="w-6 h-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
          </div>
          <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className="font-medium text-gray-500 navLink hover:text-gray-900"
                activeclassname="active"
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
              <Link
                to={"/login"}
                className="font-medium text-[#198754] hover:text-[#1d8b58e7]"
              >
                Iniciar Sesión
              </Link>
            ) : (
              <Link
                to={"/login"}
                onClick={handleLogOut}
                className="font-medium text-red hover:text-rojo-principal-800"
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
            className="absolute inset-x-0 top-0 z-10 p-2 transition origin-top-right transform md:hidden"
          >
            <div className="overflow-hidden bg-white rounded-lg shadow-md ring-1 ring-black ring-opacity-5">
              <div className="flex items-center justify-between px-4 pt-3">
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
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex">
                <Link
                  to={"/favoriteList"}
                  className="block w-full px-2 py-2 font-medium text-center text-red-500 hover:text-red-400 bg-gray-50 hover:bg-gray-100"
                >
                  Mis Favoritos
                </Link>
                {user === null ? (
                  <Link
                    to={"/login"}
                    className="font-medium text-[#198754] hover:text-[#1d8b58e7] block w-full px-2 py-2  text-center  bg-gray-50 hover:bg-gray-100"
                  >
                    Iniciar Sesión
                  </Link>
                ) : (
                  <Link
                    to={"/login"}
                    onClick={handleLogOut}
                    className="block w-full px-2 py-2 font-medium text-center text-red hover:text-red-500 bg-gray-50 hover:bg-gray-100"
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
