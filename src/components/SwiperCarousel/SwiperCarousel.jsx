import React from "react";
import { Swiper } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode } from "swiper";
const SwiperCarousel = ({ children }) => {
  return (
    <Swiper
      loop={true}
      grabCursor={true}
      freeMode={true}
      breakpoints={{
        0: {
          slidesPerView: 1.5,
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 2.1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3.3,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 4.5,
          spaceBetween: 10,
        },
        1280: {
          slidesPerView: 5.1,
          spaceBetween: 10,
        },
        1440: {
          slidesPerView: 5.5,
          spaceBetween: 10,
        },
      }}
      modules={[FreeMode]}
      className="mySwiper"
    >
      {children}
    </Swiper>
  );
};

export default SwiperCarousel;
