import React from "react";
import { Link } from "react-router-dom";
const StartItems = ({ to, data, hasFilter }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 mt-8 mb-12 startItemsCont">
      {hasFilter && (data === undefined || data.length === 0) ? (
        <p>No hay película/serie con esa calificación</p>
      ) : (
        data &&
        data.map((el) => (
          <div key={el.id} className="w-[205px] h-[305px]">
            <Link to={`/${to}/${el.id}`}>
              <img
                src={
                  el.poster_path === null
                    ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                    : `https://image.tmdb.org/t/p/w500/${el.poster_path}`
                }
                className="object-cover w-full h-full"
                alt="poster de peliculas populares"
              />
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default StartItems;
