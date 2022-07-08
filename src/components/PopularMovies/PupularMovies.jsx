import React from "react";
import { useAppContext } from "../contexts/AppContext";
import StartItems from "../StartCalification/StartItems";
import "./PopularMovies.css";
import { Link } from "react-router-dom";
import PaginationCont from "../Pagination/PaginationCont";

const PopularMovies = () => {
  const { moviesList } = useAppContext();

  return (
    <div className="text-center ">
      {/* aca se imprimen las peliculas filtradas por estrellas */}
      <StartItems />
      <span className="text-uppercase fs-2 font-monospace">Popular Movies</span>
      <div className="pupularMoviesCont">
        {moviesList ? (
          moviesList.map((el) => {
            return (
              <div key={el.id} className="card " style={{ width: "18rem" }}>
                <img
                  src={
                    el.poster_path === null
                      ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                      : "https://image.tmdb.org/t/p/w500/" + el.poster_path
                  }
                  className="card-img-top"
                  alt="poster de peliculas populares"
                />
                <div className="card-body">
                  <h4 className="card-title fs-5">{el.original_title}</h4>

                  <Link to={`/film/${el.id}`} className="btn btn-success">
                    + Info
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p>Cargando...</p>
        )}
      </div>

      <PaginationCont />
    </div>
  );
};

export default PopularMovies;
//"https://image.tmdb.org/t/p/w500/" + el.poster_path
