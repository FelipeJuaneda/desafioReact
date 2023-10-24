import React from "react";
import { SwiperSlide } from "swiper/react";
import SwiperCarousel from "../../components/SwiperCarousel/SwiperCarousel";

const DetailCast = ({ dataCredits }) => {
  return (
    <>
      {/* Movie cast - elenco de pelicula */}
      <div className="w-full swiperElencoCont lg:m-auto lg:mt-12">
        <span className="text-lg font-semibold underline font-cineFontFamily">
          Elenco:
        </span>
        <div className="select-none">
          <SwiperCarousel>
            {dataCredits?.cast?.map((e) => (
              <SwiperSlide key={e.id}>
                <div className="object-cover w-full">
                  <img
                    className="w-full h-full rounded-md"
                    src={
                      e.profile_path
                        ? `https://image.tmdb.org/t/p/w200${e.profile_path}`
                        : "https://i.ibb.co/DLSk8bk/default-image.png"
                    }
                    alt={e.name}
                    loading="lazy"
                  />
                </div>
                <span className="font-semibold">{e.name}</span>
                <br />
                <span className="text-stone-500">{e.character}</span>
              </SwiperSlide>
            ))}
          </SwiperCarousel>
        </div>
      </div>
    </>
  );
};

export default DetailCast;
