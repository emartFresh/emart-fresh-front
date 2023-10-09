
import { Swiper, SwiperSlide, SwiperProps } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './styles.css';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useEffect, useState } from "react";
import axios from "axios";



const HomeEventBanner = () => {
    
  return (
    <Swiper
    {...{
      spaceBetween: 30,
      centeredSlides: true,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        clickable: true,
      },
      navigation: true,
      modules: [Autoplay, Pagination, Navigation],
      className: "homeSwiper",
    } as SwiperProps}
    >
        <SwiperSlide><img src={image1} alt="" /></SwiperSlide>
        <SwiperSlide><img src={image2} alt="" /></SwiperSlide>
        <SwiperSlide><img src={image3} alt="" /></SwiperSlide>
        <SwiperSlide><img src={image4} alt="" /></SwiperSlide>
        <SwiperSlide><img src={image5} alt="" /></SwiperSlide>
        <SwiperSlide><img src={image6} alt="" /></SwiperSlide>
        <SwiperSlide><img src={image7} alt="" /></SwiperSlide>
        <SwiperSlide><img src={image8} alt="" /></SwiperSlide>
        <SwiperSlide><img src={image9} alt="" /></SwiperSlide>
    </Swiper>
  )
}

export default HomeEventBanner