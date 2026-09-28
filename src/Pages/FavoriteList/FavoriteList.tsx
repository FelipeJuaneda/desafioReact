import { Link } from "react-router";
import { SwiperSlide } from "swiper/react";

import { useFavoriteContext } from "../../contexts/FavoriteContext";
import SwiperCarousel from "../../components/SwiperCarousel/SwiperCarousel";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import type { MovieDetail, TvDetail } from "../../types/tmdb";

const FavoriteList = () => {
  const { favoritemovie, removeMovieToFavorite, removeTvToTvList, favoritetv } =
    useFavoriteContext();

  const generateFavoriteSection = (
    list: Array<MovieDetail | TvDetail>,
    removeFunction: (id: number) => void,
    type: "Peliculas" | "Series",
  ) => {
    return (
      <div>
        <div className="flex justify-center pt-4 pb-4">
          <span className="flex gap-2 font-cineFontFamily text-3xl">
            <i className={`ri-heart-fill text-red-500`} /> {type} Favoritas{" "}
            <i className={`ri-heart-fill text-red-500`} />
          </span>
        </div>
        <SwiperCarousel>
          {list.length > 0 ? (
            list.map((el) => (
              <SwiperSlide key={el.id}>
                <div className="w-full object-cover">
                  <Link to={`/${type === "Peliculas" ? "film" : "tvShow"}/${el.id}`}>
                    <img
                      src={
                        el.poster_path === null
                          ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                          : "https://image.tmdb.org/t/p/w220_and_h330_face" + el.poster_path
                      }
                      className="h-full w-full rounded-md"
                      alt={`poster de ${type.toLowerCase()} populares`}
                      loading="lazy"
                    />
                  </Link>
                </div>

                <button
                  onClick={() => removeFunction(el.id)}
                  className="btn absolute top-0 left-0 flex h-9 w-9 items-center justify-center bg-red-500"
                >
                  <i className="ri-dislike-fill" />
                </button>
              </SwiperSlide>
            ))
          ) : (
            <p className="text-center">
              No agregaste ninguna {type.toLowerCase().slice(0, -1)} a favorito!
            </p>
          )}
        </SwiperCarousel>
      </div>
    );
  };

  return (
    <section>
      {generateFavoriteSection(favoritemovie, removeMovieToFavorite, "Peliculas")}
      {generateFavoriteSection(favoritetv, removeTvToTvList, "Series")}
    </section>
  );
};

export default FavoriteList;
