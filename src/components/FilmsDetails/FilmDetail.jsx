import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { SwiperSlide } from "swiper/react";
import { useAppContext } from "../contexts/AppContext";
import toast, { Toaster } from "react-hot-toast";
import { animateScroll as scroll } from "react-scroll";
import SwiperCarouselDetail from "../SwiperCarousel/SwiperCarouselDetail";

const FilmDetail = ({ film, details, filmCredits, videosFilm }) => {
  const { addMovieToWatchlist, removeMovieToWatchList, watchlist } =
    useAppContext();

  //Si la pelicula se encuentra agregada
  const ifMovieIsIn = watchlist.find((e) => e.id === film.id);
  //devuevle true o false depende si esta la pelicula agregada o no
  const watchlistDisabled = ifMovieIsIn ? true : false;
  //si la peli esta agregada devuelve text-red sino nada
  const changeColorFav = ifMovieIsIn ? "text-red-600" : "";
  //para guardar la navegacion y volver para atras
  const navigate = useNavigate();

  //convirtiendo minutos en horas, y separando los minutos restantes
  const hours = Math.trunc(details.runtime / 60);
  const minutes = details.runtime % 60;

  return (
    <div className="detailFilmCont absolute top-0 left-0 right-0 overflow-y-auto bg-[#eeeeee] flex flex-col items-center gap-10 z-50">
      <div className="relative w-full bg-black posterFilm h-128 580:h-[80vh]">
        <img
          className="absolute top-0 bottom-0 left-0 right-0 object-cover w-full h-full posterImg opacity-30"
          src={"https://image.tmdb.org/t/p/original/" + film.backdrop_path}
          alt=""
        />
        <div className="absolute imgFilm -bottom-14 left-14 1024:hidden">
          <img
            className="rounded imgDetail w-60"
            src={
              film.poster_path === null
                ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                : "https://image.tmdb.org/t/p/w500/" + film.poster_path
            }
            alt=" poster pelicula"
          />
        </div>
        <div className="absolute bottom-0 w-4/6 overviewCalif left-80 1024:w-full 1024:h-[70%] 1024:left-0 1024:text-center 1024:flex 1024:justify-center 1024:items-center flex-col 580:h-4/5">
          <span className="text-3xl text-white underline uppercase underline-offset-4 decoration-sky-500 hover:decoration-sky-300 font-cineFontFamily">
            {film.original_title}
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
              ° {hours}h {minutes}m
            </span>
          </div>

          <p
            id="resumenParrafo"
            className="text-base text-blue-50 font-cineFontFamily 1024:w-full 1024:text-center 1024:text-sm"
          >
            <span className="underline">Resumen:</span>
            <br />
            {film.overview}
          </p>
          <div className="text-start">
            <p className="text-blue-50 decoration-8">
              Estreno: {film.release_date}
            </p>
            <span className="text-blue-50 decoration-8">
              Calificacion: {film.vote_average}
            </span>
          </div>
          <div className="flex gap-3 pt-3 pb-3">
            <button
              className="text-xl text-black rounded-full bg-slate-400 btn"
              disabled={watchlistDisabled}
              onClick={() => {
                addMovieToWatchlist(film);
                toast(
                  (t) => (
                    <span
                      className="flex flex-col items-center justify-center text-xs text-center text-white"
                      style={{ background: "#198754" }}
                    >
                      Pelicula agregada!
                      <br />
                      <Link
                        onClick={() => scroll.scrollTo(650)}
                        to={"/favoriteList"}
                      >
                        Ir a favoritos
                      </Link>
                    </span>
                  ),
                  {
                    duration: 3400,
                    position: "top-center",

                    // Styling
                    style: {
                      background: "#198754",
                      letterSpacing: "2px",
                    },
                    // Custom Icon
                    icon: "❤️",

                    // Aria
                    ariaProps: {
                      role: "status",
                      "aria-live": "polite",
                    },
                  }
                );
              }}
            >
              <i className={`ri-heart-fill ${changeColorFav}`} />
            </button>
            <Toaster />
            <button
              className="text-xl text-black rounded-full bg-slate-400 btn"
              onClick={() => removeMovieToWatchList(film.id)}
            >
              <i className="ri-dislike-fill" />
            </button>
          </div>
        </div>
      </div>

      {/* Movie cast - elenco de pelicula */}
      <div className="w-full mt-12 swiperElencoCont 2xl:w-3/5">
        <span className="text-lg font-semibold underline font-cineFontFamily ">
          Elenco:
        </span>
        <div className="select-none">
          <SwiperCarouselDetail>
            {filmCredits
              ? filmCredits.cast.map((e) => (
                  <SwiperSlide style={{ width: "200px" }} key={e.id}>
                    <img
                      className="rounded-lg imgPerson w-[230px] h-[345px] object-cover 1024:w-[200px] 1024:h-[285px]"
                      src={
                        e.profile_path === null
                          ? "https://i.ibb.co/DLSk8bk/default-image.png"
                          : "https://image.tmdb.org/t/p/w200" + e.profile_path
                      }
                      alt="elenco de pelicula"
                    />
                    <span>{e.name}</span>
                  </SwiperSlide>
                ))
              : null}
          </SwiperCarouselDetail>
        </div>
      </div>
      {videosFilm ? (
        videosFilm.map((e) => {
          return (
            <div>
              <iframe width="560"
              height="315"
              src={`https://www.youtube.com/embed/${e.key}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
            </div>
          );
        })
      ) : (
        <p>Cargando...</p>
      )}

      <button
        className="absolute backButton btn btn-danger top-10 right-10 550:top-4 550:right-4"
        onClick={() => navigate(-1)}
      >
        Volver
      </button>
    </div>
  );
};

export default FilmDetail;
