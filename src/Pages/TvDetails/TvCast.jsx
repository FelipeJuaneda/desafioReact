import React from "react";
import { SwiperSlide } from "swiper/react";
import SwiperCarouselDetail from "../../components/SwiperCarousel/SwiperCarouselDetail";

const TvCast = ({ tvCredits }) => {
  return (
    <>
      {/* tv cast - elenco de serie */}
      <div className="w-full mt-12 swiperElencoCont 2xl:w-3/5">
        <span>Elenco:</span>
        <div className="select-none">
          <SwiperCarouselDetail>
            {tvCredits
              ? tvCredits.map((e) => (
                  <SwiperSlide style={{ width: "200px" }} key={e.id}>
                    <img
                      className="rounded-lg imgPerson w-[230px] h-[345px] object-cover 1024:w-[200px] 1024:h-[285px]"
                      src={
                        e.profile_path === null
                          ? "https://i.ibb.co/DLSk8bk/default-image.png"
                          : "https://image.tmdb.org/t/p/w200" + e.profile_path
                      }
                      alt="elenco de pelicula"
                    />
                    <span className="font-semibold">{e.name}</span>
                    <br />
                    <span className="text-stone-500">{e.character}</span>
                  </SwiperSlide>
                ))
              : null}
          </SwiperCarouselDetail>
        </div>
      </div>
    </>
  );
};

export default TvCast;
