import React from "react";
import { Link } from "react-router-dom";

const TvDetail = ({ tvShowState }) => {
  return (
    <div className="detailFilmCont">
      <div className="titleImg">
        <h1>{tvShowState.original_title}</h1>
        <img
          className="imgDetail"
          src={
            tvShowState.poster_path === null
              ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
              : "https://image.tmdb.org/t/p/w500/" + tvShowState.poster_path
          }
          alt=" poster pelicula"
        />
      </div>
      <div className="overviewCalif">
        <p className="fs-4 text-info">{tvShowState.overview}</p>
        <p>Estreno: {tvShowState.release_date}</p>
        <span>Calificacion: {tvShowState.vote_average}</span>
      </div>
      <Link className="backButton btn btn-danger" to={"/popularTv"}>
        Volver
      </Link>
    </div>
  );
};

export default TvDetail;
