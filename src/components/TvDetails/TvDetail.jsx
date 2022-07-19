import React from "react";
import { useNavigate } from "react-router-dom";
import { SwiperSlide } from "swiper/react";
import SwiperCarouselDetail from "../SwiperCarousel/SwiperCarouselDetail";

const TvDetail = ({ tvShowState, details, tvCredits }) => {
  //para guardar la navegacion y volver para atras
  const navigate = useNavigate();

  return (
    <div className="detailFilmCont absolute top-0 left-0 right-0 overflow-y-auto bg-[#eeeeee] flex flex-col items-center gap-10 z-50">
      <div className="relative w-full bg-black posterFilm h-128 580:h-[80vh]">
        <img
          className="absolute top-0 bottom-0 left-0 right-0 object-cover w-full h-full posterImg opacity-30"
          src={
            "https://image.tmdb.org/t/p/original/" + tvShowState.backdrop_path
          }
          alt=""
        />
        <div className="absolute imgFilm -bottom-14 left-14 1024:hidden">
          <img
            className="rounded imgDetail w-60"
            src={
              tvShowState.poster_path === null
                ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                : "https://image.tmdb.org/t/p/w500/" + tvShowState.poster_path
            }
            alt=" poster pelicula"
          />
        </div>
        <div className="absolute bottom-0 w-4/6 overviewCalif left-80 1024:w-full 1024:h-[70%] 1024:flex 1024:left-0 1024:text-center 1024:justify-center 1024:items-center flex-col 580:h-4/5">
          <span className="text-3xl text-white underline uppercase underline-offset-4 decoration-sky-500 hover:decoration-sky-300 font-cineFontFamily">
            {details.original_name}
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
                ? details.number_of_seasons + " temporada"
                : details.number_of_seasons + " temporadas"}
            </span>
          </div>
          <p
            id="resumenParrafo"
            className="text-base text-blue-50 font-cineFontFamily 1024:w-full 1024:text-center 1024:text-sm"
          >
            <span className="underline">Resumen:</span>
            <br />
            {tvShowState.overview}
          </p>
          <div className="text-start">
            <p className="text-blue-50 decoration-8">
              Estreno: {tvShowState.release_date}
            </p>
            <span className="text-blue-50 decoration-8">
              Calificacion: {tvShowState.vote_average}
            </span>
          </div>
        </div>
      </div>

      {/* Movie cast - elenco de pelicula */}
      <div className="w-full mt-12 swiperElencoCont 2xl:w-3/5">
        <span>Elenco:</span>
        <div className="select-none">
          <SwiperCarouselDetail>
            {tvCredits
              ? tvCredits.cast.map((e) => (
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

      <button
        className="absolute backButton btn btn-danger top-10 right-10 550:top-4 550:right-4"
        onClick={() => navigate(-1)}
      >
        Volver
      </button>
    </div>
  );
};

export default TvDetail;
