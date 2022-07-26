import React from "react";
import { Element } from "react-scroll";
import { useAppContext } from "../contexts/AppContext";
import PaginationCont from "../Pagination/PaginationCont";
const PopularPeople = () => {
  const { popularPeople } = useAppContext();
  return (
    <Element name="popularElement">
      <div>
        <div className="text-center mt-7 mb-7">
          <span className="text-2xl">Popular People</span>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {popularPeople
            ? popularPeople.map((e) => {
                return (
                  <div key={e.id} className="">
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
        </div>
        <PaginationCont />
      </div>
    </Element>
  );
};

export default PopularPeople;
