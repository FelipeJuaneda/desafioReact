import StarsItems from "../../components/StarsCalification/StarsItems";
import { Link } from "react-router-dom";
import PaginationCont from "../../components/Pagination/PaginationCont";
import StarsCalification from "../../components/StarsCalification/StarsCalification";
import { Element } from "react-scroll";
import { SwiperSlide } from "swiper/react";
import SwiperCarousel from "../../components/SwiperCarousel/SwiperCarousel";
import SearchForm from "../../components/SearchForm/SearchForm";
import usePopularData from "../../hooks/usePopularData";
import Loading from "../../components/Loading/Loading";
import { useEffect, useState } from "react";
import { usePagination } from "../../hooks/usePagination";

const Popular = ({ typePopular, title, to }) => {
  const { pagination, goBack, buttonPagination, goNext } = usePagination();
  const { data, loading, getPopularData } = usePopularData(
    typePopular,
    pagination
  );
  const [filteredData, setFilteredData] = useState([]);
  const [hasFilter, setHasFilter] = useState(false);

  useEffect(() => {
    setFilteredData([]);
  }, [data]);

  const handleFilterData = (filteredData) => {
    setFilteredData(filteredData);
    setHasFilter(true);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Element name="popularElement" id="popularMovieElement">
      <div className="text-center ">
        <div className="navbar navbar-light bg-light">
          <div className="md:pb-5 md:pt-5 container-fluid justify-content-evenly 768:pt-3 768:pb-3">
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
        <StarsItems
          title={title}
          to={to}
          data={filteredData}
          hasFilter={hasFilter}
        />

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

        <PaginationCont
          pagination={pagination}
          goBack={goBack}
          buttonPagination={buttonPagination}
          goNext={goNext}
        />
      </div>
    </Element>
  );
};

export default Popular;
