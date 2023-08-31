import React from "react";
import { useNavigate } from "react-router-dom";
import TvCast from "./TvCast";
import VideosTv from "./VideosTv";
import AddRemoveButtonsTv from "../FavoriteList/AddRemoveButtonsTv";
import "../FilmsDetails/FilmDetail.css";

const TvDetail = ({ details, tvCredits, videosTv }) => {
  //para guardar la navegacion y volver para atras
  const navigate = useNavigate();

  return (
    <div className="detailFilmCont absolute top-0 left-0 right-0 overflow-y-auto bg-[#eeeeee] flex flex-col items-center gap-10 z-50">
      <div
        id="backDrop"
        className="relative w-full  posterFilm h-128 580:h-[80vh] bg-cover bg-repeat"
        style={{
          backgroundImage: `url("https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${details.backdrop_path}")`,
        }}
      >
        <div id="gradientBackdrop" className="w-full h-full">
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
          <div className="absolute bottom-0 w-4/6 overviewCalif left-80 1024:w-full 1024:h-[70%] 1024:flex 1024:left-0 1024:text-center 1024:justify-center 1024:items-center flex-col 580:h-4/5">
            <span className="text-3xl text-white underline uppercase underline-offset-4 decoration-sky-500 hover:decoration-sky-300 font-cineFontFamily">
              {details.name}
            </span>

            <div
              id="generosDuracion"
              className="flex items-baseline gap-2 1024:text-sm 1024:flex 1024:flex-wrap 1024:justify-start"
            >
              {details.genres
                ? details.genres.map((e) => (
                    <p
                      className="text-green-500 cursor-pointer font-cineFontFamily"
                      key={e.id}
                    >
                      {e.name},
                    </p>
                  ))
                : null}
              <span className="text-white">
                {details.number_of_seasons === 1
                  ? `${details.number_of_seasons} temporada`
                  : `${details.number_of_seasons} temporadas`}
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
                Estreno: {details.first_air_date}
              </p>
              <span className="text-blue-50 decoration-8">
                Calificacion: {details.vote_average}
              </span>
            </div>

            {/* aca va los botones favs */}
            <AddRemoveButtonsTv tvShowState={details} />
          </div>
        </div>
      </div>

      {/* elenco de serie */}
      <TvCast tvCredits={tvCredits} />

      {/* Trailers y videos de serie */}
      <VideosTv videosTv={videosTv} />

      <button
        className="fixed z-10 backButton btn btn-danger top-10 right-10 550:top-4 550:right-4"
        onClick={() => navigate(-1)}
      >
        Volver
      </button>
    </div>
  );
};

export default TvDetail;
