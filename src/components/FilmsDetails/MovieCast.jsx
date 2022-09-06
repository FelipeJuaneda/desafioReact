import React from "react";
import { SwiperSlide } from "swiper/react";
import SwiperCarouselDetail from "../SwiperCarousel/SwiperCarouselDetail";

const MovieCast = ({ filmCredits }) => {
  return (
    <>
      {/* Movie cast - elenco de pelicula */}
      <div className="w-full mt-12 swiperElencoCont 2xl:w-3/5">
        <span className="text-lg font-semibold underline font-cineFontFamily ">
          Elenco:
        </span>
        <div className="select-none">
          <SwiperCarouselDetail>
            {filmCredits
              ? filmCredits.map((e) => (
                  <SwiperSlide style={{ width: "200px" }} key={e.id}>
                    <img
                      className="rounded-lg imgPerson w-[230px] h-[345px] object-cover 1024:w-[200px] 1024:h-[285px]"
                      src={
                        e.profile_path === null
                          ? "https://i.ibb.co/DLSk8bk/default-image.png"
                          : `https://image.tmdb.org/t/p/w200${e.profile_path}`
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

export default MovieCast;
