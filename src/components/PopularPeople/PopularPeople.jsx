import React from "react";
import { useAppContext } from "../contexts/AppContext";
import PaginationCont from "../Pagination/PaginationCont";
const PopularPeople = () => {
  const { popularPeople } = useAppContext();
  return (
    <div>
      <div className="text-center mt-7 mb-7">
        <span className="text-2xl">Popular People</span>
      </div>
      <div className="flex flex-wrap justify-center gap-5">
        {popularPeople
          ? popularPeople.map((e) => {
              return (
                <div className="">
                  <img
                    src={
                      e.profile_path === null
                        ? "https://i.ibb.co/DLSk8bk/default-image.png"
                        : `https://www.themoviedb.org/t/p/w235_and_h235_face${e.profile_path}`
                    }
                    alt="actor - actriz popular"
                    style={{
                      width: "235px",
                      height: "235px",
                      objectFit: "cover",
                    }}
                  />
                  <span className="">{e.name}</span>
                </div>
              );
            })
          : null}
        <PaginationCont />
      </div>
    </div>
  );
};

export default PopularPeople;
