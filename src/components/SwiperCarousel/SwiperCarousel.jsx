import React from "react";
import { Swiper } from "swiper/react";
import "./SwiperCarousel.css"
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
      modules={[FreeMode, Navigation]}
      className="mySwiper"
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
      
    >
      {children}
    </Swiper>
  );
};

export default SwiperCarousel;
