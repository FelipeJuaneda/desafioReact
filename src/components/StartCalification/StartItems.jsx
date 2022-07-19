import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
const StartItems = () => {
  const { startsList } = useAppContext();
  const location = useLocation();
  const filmOrTv = location.pathname === "/popularFilms" ? "film" : "tvShow";
  return (
    <div className="flex flex-wrap items-center justify-center mt-8 mb-12 startItemsCont">
      {startsList === undefined || startsList.length === 0 ? (
        <p>No hay pelicula/serie con esa calificacion</p>
      ) : (
        startsList.map((el) => {
          return (
            <div key={el.id} className="card " style={{ width: "13rem" }}>
              <Link to={`/${filmOrTv}/${el.id}`}>
                <img
                  src={
                    el.poster_path === null
                      ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                      : "https://image.tmdb.org/t/p/w500/" + el.poster_path
                  }
                  className="card-img-top"
                  alt="poster de peliculas populares"
                />
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
};

export default StartItems;
