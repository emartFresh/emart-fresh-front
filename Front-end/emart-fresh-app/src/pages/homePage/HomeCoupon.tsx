/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react'
import axios from 'axios'
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../page_css/HomeCoupon.module.css';


// const queryClient = new QueryClient();

// async function fetchCouponList() {
//     // const { data } = await axios.get('./coupon.json');
//     const result = fetch('/coupon.json').then(res => res.json());
//     return result;
//}

const fetchData =  () => {
  fetch("/coupon.json")
  .then((res) =>res.json())
  .then(result => console.log(result));    
};

const HomeCoupon = () => {

  useEffect(() => {
    fetchData();
    console.log("coupon data..");
  }, [])

    // useEffect(() =>
    //   const { isLoading, status, data, error, isFetching, isPreviousData } = useQuery({
    //     queryKey: ['couponList'],
    //     queryFn: fetchData,
    //     keepPreviousData: true,
    //     staleTime: 5000,
    //   })
    // })
      

    // if(isLoading) return <p>Loading...</p>;
    // if(error) return <p>{error}</p>;

  return (
    <div className={styles.couponContainer}>
        <div className={styles.couponHeader}>
          <FontAwesomeIcon icon={faBarcode} className={styles.barcodeIcon}/>
          <h3>쿠폰 받기</h3>
        </div>
        <div className={styles.couponWrap}>
          <div className={styles.coupon}>
            <div className={styles.couponContent}>
              <div>장바구니 쿠폰</div>
              <div>10%</div>
              <div>~2023.09.30</div>
            </div>
            <button className={styles.couponDownloadBtn}>쿠폰받기</button>
          </div>
          <div className={styles.coupon}>
            <div className={styles.couponContent}>
              <div>쿠폰명</div>
              <div>할인율</div>
              <div>유효기간</div>
            </div>
            <button className={styles.couponDownloadBtn}>쿠폰받기</button>
          </div>
          <div className={styles.coupon}>
            <div className={styles.couponContent}>
              <div>쿠폰명</div>
              <div>할인율</div>
              <div>유효기간</div>
            </div>
            <button className={styles.couponDownloadBtn}>쿠폰받기</button>
          </div>
          <div className={styles.coupon}>
            <div className={styles.couponContent}>
              <div>쿠폰명</div>
              <div>할인율</div>
              <div>유효기간</div>
            </div>
            <button className={styles.couponDownloadBtn}>쿠폰받기</button>
          </div>
          <div className={styles.coupon}>
            <div className={styles.couponContent}>
              <div>쿠폰명</div>
              <div>할인율</div>
              <div>유효기간</div>
            </div>
            <button className={styles.couponDownloadBtn}>쿠폰받기</button>
          </div>
          <div className={styles.coupon}>
            <div className={styles.couponContent}>
              <div>쿠폰명</div>
              <div>할인율</div>
              <div>유효기간</div>
            </div>
            <button className={styles.couponDownloadBtn}>쿠폰받기</button>
          </div>
        </div>
      </div>
  )
}

export default HomeCoupon




