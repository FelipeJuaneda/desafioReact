import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import "./StartItems.css";
const StartItems = () => {
  const { moviesStarts } = useAppContext();

  return (
    <div className=" startItemsCont">
      {moviesStarts === undefined || moviesStarts.length === 0 ? (
        <p>No hay peliculas con esa calificacion</p>
      ) : (
        moviesStarts.map((el) => {
          return (
            <div key={el.id} className="card " style={{ width: "13rem" }}>
              <Link to={`/film/${el.id}`}>
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
