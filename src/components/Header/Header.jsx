import React from "react";
import { useAppContext } from "../contexts/AppContext";
import StartCalification from "../StartCalification/StartCalification";

const Header = () => {
  const { searchMovies, setSearchKey } = useAppContext();

  return (
    <header>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a href="index.html" className="navbar-brand">
            PelicuLed
          </a>

          <StartCalification />

          <form onSubmit={searchMovies} className="d-flex">
            <input
              onChange={(e) => {
                setSearchKey(e.target.value);
              }}
              className="form-control me-2"
              type="search"
              placeholder="Buscar"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Buscar
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;
