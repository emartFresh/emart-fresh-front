/* eslint-disable @typescript-eslint/no-unused-vars */

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
  const [eventList, setEventList] = useState<Array<{ eventId: number, eventBannerImage: string }>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACK_PORT}/event/now-event-list`)
    .then((res) => {
      setEventList(res.data);
    })
    .catch(console.error)
  }, [])  

  const showEventDetail = (eventId: number) => {
    navigate('/eventlistdetail/' + eventId);
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
      modules: [Pagination, Navigation, Autoplay],
      className: "homeSwiper",
    } as SwiperProps}
    >
      {
        eventList.map((event) => {         
          return <SwiperSlide key={event.eventId}><img src={event.eventBannerImage} alt="" onClick={() => showEventDetail(event.eventId)}/></SwiperSlide> 
        })
      }
    </Swiper>
  )
}

export default HomeEventBanner


// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Swiper as SwiperCore } from 'swiper/core';
// import { Swiper as SwiperReact } from 'swiper/react';

// const HomeEventBanner = () => {
//   const [eventList, setEventList] = useState<string[]>([]);
//   const navigate = useNavigate();
//   const swiperRef = React.createRef<SwiperCore | null>();

//   const initializeSwiper = () => {
//     if (swiperRef.current) {
//       // 이미 Swiper가 초기화되었다면 파괴
//       swiperRef.current.destroy();
//     }

//     // Swiper 초기화
//     swiperRef.current = new SwiperCore('.homeSwiper', {
//       spaceBetween: 30,
//       centeredSlides: true,
//       loop: true,
//       autoplay: {
//         delay: 2500,
//         disableOnInteraction: true,
//       },
//       pagination: {
//         clickable: true,
//       },
//       navigation: true,
//       modules: [Autoplay, Pagination, Navigation],
//     });
//   };

//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_BACK_PORT}/event/now-event-list`)
//       .then((res) => {
//         setEventList(res.data);

//         if (swiperRef.current) {
//           // Swiper 초기화
//           initializeSwiper();
//         }
//       })
//       .catch(console.error);
//   }, []);

//   const showEventDetail = () => {
//     navigate('/eventlistdetail/10');
//     // 수정 : navigate('/eventlistdetail/' + eventId);
//   };

//   return (
//     <div className="homeSwiper">
//       <SwiperReact
//         className="swiper-container homeSwiper"
//         onSwiper={(swiper) => {
//           swiperRef.current = swiper; // 여기서 바로 할당하지 않음
//         }}
//       >
//         {eventList.map((eventImage) => (
//           <SwiperSlide key={eventImage}>
//             <img src={eventImage} alt="" onClick={() => showEventDetail()} />
//           </SwiperSlide>
//         ))}
//       </SwiperReact>
//     </div>
//   );
// };

// export default HomeEventBanner;
