import React from "react";
import { useAppContext } from "../contexts/AppContext";
import "./PopularMovies.css";

const PopularMovies = () => {
  const { moviesList } = useAppContext();

  return (
    <div className="text-center ">
      <span className="text-uppercase fs-2 font-monospace">
        Populars Movies
      </span>
      <div className="pupularMoviesCont">
        {moviesList ? (
          moviesList.map((el) => {
            return (
              <div key={el.id} className="card " style={{ width: "18rem" }}>
                <img
                  src={"https://image.tmdb.org/t/p/w500/" + el.poster_path}
                  className="card-img-top"
                  alt="poster de peliculas populares"
                />
                <div className="card-body">
                  <h4 className="card-title fs-4">{el.original_title}</h4>
                  <a href="#" className="btn btn-primary">
                    + Info
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </div>
  );
};

export default PopularMovies;
