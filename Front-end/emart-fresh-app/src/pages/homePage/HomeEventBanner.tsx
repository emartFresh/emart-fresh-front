
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
  const [eventList, setEventList] = useState<string[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACK_PORT}/event/now-event-list`)
    .then((res) => {
      console.log(res.data);
      setEventList(res.data);
    })
    .catch(console.error)
  }, [])  


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
      {
        eventList.map((eventImage) => {
          return <SwiperSlide key={eventImage}><img src={eventImage} alt="" /></SwiperSlide> 
        })
      }
    </Swiper>
  )
}

export default HomeEventBanner