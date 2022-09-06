import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AddRemoveButtons from "../FavoriteList/AddRemoveButtons";
import MovieCast from "./MovieCast";
import VideosFilm from "./VideosFilm";
import { animateScroll as scroll } from "react-scroll";
import "./FilmDetail.css";

const FilmDetail = ({ details, filmCredits, videosFilm }) => {
  //para guardar la navegacion y volver para atras
  const navigate = useNavigate();

  //convirtiendo minutos en horas, y separando los minutos restantes
  const hours = Math.trunc(details.runtime / 60);
  const minutes = details.runtime % 60;

  return (
    <div className="detailFilmCont absolute top-0 left-0 right-0 overflow-y-auto bg-[#eeeeee] flex flex-col items-center gap-10 z-50">
      <div
        id="backDrop"
        className="relative w-full  posterFilm h-128 580:h-[80vh] bg-cover bg-repeat"
        style={{
          backgroundImage: `url("https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${details.backdrop_path}")`,
        }}
      >
        <div id="gradientBackdrop" className="w-full h-full ">
          <div className="absolute imgFilm -bottom-14 left-14 1024:hidden">
            <img
              className="rounded imgDetail w-60 drop-shadow-2xl"
              src={
                details.poster_path === null
                  ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                  : `https://image.tmdb.org/t/p/w500/${details.poster_path}`
              }
              alt=" poster pelicula"
            />
          </div>
          <div className="absolute bottom-0 w-4/6 overviewCalif left-80 1024:w-full 1024:h-[70%] 1024:left-0 1024:text-center 1024:flex 1024:justify-center 1024:items-center flex-col 580:h-4/5">
            <span className="text-3xl text-white underline uppercase underline-offset-4 decoration-sky-500 hover:decoration-sky-300 font-cineFontFamily">
              {details.title}
            </span>
            <div
              id="generosDuracion"
              className="flex items-baseline gap-2 1024:text-sm 1024:flex 1024:flex-wrap 1024:justify-start"
            >
              {details.genres
                ? details.genres.map((e) => (
                    <Link
                      to={`/genre/${e.id}`}
                      key={e.id}
                      onClick={() => {
                        scroll.scrollTo(600);
                      }}
                    >
                      <p className="text-green-500 cursor-pointer font-cineFontFamily">
                        {e.name},
                      </p>
                    </Link>
                  ))
                : null}
              <span className="text-white">
                ° {hours}h {minutes}m
              </span>
            </div>

            <p
              id="resumenParrafo"
              className="text-base text-blue-50 font-cineFontFamily 1024:w-full 1024:text-center 1024:text-sm"
            >
              <span className="underline">Resumen:</span>
              <br />
              {details.overview}
            </p>
            <div className="text-start">
              <p className="text-blue-50 decoration-8">
                Estreno: {details.release_date}
              </p>
              <span className="text-blue-50 decoration-8">
                Calificacion: {details.vote_average}
              </span>
            </div>

            {/* aca va los botones favs */}
            <AddRemoveButtons film={details} />
          </div>
        </div>
      </div>

      {/* elenco de pelicula */}
      <MovieCast filmCredits={filmCredits} />

      {/* Trailers y videos de pelicula */}
      <VideosFilm videosFilm={videosFilm} />

      <button
        className="fixed z-10 backButton btn btn-danger top-10 right-10 550:top-4 550:right-4"
        onClick={() => navigate(-1)}
      >
        Volver
      </button>
    </div>
  );
};

export default FilmDetail;
