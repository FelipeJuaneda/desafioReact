import React from "react";
import { useAppContext } from "../contexts/AppContext";
import "./StartItems.css"
const StartItems = () => {
  const { moviesList, moviesStarts } = useAppContext();
  return (
    <div className=" startItemsCont">
      {moviesStarts
        ? moviesStarts.map((el) => {
            return (
              <div key={el.id} className="card " style={{ width: "13rem" }}>
                <img
                  src={"https://image.tmdb.org/t/p/w500/" + el.poster_path}
                  className="card-img-top"
                  alt="poster de peliculas populares"
                />
              </div>
            );
          })
        : null}
    </div>
  );
};

export default StartItems;
