import React from "react";
import { useNavigate } from "react-router-dom";
import { SwiperSlide } from "swiper/react";
import toast, { Toaster } from "react-hot-toast";
import SwiperCarouselDetail from "../SwiperCarousel/SwiperCarouselDetail";
import "../FilmsDetails/FilmDetail.css";
import { useFavoriteContext } from "../contexts/FavoriteContext";

const TvDetail = ({ tvShowState, details, tvCredits, videosTv }) => {
  const { favoritetv, addTvToTvList, removeTvToTvList } = useFavoriteContext();

  //para guardar la navegacion y volver para atras
  const navigate = useNavigate();
  //Si la serie se encuentra agregada
  const ifMovieIsIn = favoritetv.find((e) => e.id === tvShowState.id);
  //devuevle true o false depende si esta la serie agregada o no
  const favoriteTvDisabled = ifMovieIsIn ? true : false;
  //si la serie esta agregada devuelve text-red sino nada
  const changeColorFav = ifMovieIsIn ? "text-red-600" : "";

  return (
    <div className="detailFilmCont absolute top-0 left-0 right-0 overflow-y-auto bg-[#eeeeee] flex flex-col items-center gap-10 z-50">
      <div
        id="backDrop"
        className="relative w-full  posterFilm h-128 580:h-[80vh] bg-cover bg-repeat"
        style={{
          backgroundImage: `url("https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${tvShowState.backdrop_path}")`,
        }}
      >
        <div id="gradientBackdrop" className="w-full h-full">
          <div className="absolute imgFilm -bottom-14 left-14 1024:hidden">
            <img
              className="rounded imgDetail w-60 drop-shadow-2xl"
              src={
                tvShowState.poster_path === null
                  ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                  : `https://image.tmdb.org/t/p/w500/${tvShowState.poster_path}`
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
            <div className="flex gap-3 pt-3 pb-3">
              <button
                className="text-xl text-black rounded-full bg-slate-400 btn"
                disabled={favoriteTvDisabled}
                onClick={() => {
                  addTvToTvList(tvShowState);
                  toast(
                    (t) => (
                      <span className="text-xs text-center text-white ">
                        Serie agregada!
                      </span>
                    ),
                    {
                      duration: 2100,
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
                onClick={() => removeTvToTvList(tvShowState.id)}
              >
                <i className="ri-dislike-fill" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* tv cast - elenco de serie */}
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
                    <span className="font-semibold">{e.name}</span>
                    <br />
                    <span className="text-stone-500">{e.character}</span>
                  </SwiperSlide>
                ))
              : null}
          </SwiperCarouselDetail>
        </div>
      </div>

      <div className="w-full 2xl:w-3/5">
        <span className="text-lg font-semibold underline font-cineFontFamily ">
          Trailers y videos
        </span>
        {videosTv.length > 0 ? (
          videosTv.map((e) => {
            return (
              <div
                key={e.key}
                className="accordion accordion-flush"
                id="accordionFlushExample"
              >
                <div className="accordion-item">
                  <span
                    className="accordion-header"
                    id={`flush-heading${e.id}`}
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#flush-${e.id}`}
                      aria-expanded="false"
                      aria-controls={`flush-${e.id}`}
                    >
                      {e.type} / {e.name}
                    </button>
                  </span>
                  <div
                    id={`flush-${e.id}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`flush-heading${e.id}`}
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      <div>
                        <iframe
                          className="w-full h-128 580:h-80"
                          src={`https://www.youtube.com/embed/${e.key}`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No hay trailer ni video de esta serie</p>
        )}
      </div>

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
