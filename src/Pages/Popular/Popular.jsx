import StarsItems from "../../components/StarsCalification/StarsItems";
import { Link } from "react-router-dom";
import PaginationCont from "../../components/Pagination/PaginationCont";
import StarsCalification from "../../components/StarsCalification/StarsCalification";
import { SwiperSlide } from "swiper/react";
import SwiperCarousel from "../../components/SwiperCarousel/SwiperCarousel";
import SearchForm from "../../components/SearchForm/SearchForm";
import usePopularData from "../../hooks/usePopularData";
import Loading from "../../components/Loading/Loading";
import { useEffect, useState } from "react";
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
  const [startsList] = useAutoAnimate();

  useEffect(() => {
    setFilteredData([]);
  }, [data]);

  const handleFilterData = (filteredData) => {
    setFilteredData(filteredData);
    setHasFilter(true);
  };

  if (loading) return <Loading />;

  return (
    <div id="popularMovieElement">
      <div className="text-center ">
        <div className="navbar navbar-light bg-light">
          <div className="flex flex-row flex-wrap items-center 768:flex-col md:pb-5 md:pt-5 justify-evenly 768:pt-3 768:pb-3">
            {/* componente de estrellas */}
            <StarsCalification
              data={data}
              setHasFilter={setHasFilter}
              setFilteredData={handleFilterData}
            />
            {/* Buscador */}
            <SearchForm getPopularData={getPopularData} />
          </div>
        </div>
        {/* aca se imprimen los filtrados por estrellas */}
        <div ref={startsList}>
          {hasFilter && (
            <StarsItems
              title={title}
              to={to}
              data={filteredData}
              hasFilter={hasFilter}
            />
          )}
        </div>
        <div className="p-6 768:p-3">
          <span className="text-4xl text-uppercase fs-2 font-monospace">
            {title}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center select-none popularMoviesCont gap-7 xl:w-3/4 xl:m-auto">
          <SwiperCarousel>
            {data?.map((el) => {
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
                  <div className="object-cover w-full ">
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
        </div>

        <PaginationCont
          pagination={pagination}
          goBack={goBack}
          buttonPagination={buttonPagination}
          goNext={goNext}
        />
      </div>
    </div>
  );
};

export default Popular;
