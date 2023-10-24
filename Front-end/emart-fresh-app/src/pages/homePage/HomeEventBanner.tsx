/* eslint-disable @typescript-eslint/no-unused-vars */

import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomeEventBanner = () => {
  const [eventList, setEventList] = useState<
    Array<{ eventId: number; eventBannerImage: string }>
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACK_PORT}/event/now-event-list`)
      .then((res) => {
        setEventList(res.data);
      })
      .catch(console.error);
  }, []);

  const showEventDetail = (eventId: number) => {
    navigate("/eventlistdetail/" + eventId);
  };

  return (
    <Swiper
      {...({
        spaceBetween: 30,
        centeredSlides: true,
        // loop: false,
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
      } as SwiperProps)}
    >
      {eventList.map((event) => {
        return (
          <SwiperSlide key={event.eventId}>
            <img
              src={event.eventBannerImage}
              alt=""
              onClick={() => showEventDetail(event.eventId)}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default HomeEventBanner;
