import React from "react";
// import { useAppContext } from "../../contexts/AppContext";
import StartItems from "../../components/StartCalification/StartItems";
import { Link } from "react-router-dom";
import PaginationCont from "../../components/Pagination/PaginationCont";
import StartCalification from "../../components/StartCalification/StartCalification";
import notFoundMovie from "../../images/gifNotFound.gif";
import { Element } from "react-scroll";
import { SwiperSlide } from "swiper/react";
import SwiperCarousel from "../../components/SwiperCarousel/SwiperCarousel";
import SearchForm from "../../components/SearchForm/SearchForm";
import usePopularData from "../../hooks/usePopularData";
import useSearch from "../../hooks/useSearch";

const Popular = ({ typePopular, title, to }) => {
  const { data, loading } = usePopularData(typePopular);
  if (loading) {
    <img src={notFoundMovie} alt="Pelicula no encontrada" />;
  }
  return (
    <Element name="popularElement" id="popularMovieElement">
      <div className="text-center ">
        <div className="navbar navbar-light bg-light">
          <div className="md:pb-5 md:pt-5 container-fluid justify-content-evenly 768:pt-3 768:pb-3">
            {/* componente de estrellas */}
            <StartCalification />
            {/* Buscador */}
            <SearchForm />
          </div>
        </div>
        {/* aca se imprimen los filtrados por estrellas */}
        <StartItems />

        <span className=" text-uppercase fs-2 font-monospace">{title}</span>
        <div className="flex flex-wrap items-center justify-center select-none popularMoviesCont gap-7">
          <SwiperCarousel>
            {data?.map((el) => {
              return (
                <SwiperSlide key={el.id}>
                  <div className="object-cover w-72 h-[432px]">
                    <Link to={`/${to}/${el.id}`}>
                      <img
                        src={
                          el.poster_path === null
                            ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                            : "https://image.tmdb.org/t/p/original" +
                              el.poster_path
                        }
                        className="w-4/5 rounded-md h-4/5"
                        alt={`Poster de ${title}`}
                      />
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </SwiperCarousel>
        </div>

        <PaginationCont />
      </div>
    </Element>
  );
};

export default Popular;
