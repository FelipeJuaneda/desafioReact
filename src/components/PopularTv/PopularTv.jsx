import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import PaginationCont from "../Pagination/PaginationCont";
import StartCalification from "../StartCalification/StartCalification";
import StartItems from "../StartCalification/StartItems";
import pororoLoad from "../images/pororoLoad.gif";
import "./PopularTv.css";
import { Element } from "react-scroll";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const PopularTv = () => {
  const { tvPopularList, setSearchKey, searchMovies, setStartsList } =
    useAppContext();
  return (
    <Element name="popularElement">
      <div className="text-center">
        <div>
          <div className="navbar navbar-light bg-light">
            <div className="pt-5 pb-5 container-fluid justify-content-evenly">
              {/* componente de estrellas */}
              <StartCalification />
              <form onSubmit={searchMovies} className="d-flex">
                <input
                  onChange={(e) => {
                    setSearchKey(e.target.value);
                    setStartsList(undefined);
                  }}
                  className="form-control me-2"
                  type="search"
                  placeholder="Buscar"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">
                  Buscar
                </button>
              </form>
            </div>
          </div>
          {/* aca se imprimen las peliculas filtradas por estrellas */}
          <StartItems />
        </div>
        <span className="text-center text-uppercase fs-2 font-monospace">
          Popular Tv Shows
        </span>
        <div className="popularTvCont">
          <Swiper
            loop={true}
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
            {tvPopularList ? (
              tvPopularList.map((el) => {
                return (
                  <SwiperSlide key={el.id}>
                    <div
                      className="object-cover w-72"
                      style={{ height: "432px" }}
                    >
                      <Link to={`/tvShow/${el.id}`}>
                        <img
                          src={
                            el.poster_path === null
                              ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                              : "https://image.tmdb.org/t/p/w300/" +
                                el.poster_path
                          }
                          className="w-4/5 rounded-md h-4/5"
                          alt="poster de peliculas populares"
                        />
                      </Link>
                    </div>
                  </SwiperSlide>
                );
              })
            ) : (
              <img src={pororoLoad} alt="Pochoclo cargando" />
            )}
          </Swiper>
        </div>

        <PaginationCont />
      </div>
    </Element>
  );
};

export default PopularTv;
