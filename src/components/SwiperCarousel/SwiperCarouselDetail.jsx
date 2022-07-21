import React from "react";
import { Swiper } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "./SwiperCarousel.css"
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SwiperCarouselDetail = ({ children }) => {
  return (
    <Swiper
      grabCursor={true}
      modules={[Pagination, Navigation]}
      navigation={true}
      className="mySwiperDetail"
      breakpoints={{
        0: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 3.1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 4.2,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 4.2,
          spaceBetween: 10,
        },
        1280: {
          slidesPerView: 5.2,
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

export default SwiperCarouselDetail;
