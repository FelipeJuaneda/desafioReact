import React from "react";
import { useNavigate } from "react-router-dom";
import "../FilmsDetails/FilmDetail.css";

const TvDetail = ({ tvShowState }) => {
  //para guardar la navegacion y volver para atras
  const navigate = useNavigate();

  return (
    <div className="detailFilmCont">
      <div className="posterFilm">
        <img
          className="posterImg"
          src={
            "https://image.tmdb.org/t/p/original/" + tvShowState.backdrop_path
          }
          alt=""
        />
        <div className="imgFilm">
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
          <span>{tvShowState.original_title}</span>

          <p className="text-xl text-blue-50 font-cineFontFamily">
            <span className="underline">Resumen:</span>
            <br />
            {tvShowState.overview}
          </p>
          <p className="text-blue-50 decoration-8">
            Estreno: {tvShowState.release_date}
          </p>
          <span className="text-blue-50 decoration-8">
            Calificacion: {tvShowState.vote_average}
          </span>
        </div>
      </div>
      <button
        className="backButton btn btn-danger"
        onClick={() => navigate(-1)}
      >
        Volver
      </button>
    </div>
  );
};

export default TvDetail;
