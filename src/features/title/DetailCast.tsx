import { SwiperSlide } from "swiper/react";
import SwiperCarousel from "@/components/ui/SwiperCarousel";
import type { Credits } from "@/types/tmdb";

const DetailCast = ({ dataCredits }: { dataCredits: Credits | null }) => {
  return (
    <>
      {/* Movie cast - elenco de pelicula */}
      <div className="w-full lg:mt-12">
        <div className="m-auto w-9/12 1024:w-full">
          <span className="font-cineFontFamily text-lg font-semibold underline">
            Reparto principal
          </span>
        </div>
        <div className="select-none">
          <SwiperCarousel>
            {dataCredits?.cast?.map((e) => (
              <SwiperSlide key={e.id}>
                <div className="w-full object-cover">
                  <img
                    className="h-full w-full rounded-md"
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
