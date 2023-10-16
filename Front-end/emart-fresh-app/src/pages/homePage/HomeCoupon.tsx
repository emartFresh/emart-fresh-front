/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../page_css/HomeCoupon.module.css';
import Pagination from "@mui/material/Pagination";
import { formatFullDate } from '../../utils/dateUtils';
import { IsLogin, SendLoginPageIfNotLogin } from '../../utils/LoginUtils';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { loginState } from '../../atoms';
import { sendAxiosRequest } from '../../utils/userUtils';
import { toast } from 'react-toastify';

const HomeCoupon = () => {
  const [couponData, setCoupondata] = useState<ExtendedCoupon[]>([]);  
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [initialSetter, setInitialSetter] = useState<number>(0);
  const isLogined = IsLogin();
  const numberPerPage = 6
  const navigate = useNavigate();

  useEffect(() => {
    if(isLogined){
      sendAxiosRequest('/coupon/coupon-all', 'get', loginToken, setLoginToken, {page: currentPage, size: numberPerPage})
      .then((res) => {
        // responseData 타입에 ExtendedCoupon[] 만 넣어준경우 
        // const content:ExtendedCoupon[] = res.contnet;
        // setCoupondata(content);

        const response: ExtendedCoupon[] = JSON.parse(JSON.stringify(res.content));
        setCoupondata(response);

        // 단언 : ExtendedCoupon[] 을 넣어준경우
        // if(typeof res.content === typeof couponData){
        //   const content:ExtendedCoupon[] = res.content as ExtendedCoupon[]; 
        //   setCoupondata(content);
        // }
        setTotalPages(JSON.parse(JSON.stringify(res.totalPages)));
        console.log(res);
      })
      .catch(console.error)
    }else{
      axios.get( `${import.meta.env.VITE_BACK_PORT}/coupon/coupon-all`, {
        params: {
          page: currentPage,
          size: numberPerPage,
        }
      })
      .then((res) => {
        setCoupondata(res.data.content);
        setTotalPages(res.data.totalPages);
        console.log(JSON.parse(JSON.stringify(res.data.content)));
      })
      .catch(console.error)
    }
  }, [isLogined, initialSetter,currentPage])

  const handlePage = (page: number) => {
    setCurrentPage(page);
    console.log(page);
    
  }


  const handleGetCoupon = (coupon: ExtendedCoupon) => {
    if(!isLogined){
      const userResponse = confirm('로그인이 필요한 서비스입니다. 로그인하시겠습니까?');
      if(userResponse){
        navigate("/login");
      }
    }else{
      sendAxiosRequest(
        "/coupon/coupon-down",
        "post",
        loginToken,
        setLoginToken,
        {
          couponId: coupon.couponId,
          couponExpirationDate: coupon.couponExpirationDate,
          couponType: coupon.couponType,
          couponTitle: coupon.couponTitle,
        }
      )
      .then((res) => {
        toast.success('쿠폰을 받았습니다 👏🏻')
        console.log("쿠폰받기성공" + res)
        const val = initialSetter + 1;
        setInitialSetter(val);
      }
      )
      .catch(() => {
        console.error()
        toast.error('쿠폰받기에 실패했습니다.');
      })
    }
  }

  return (
    <div className={styles.couponContainer}>
        <div className={styles.couponHeader}>
          <FontAwesomeIcon icon={faBarcode} className={styles.barcodeIcon}/>
          <h3>쿠폰 받기</h3>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.couponWrap}>
            {
              couponData.map((coupon) => {
                return(
                  <div key={coupon.couponId} className={`${coupon.existing ? styles.unableCoupon : styles.coupon}`}>
                    <div className={styles.couponContent}>
                      <div className={styles.couponTitle}>{coupon.couponTitle}</div>
                      <div>{coupon.couponType}%</div>
                      <div>{formatFullDate(coupon.couponExpirationDate)}까지</div>
                    </div>
                      <button 
                      className={`${coupon.existing ? styles.unableDownBtn : styles.couponDownloadBtn }`}
                      disabled={coupon.existing}
                      onClick={() => {handleGetCoupon(coupon)}}
                      >
                      {coupon.existing ? '받기 완료' : '쿠폰 받기'}</button>
                  </div>
                )
              })
            }
          </div>
          <div className={styles.paginationWrap}>
            <Pagination 
              count={totalPages} 
              page={currentPage}
              onChange={(event, value) => handlePage(value)}
            />
            </div>
        </div>
      </div>
  )
}

export default HomeCoupon




