import React from "react";
import { useNavigate } from "react-router-dom";
// import { useAppContext } from "../contexts/AppContext";
import "./FilmDetail.css";

const FilmDetail = ({ film }) => {
  //para guardar la navegacion y volver para atras
  const navigate = useNavigate();
  // const { moviesGenre } = useAppContext();

  return (
    <div className="detailFilmCont">
      <div className="posterFilm">
        <img
          className="posterImg"
          src={"https://image.tmdb.org/t/p/original/" + film.backdrop_path}
          alt=""
        />
        <div className="imgFilm">
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
          <span className="text-3xl text-white underline uppercase underline-offset-4 decoration-sky-500 hover:decoration-sky-300 font-cineFontFamily">{film.original_title}</span>
          <p className="text-xl text-blue-50 font-cineFontFamily">
            <span className="underline">Resumen:</span>
            <br />
            {film.overview}
          </p>
          <p className="text-blue-50 decoration-8">
            Estreno: {film.release_date}
          </p>
          <span className="text-blue-50 decoration-8">
            Calificacion: {film.vote_average}
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

export default FilmDetail;

// {film.genre_ids}
