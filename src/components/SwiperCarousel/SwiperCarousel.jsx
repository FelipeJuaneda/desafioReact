import React from "react";
import { Swiper } from "swiper/react";
import "./SwiperCarousel.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FreeMode, Navigation } from "swiper";
const SwiperCarousel = ({ children }) => {
  return (
    <Swiper
      grabCursor={true}
      rewind={true}
      freeMode={true}
      navigation={true}
      lazy={true}
      modules={[FreeMode, Navigation]}
      className="mySwiper"
      spaceBetween={15}
      breakpoints={{
        0: {
          slidesPerView: 2.8,
        },
        480: {
          slidesPerView: 4.3,
        },
        768: {
          slidesPerView: 5.4,
        },
        1024: {
          slidesPerView: 4.5,
        },
        1280: {
          slidesPerView: 5.1,
        },
        1440: {
          slidesPerView: 5.5,
        },
      }}
    >
      {children}
    </Swiper>
  );
};

export default SwiperCarousel;
