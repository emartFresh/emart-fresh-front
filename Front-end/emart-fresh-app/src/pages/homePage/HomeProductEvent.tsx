/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import styles from "../page_css/HomeProductEvent.module.css";
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faFaceSmileWink } from '@fortawesome/free-regular-svg-icons';
import { faGift, faGifts } from '@fortawesome/free-solid-svg-icons';
import product01 from '../../assets/images/product01.png';
import product07 from '../../assets/images/product07.png';
import product03 from '../../assets/images/product03.png';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './styles.css';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { SwiperProps } from 'swiper/react';

interface HomeProductEventProps{
  eventProductData:ProductData[];
}

const HomeProductEvent = ({eventProductData}:HomeProductEventProps) => {
  const [selectedEventType, setSelectedEventType] = useState<number>(1);
  const [mainThumbnail, setThumbnail] = useState<string>(product01);
  const currentMonth = new Date().getMonth() +1;

  const handleEventType = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const btn = e.target as HTMLButtonElement;
    switch(btn.id){
      case 'eventTypeOne' : 
        setSelectedEventType(1);
        setThumbnail(product01);
        break;
      case 'eventTypeTwo' : 
        setSelectedEventType(2);
        setThumbnail(product07);
        break;
      case 'eventTypeThree' : 
        setSelectedEventType(3);
        setThumbnail(product03);
        break; 
    }        
  } 

  return (
    <div className={styles.productEventContainer}>
        <div className={styles.eventType}>
          <div className={styles.eventTitle}>
            <FontAwesomeIcon 
              icon={faCalendar} 
              className={styles.calendarIcon} 
            />
            <h3>{currentMonth}월 행사 상품</h3>
          </div>
          <button 
            id='eventTypeOne'
            className={`${styles.eventTypeBtn} ${selectedEventType === 1 ? styles.selectedTypeBtn : ''}`} 
            onClick={(e) => handleEventType(e)}>
            <FontAwesomeIcon icon={faFaceSmileWink} className={styles.eventTypeIcon}/> 1+1
          </button>
          <button 
            id='eventTypeTwo'
            className={`${styles.eventTypeBtn} ${selectedEventType === 2 ? styles.selectedTypeBtn : ''}`}
            onClick={(e) => handleEventType(e)}>
            <FontAwesomeIcon icon={faGift} className={styles.eventTypeIcon}/>2+1
          </button>
          <button 
            id='eventTypeThree'
            className={`${styles.eventTypeBtn} ${selectedEventType === 3 ? styles.selectedTypeBtn : ''}`}
            onClick={(e) => handleEventType(e)}>
            <FontAwesomeIcon icon={faGifts} className={styles.eventTypeIcon}/>2+2
          </button>
        </div>

        <div className={styles.eventProducts}>
        <Swiper
        {...{
          spaceBetween: 30,
          centeredSlides: true,
          autoplay: {
            delay: 3500,
            disableOnInteraction: false,
          },
          pagination:{
            clickable: true,
          },
          navigation: false,
          modules:[Autoplay, Pagination, Navigation],
          className:"eventProductSwiper",
        } as SwiperProps}
          >
          {eventProductData.filter((data:ProductData) => {
            if(selectedEventType === 1){
              return data.productEvent === 1;
            }else if(selectedEventType === 2){
              return data.productEvent === 2;
            }else if(selectedEventType === 3){
              return data.productEvent === 3;
            }  
            })
          .reduce((chunks:ProductData[][], product:ProductData, index:number) => {
            // 데이터를 4개씩 묶기 위한 로직
            if (index % 4 === 0) {
              chunks.push([]);
            }
            chunks[chunks.length - 1].push(product);
            return chunks;
          }, []).map((chunk:ProductData[], chunkIndex:number) => (
            <SwiperSlide key={chunkIndex}>
              {chunk.map((product: ProductData, productId: number) => (
              <section key={productId} className={styles.productWrapper}>
                  <div className={styles.productImgWrapper}>
                    <img
                      className={styles.productImg}
                      // src={product.productImgUrl}
                      src={mainThumbnail}
                      alt="no img"
                    />
                  </div>
                  <span className={styles.itemLine}></span>
                  <div className={styles.titleWrapper}>
                      {product.productTitle}
                  </div>
                  <div className={styles.priceInfo}>{product.priceString}</div>
              </section>
              ))}
              </SwiperSlide>
            ))}
            </Swiper>
        </div>
      </div>
  )
}

export default HomeProductEvent