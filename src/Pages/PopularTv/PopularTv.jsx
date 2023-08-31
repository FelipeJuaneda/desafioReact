import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import PaginationCont from "../../components/Pagination/PaginationCont";
import StartCalification from "../../components/StartCalification/StartCalification";
import StartItems from "../../components/StartCalification/StartItems";
import pororoLoad from "../../images/pororoLoad.gif";
import { Element } from "react-scroll";
import { SwiperSlide } from "swiper/react";
import SwiperCarousel from "../../components/SwiperCarousel/SwiperCarousel";
import SearchForm from "../../components/SearchForm/SearchForm";

const PopularTv = () => {
  const { tvPopularList } = useAppContext();
  return (
    <Element name="popularElement">
      <div className="text-center">
        <div>
          <div className="navbar navbar-light bg-light">
            <div className="md:pb-5 md:pt-5 container-fluid justify-content-evenly 768:pt-3 768:pb-3">
              {/* componente de estrellas */}
              <StartCalification />
              {/* Buscador de series */}
              <SearchForm />
            </div>
          </div>
          {/* aca se imprimen las peliculas filtradas por estrellas */}
          <StartItems />
        </div>
        <span className="text-center text-uppercase fs-2 font-monospace">
          Series Populares
        </span>
        <div className="flex flex-wrap items-center justify-center select-none popularTvCont gap-7">
          <SwiperCarousel>
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
          </SwiperCarousel>
        </div>

        <PaginationCont />
      </div>
    </Element>
  );
};

export default PopularTv;
