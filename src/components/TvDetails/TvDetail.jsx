import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../FilmsDetails/FilmDetail.css";

const TvDetail = ({ tvShowState, details, tvCredits }) => {
  //para guardar la navegacion y volver para atras
  console.log(details);
  console.log(tvCredits);
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
            className="rounded imgDetail"
            src={
              tvShowState.poster_path === null
                ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                : "https://image.tmdb.org/t/p/w500/" + tvShowState.poster_path
            }
            alt=" poster pelicula"
          />
        </div>
        <div className="overviewCalif">
          <span className="text-3xl text-white underline uppercase underline-offset-4 decoration-sky-500 hover:decoration-sky-300 font-cineFontFamily">
            {details.original_name}
          </span>

          <div id="generosDuracion" className="flex items-baseline gap-2">
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
            className="text-xl text-blue-50 font-cineFontFamily"
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
          <Swiper
            grabCursor={true}
            modules={[Pagination]}
            className="mySwiper"
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              480: {
                slidesPerView: 3.1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 4.2,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 4.2,
                spaceBetween: 10,
              },
              1280: {
                slidesPerView: 5.2,
                spaceBetween: 10,
              },
              1440: {
                slidesPerView: 5.5,
                spaceBetween: 10,
              },
            }}
          >
            {tvCredits
              ? tvCredits.cast.map((e) => (
                  <SwiperSlide style={{ width: "200px" }} key={e.id}>
                    <img
                      className="rounded-lg imgPerson"
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
          </Swiper>
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
