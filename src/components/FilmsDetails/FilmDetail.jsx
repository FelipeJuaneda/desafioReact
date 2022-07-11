import React from "react";
import { Link } from "react-router-dom";
import "./FilmDetail.css";

const FilmDetail = ({ film }) => {
  return (
    <div className="detailFilmCont">
      <div className="titleImg">
        <h1>{film.original_title}</h1>
        <img
          className="imgDetail"
          src={
            film.poster_path === null
              ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
              : "https://image.tmdb.org/t/p/w500/" + film.poster_path
          }
          alt=" poster pelicula"
        />
      </div>
      <div className="overviewCalif">
        <p className="fs-4 text-info">{film.overview}</p>
        <p>Estreno: {film.release_date}</p>
        <span>Calificacion: {film.vote_average}</span>
      </div>
      <Link className="backButton btn btn-danger" to={"/popularFilms"}>
        Volver
      </Link>
    </div>
  );
};

export default FilmDetail;
