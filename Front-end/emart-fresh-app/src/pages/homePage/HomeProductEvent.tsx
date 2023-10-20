/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import styles from "../page_css/HomeProductEvent.module.css";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faFaceSmileWink,
} from "@fortawesome/free-regular-svg-icons";
import { faGift, faGifts } from "@fortawesome/free-solid-svg-icons";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { SwiperProps } from "swiper/react";
import { useNavigate } from "react-router-dom";

interface HomeProductEventProps {
  eventProductData: ProductData[];
}

const HomeProductEvent = () => {
  const [selectedEventType, setSelectedEventType] = useState<number>(1);
  const currentMonth = new Date().getMonth() + 1;
  const [eventProductData, setEventProductHomeData] = useState<ProductData[]>(
    []
  );
  const [width, setWidth] = useState(window.innerWidth);
  const [itemCount, setItemcount] = useState(4);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  console.log("width", width);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      // cleanup
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    width <= 950
      ? setItemcount(2)
      : width <= 1200
      ? setItemcount(3)
      : setItemcount(4);
  }, [width]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACK_PORT}/product/all-product-list`)
      .then((response) => {
        setEventProductHomeData(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleEventType = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const btn = e.target as HTMLButtonElement;
    switch (btn.id) {
      case "eventTypeOne":
        setSelectedEventType(1);
        break;
      case "eventTypeTwo":
        setSelectedEventType(2);
        break;
      case "eventTypeThree":
        setSelectedEventType(3);
        break;
    }
  };

  const showProductDetail = (productId: number) => {
    navigate("/product/detail?product-id=" + productId);
  };

  return (
    <div className={styles.productEventContainer}>
      <div className={styles.eventType}>
        <div className={styles.eventTitle}>
          <FontAwesomeIcon icon={faCalendar} className={styles.calendarIcon} />
          <h3>{currentMonth}월 행사 상품</h3>
        </div>
        <button
          id="eventTypeOne"
          className={`${styles.eventTypeBtn} ${
            selectedEventType === 1 ? styles.selectedTypeBtn : ""
          }`}
          onClick={(e) => handleEventType(e)}
        >
          <FontAwesomeIcon
            icon={faFaceSmileWink}
            className={styles.eventTypeIcon}
          />{" "}
          1+1
        </button>
        <button
          id="eventTypeTwo"
          className={`${styles.eventTypeBtn} ${
            selectedEventType === 2 ? styles.selectedTypeBtn : ""
          }`}
          onClick={(e) => handleEventType(e)}
        >
          <FontAwesomeIcon icon={faGift} className={styles.eventTypeIcon} />
          2+1
        </button>
        <button
          id="eventTypeThree"
          className={`${styles.eventTypeBtn} ${
            selectedEventType === 3 ? styles.selectedTypeBtn : ""
          }`}
          onClick={(e) => handleEventType(e)}
        >
          <FontAwesomeIcon icon={faGifts} className={styles.eventTypeIcon} />
          2+2
        </button>

        {/* 반응형 */}
        <div>
          <button
            id="eventTypeOne"
            className={`${styles.eventTypeBtnRes} ${
              selectedEventType === 1 ? styles.selectedTypeBtnRes : ""
            }`}
            onClick={(e) => handleEventType(e)}
          >
            <FontAwesomeIcon
              icon={faFaceSmileWink}
              className={styles.eventTypeIcon}
            />{" "}
            1+1
          </button>
          <button
            id="eventTypeTwo"
            className={`${styles.eventTypeBtnRes} ${
              selectedEventType === 2 ? styles.selectedTypeBtnRes : ""
            }`}
            onClick={(e) => handleEventType(e)}
          >
            <FontAwesomeIcon icon={faGift} className={styles.eventTypeIcon} />
            2+1
          </button>
          <button
            id="eventTypeThree"
            className={`${styles.eventTypeBtnRes} ${
              selectedEventType === 3 ? styles.selectedTypeBtnRes : ""
            }`}
            onClick={(e) => handleEventType(e)}
          >
            <FontAwesomeIcon icon={faGifts} className={styles.eventTypeIcon} />
            2+2
          </button>
        </div>
      </div>

      <div className={styles.eventProducts}>
        <Swiper
          {...({
            centeredSlides: true,
            slidesPerView: 1,
            autoplay: {
              delay: 3500,
              disableOnInteraction: false,
            },
            pagination: {
              clickable: true,
            },
            navigation: false,
            modules: [Autoplay, Pagination, Navigation],
            className: "eventProductSwiper",
          } as SwiperProps)}
        >
          {eventProductData
            .filter((data: ProductData) => {
              if (selectedEventType === 1) {
                return data.productEvent === 1;
              } else if (selectedEventType === 2) {
                return data.productEvent === 2;
              } else if (selectedEventType === 3) {
                return data.productEvent === 3;
              }
            })
            .reduce(
              (
                chunks: ProductData[][],
                product: ProductData,
                index: number
              ) => {
                if (index % itemCount === 0) {
                  chunks.push([]);
                }
                chunks[chunks.length - 1].push(product);
                return chunks;
              },
              []
            )
            .map((chunk: ProductData[], chunkIndex: number) => (
              <SwiperSlide key={chunkIndex}>
                {chunk.map((product: ProductData) => (
                  <section
                    key={product.productId}
                    className={styles.productWrapper}
                  >
                    <div className={styles.productImgWrapper}>
                      <img
                        className={styles.productImg}
                        src={product.productImgUrl}
                        alt="no img"
                        onClick={() => showProductDetail(product.productId)}
                      />
                    </div>
                    <span className={styles.itemLine}></span>
                    <div
                      className={styles.titleWrapper}
                      onClick={() => showProductDetail(product.productId)}
                    >
                      {product.productTitle}
                    </div>
                    <div className={styles.priceInfo}>
                      {product.priceString}
                    </div>
                  </section>
                ))}
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeProductEvent;
