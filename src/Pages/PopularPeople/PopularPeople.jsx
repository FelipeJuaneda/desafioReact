import React from "react";
import { Element } from "react-scroll";
import PaginationCont from "../../components/Pagination/PaginationCont";
import usePopularData from "../../hooks/usePopularData";
import Loading from "../../components/Loading/Loading";
import { usePagination } from "../../hooks/usePagination";
const PopularPeople = ({ typePopular }) => {
  const { pagination, goBack, buttonPagination, goNext } = usePagination();
  const { data, loading } = usePopularData(typePopular, pagination);

  if (loading) {
    return <Loading />;
  }

  return (
    <Element name="popularElement">
      <div>
        <div className="text-center mt-7 mb-7">
          <span className="text-2xl">Popular People</span>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {data?.map((e) => {
            return (
              <div key={e.id} className="">
                <img
                  className="w-[235px] object-cover"
                  src={
                    e.profile_path === null
                      ? "https://i.ibb.co/DLSk8bk/default-image.png"
                      : `https://www.themoviedb.org/t/p/w235_and_h235_face${e.profile_path}`
                  }
                  alt="actor - actriz popular"
                />
                <span className="">{e.name}</span>
              </div>
            );
          })}
        </div>
        <PaginationCont
          goBack={goBack}
          buttonPagination={buttonPagination}
          goNext={goNext}
          pagination={pagination}
        />
      </div>
    </Element>
  );
};

export default PopularPeople;
