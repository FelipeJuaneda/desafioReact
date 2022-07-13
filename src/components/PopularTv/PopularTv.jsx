import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import PaginationCont from "../Pagination/PaginationCont";
import StartCalification from "../StartCalification/StartCalification";
import StartItems from "../StartCalification/StartItems";
import pororoLoad from "../images/pororoLoad.gif";
import "./PopularTv.css";

const PopularTv = () => {
  const { tvPopularList, setSearchKey, searchMovies, setStartsList } =
    useAppContext();
  return (
    <div className="text-center">
      <div>
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
      </div>
      <span className="text-center text-uppercase fs-2 font-monospace">
        Popular Tv Shows
      </span>
      <div className="popularTvCont">
        {tvPopularList ? (
          tvPopularList.map((el) => {
            return (
              <div key={el.id} className="card " style={{ width: "18rem" }}>
                <Link to={`/tvShow/${el.id}`} >
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

export default PopularTv;
