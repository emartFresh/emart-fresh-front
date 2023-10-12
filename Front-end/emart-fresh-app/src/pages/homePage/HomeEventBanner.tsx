
import { Swiper, SwiperSlide, SwiperProps } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './styles.css';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const HomeEventBanner = () => {
  const [eventList, setEventList] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACK_PORT}/event/now-event-list`)
    .then((res) => {
      setEventList(res.data);
    })
    .catch(console.error)
  }, [])  

  const showEventDetail = () => {
    navigate('/eventlistdetail/10');
    // 수정 : navigate('/eventlistdetail/' + eventId);
  }

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
          return <SwiperSlide key={eventImage}><img src={eventImage} alt="" onClick={() => showEventDetail()}/></SwiperSlide> 
        })
      }
    </Swiper>
  )
}

export default HomeEventBanner