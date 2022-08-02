import React from "react";
import { useAppContext } from "../contexts/AppContext";
import StartItems from "../StartCalification/StartItems";
import { Link } from "react-router-dom";
import PaginationCont from "../Pagination/PaginationCont";
import StartCalification from "../StartCalification/StartCalification";
import pororoLoad from "../images/pororoLoad.gif";
import { Element } from "react-scroll";
import { SwiperSlide } from "swiper/react";
import SwiperCarousel from "../SwiperCarousel/SwiperCarousel";
import SearchForm from "../SearchForm/SearchForm";

const PopularMovies = () => {
  const { moviesList } = useAppContext();

  return (
    <Element name="popularElement" id="popularMovieElement">
      <div className="text-center ">
        <div className="navbar navbar-light bg-light">
          <div className="pt-5 pb-5 container-fluid justify-content-evenly">
            {/* componente de estrellas */}
            <StartCalification />
            {/* Buscador de peliculas */}
            <SearchForm />
          </div>
        </div>
        {/* aca se imprimen las peliculas filtradas por estrellas */}
        <StartItems />

        <span className=" text-uppercase fs-2 font-monospace">
          Peliculas Populares
        </span>
        <div className="flex flex-wrap items-center justify-center select-none popularMoviesCont gap-7">
          <SwiperCarousel>
            {moviesList ? (
              moviesList.map((el) => {
                return (
                  <SwiperSlide key={el.id}>
                    <div className="object-cover w-72 h-[432px]">
                      <Link to={`/film/${el.id}`}>
                        <img
                          src={
                            el.poster_path === null
                              ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                              : "https://image.tmdb.org/t/p/original" +
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
          </SwiperCarousel>
        </div>

        <PaginationCont />
      </div>
    </Element>
  );
};

export default PopularMovies;
