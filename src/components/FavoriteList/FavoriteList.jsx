import React from "react";
import { Link } from "react-router-dom";
import { Element } from "react-scroll";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAppContext } from "../contexts/AppContext";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const FavoriteList = () => {
  const { watchlist, removeMovieToWatchList } = useAppContext();
  return (
    <Element name="favoriteListElement">
      <div>
        <div className="flex justify-center pt-4 pb-4">
          <span className="flex gap-2 text-3xl font-cineFontFamily ">
            <i className={`ri-heart-fill text-red-500`} /> Peliculas Favoritas{" "}
            <i className={`ri-heart-fill text-red-500`} />
          </span>
        </div>

        <Swiper
          freeMode={true}
          breakpoints={{
            0: {
              slidesPerView: 1.5,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 2.1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3.3,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 4.5,
              spaceBetween: 10,
            },
            1280: {
              slidesPerView: 5.1,
              spaceBetween: 10,
            },
            1440: {
              slidesPerView: 5.5,
              spaceBetween: 10,
            },
          }}
          modules={[FreeMode]}
          className="mySwiper"
        >
          {watchlist.length > 0 ? (
            watchlist.map((el) => {
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
                    onClick={() => removeMovieToWatchList(el.id)}
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
        </Swiper>
      </div>
    </Element>
  );
};

export default FavoriteList;
