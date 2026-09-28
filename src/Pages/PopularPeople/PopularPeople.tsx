import { Element } from "react-scroll";
import PaginationCont from "../../components/Pagination/PaginationCont";
import usePopularData from "../../hooks/usePopularData";
import Loading from "../../components/Loading/Loading";
import { usePagination } from "../../hooks/usePagination";
import type { PersonSummary } from "../../types/tmdb";
const PopularPeople = ({ typePopular }: { typePopular: string }) => {
  const { currentPage, goBack, buttonPagination, goNext } = usePagination();
  const { data, loading } = usePopularData<PersonSummary>(typePopular, currentPage);

  if (loading) return <Loading />;

  return (
    <Element name="popularElement">
      <div>
        <div className="mt-7 mb-7 text-center">
          <span className="text-2xl">Popular People</span>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {data?.map((e) => {
            return (
              <div key={e.id}>
                <img
                  className="w-[235px] object-cover"
                  src={
                    e.profile_path === null
                      ? "https://i.ibb.co/DLSk8bk/default-image.png"
                      : `https://www.themoviedb.org/t/p/w235_and_h235_face${e.profile_path}`
                  }
                  alt={`Foto cara de ${e.name}`}
                  loading="lazy"
                />
                <span>{e.name}</span>
              </div>
            );
          })}
        </div>
        <PaginationCont
          goBack={goBack}
          buttonPagination={buttonPagination}
          goNext={goNext}
          currentPage={currentPage}
        />
      </div>
    </Element>
  );
};

export default PopularPeople;
