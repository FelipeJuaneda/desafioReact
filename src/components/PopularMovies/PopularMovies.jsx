import React from "react";
import { useAppContext } from "../contexts/AppContext";
import StartItems from "../StartCalification/StartItems";
import "./PopularMovies.css";
import { Link } from "react-router-dom";
import PaginationCont from "../Pagination/PaginationCont";
import StartCalification from "../StartCalification/StartCalification";
import pororoLoad from "../images/pororoLoad.gif";

const PopularMovies = () => {
  const { moviesList, searchMovies, setSearchKey, setStartsList } =
    useAppContext();

  return (
    <div className="text-center ">
      <div className="navbar navbar-light bg-light">
        <div className="pt-5 pb-5 container-fluid justify-content-evenly">
          {/* componente de estrellas */}
          <StartCalification />
          <form onSubmit={searchMovies} className="d-flex">
            <input
              onChange={(e) => {
                setSearchKey(e.target.value);
                setStartsList(undefined);
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
      </div>
      {/* aca se imprimen las peliculas filtradas por estrellas */}
      <StartItems />

      <span className="text-uppercase fs-2 font-monospace">Popular Movies</span>
      <div className="popularMoviesCont">
        {moviesList ? (
          moviesList.map((el) => {
            return (
              <div key={el.id} className="card " style={{ width: "18rem" }}>
                <Link to={`/film/${el.id}`}>
                <img
                  src={
                    el.poster_path === null
                      ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                      : "https://image.tmdb.org/t/p/w300/" + el.poster_path
                  }
                  className="card-img-top"
                  alt="poster de peliculas populares"
                  />
                  </Link>
              </div>
            );
          })
        ) : (
          <img src={pororoLoad} alt="Pochoclo cargando" />
        )}
      </div>

      <PaginationCont />
    </div>
  );
};

export default PopularMovies;
