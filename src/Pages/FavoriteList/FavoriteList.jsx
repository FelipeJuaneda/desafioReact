import React from "react";
import { Link } from "react-router-dom";
import { SwiperSlide } from "swiper/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { useFavoriteContext } from "../../contexts/FavoriteContext";
import SwiperCarousel from "../../components/SwiperCarousel/SwiperCarousel";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const FavoriteList = () => {
  const { favoritemovie, removeMovieToFavorite, removeTvToTvList, favoritetv } =
    useFavoriteContext();
  const animationRef = useAutoAnimate();

  const generateFavoriteSection = (list, removeFunction, type) => {
    return (
      <div ref={animationRef}>
        <div className="flex justify-center pt-4 pb-4">
          <span className="flex gap-2 text-3xl font-cineFontFamily ">
            <i className={`ri-heart-fill text-red-500`} /> {type} Favoritas{" "}
            <i className={`ri-heart-fill text-red-500`} />
          </span>
        </div>
        <SwiperCarousel>
          {list.length > 0 ? (
            list.map((el) => (
              <SwiperSlide key={el.id}>
                <div className="object-cover w-72 h-[432px]">
                  <Link
                    to={`/${type === "Peliculas" ? "film" : "tvShow"}/${el.id}`}
                  >
                    <img
                      src={
                        el.poster_path === null
                          ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                          : "https://image.tmdb.org/t/p/original" +
                            el.poster_path
                      }
                      className="relative w-4/5 rounded-md h-4/5"
                      alt={`poster de ${type.toLowerCase()} populares`}
                    />
                  </Link>
                </div>

                <button
                  onClick={() => removeFunction(el.id)}
                  className="absolute top-0 left-0 flex items-center justify-center bg-red-500 w-9 h-9 btn"
                >
                  <i className="ri-dislike-fill" />
                </button>
              </SwiperSlide>
            ))
          ) : (
            <p className="text-center">
              No agregaste ninguna {type.toLowerCase()} a favorito!
            </p>
          )}
        </SwiperCarousel>
      </div>
    );
  };

  return (
    <section>
      {generateFavoriteSection(
        favoritemovie,
        removeMovieToFavorite,
        "Peliculas"
      )}
      {generateFavoriteSection(favoritetv, removeTvToTvList, "Series")}
    </section>
  );
};

export default FavoriteList;
