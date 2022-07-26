import React from "react";
import { Link } from "react-router-dom";
import { Element } from "react-scroll";
import { SwiperSlide } from "swiper/react";
import { useAppContext } from "../contexts/AppContext";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import SwiperCarousel from "../SwiperCarousel/SwiperCarousel";

const FavoriteList = () => {
  const {
    favoritemovie,
    removeMovieToFavoritemovie,
    removeTvToTvList,
    favoritetv,
  } = useAppContext();
  return (
    <Element name="favoriteListElement">
      {/* PELICULAS FAVORITAS */}
      <div>
        <div className="flex justify-center pt-4 pb-4">
          <span className="flex gap-2 text-3xl font-cineFontFamily ">
            <i className={`ri-heart-fill text-red-500`} /> Peliculas Favoritas{" "}
            <i className={`ri-heart-fill text-red-500`} />
          </span>
        </div>

        <SwiperCarousel>
          {favoritemovie.length > 0 ? (
            favoritemovie.map((el) => {
              return (
                <SwiperSlide key={el.id}>
                  <div
                    className="object-cover w-72 "
                    style={{ height: "432px" }}
                  >
                    <Link to={`/film/${el.id}`}>
                      <img
                        src={
                          el.poster_path === null
                            ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                            : "https://image.tmdb.org/t/p/original" +
                              el.poster_path
                        }
                        className="relative w-4/5 rounded-md h-4/5"
                        alt="poster de peliculas populares"
                      />
                    </Link>
                  </div>

                  <button
                    onClick={() => removeMovieToFavoritemovie(el.id)}
                    className="absolute top-0 left-0 flex items-center justify-center bg-red-500 w-9 h-9 btn"
                  >
                    <i className="ri-dislike-fill" />
                  </button>
                </SwiperSlide>
              );
            })
          ) : (
            <p className="text-center">
              No agregaste ninguna pelicula a favorito!
            </p>
          )}
        </SwiperCarousel>
      </div>

      {/* SERIES FAVORITAS */}
      <div>
        <div className="flex justify-center pt-4 pb-4">
          <span className="flex gap-2 text-3xl font-cineFontFamily ">
            <i className={`ri-heart-fill text-red-500`} /> Series Favoritas{" "}
            <i className={`ri-heart-fill text-red-500`} />
          </span>
        </div>

        <SwiperCarousel>
          {favoritetv.length > 0 ? (
            favoritetv.map((el) => {
              return (
                <SwiperSlide key={el.id}>
                  <div
                    className="object-cover w-72 "
                    style={{ height: "432px" }}
                  >
                    <Link to={`/tvShow/${el.id}`}>
                      <img
                        src={
                          el.poster_path === null
                            ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                            : "https://image.tmdb.org/t/p/original" +
                              el.poster_path
                        }
                        className="relative w-4/5 rounded-md h-4/5"
                        alt="poster de peliculas populares"
                      />
                    </Link>
                  </div>

                  <button
                    onClick={() => removeTvToTvList(el.id)}
                    className="absolute top-0 left-0 flex items-center justify-center bg-red-500 w-9 h-9 btn"
                  >
                    <i className="ri-dislike-fill" />
                  </button>
                </SwiperSlide>
              );
            })
          ) : (
            <p className="text-center">
              No agregaste ninguna serie a favorito!
            </p>
          )}
        </SwiperCarousel>
      </div>
    </Element>
  );
};

export default FavoriteList;
