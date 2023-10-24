import React, { useState } from "react";
import { Link } from "react-router-dom";
import PaginationCont from "../../components/Pagination/PaginationCont";
import StarsCalification from "../../components/StarsCalification/StarsCalification";
import { SwiperSlide } from "swiper/react";
import SwiperCarousel from "../../components/SwiperCarousel/SwiperCarousel";
import SearchForm from "../../components/SearchForm/SearchForm";
import usePopularData from "../../hooks/usePopularData";
import Loading from "../../components/Loading/Loading";
import { usePagination } from "../../hooks/usePagination";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Popular = ({ typePopular, title, to }) => {
  const { pagination, goBack, buttonPagination, goNext } = usePagination();
  const { data, loading, getPopularData } = usePopularData(
    typePopular,
    pagination
  );
  const [filteredData, setFilteredData] = useState([]);
  const [hasFilter, setHasFilter] = useState(false);
  const [starsList] = useAutoAnimate();
  const [otro] = useAutoAnimate();

  const handleFilterData = (filteredData) => {
    setFilteredData(filteredData);
    setHasFilter(true);
  };

  if (loading) return <Loading />;

  return (
    <div ref={starsList} id="popularMovieElement" className="text-center">
      <div className="bg-gray-100">
        <div className="flex flex-row flex-wrap items-center 768:flex-col md:pb-5 md:pt-5 justify-evenly 768:pt-3 768:pb-3">
          <StarsCalification
            data={data}
            setHasFilter={setHasFilter}
            setFilteredData={handleFilterData}
          />
          <SearchForm getPopularData={getPopularData} />
        </div>
      </div>

      <div className="p-6 768:p-3">
        <span className="text-4xl text-uppercase fs-2 font-monospace">
          {title}
        </span>
      </div>

      {hasFilter && filteredData.length === 0 ? (
        <p>{`No hay ${title.toLowerCase()} con esas estrellas en la pagina ${pagination}`}</p>
      ) : (
        <SwiperCarousel>
          {(hasFilter ? filteredData : data)?.map((el) => {
            const imageUrl = el.poster_path
              ? `https://image.tmdb.org/t/p/w220_and_h330_face${el.poster_path}`
              : "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg";

            const srcset = `
                ${imageUrl} 500w,
                ${imageUrl}?size=800 800w,
                ${imageUrl}?size=1200 1200w
              `;

            const sizes = `
                (max-width: 500px) 100vw,
                (max-width: 1200px) 50vw,
                1200px
              `;

            return (
              <SwiperSlide key={el.id}>
                <div className="object-cover w-full">
                  <Link to={`/${to}/${el.id}`}>
                    <img
                      src={imageUrl}
                      srcSet={srcset}
                      sizes={sizes}
                      loading="lazy"
                      className="w-full h-full rounded-md "
                      alt={`Poster de ${title}`}
                    />
                  </Link>
                </div>
              </SwiperSlide>
            );
          })}
        </SwiperCarousel>
      )}

      <PaginationCont
        pagination={pagination}
        goBack={goBack}
        buttonPagination={buttonPagination}
        goNext={goNext}
      />
    </div>
  );
};

export default Popular;
