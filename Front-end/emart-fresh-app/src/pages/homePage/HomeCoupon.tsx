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

const HomeCoupon = () => {
  const [couponData, setCoupondata] = useState<CouponData[]>([]);  
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isLogined = IsLogin();
  const numberPerPage = 6
  const navigate = useNavigate();

  useEffect(() => {
    axios.get( `${import.meta.env.VITE_BACK_PORT}/coupon/coupon-all`, {
    params: {
      page: currentPage,
      size: numberPerPage,
    }})
    .then((res) => {
      setCoupondata(res.data.content);
      setTotalPages(res.data.totalPages);
    })
    .catch(console.error)
  }, [currentPage])

  const handlePage = (page: number) => {
    setCurrentPage(page);
    console.log(page);
    
  }

  const handleGetCoupon = (coupon: CouponData) => {
    if(!isLogined){
      const userResponse = confirm('로그인이 필요한 서비스입니다. 로그인하시겠습니까?');
      if(userResponse){
        navigate("/login");
      }
    }else{
      sendAxiosRequest(
        "/coupon/coupon-create",
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
      .then((res) => 
        console.log("쿠폰받기성공" + res)
      )
      .catch(() => {
        console.error()
        alert('쿠폰받기에 실패했습니다.');      
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
                  <div className={styles.coupon} key={coupon.couponId}>
                    <div className={styles.couponContent}>
                      <div className={styles.couponTitle}>{coupon.couponTitle}</div>
                      <div>{coupon.couponType}%</div>
                      <div>{formatFullDate(coupon.couponExpirationDate)}까지</div>
                    </div>
                    <button 
                      className={styles.couponDownloadBtn}
                      onClick={() => {handleGetCoupon(coupon), console.log(coupon)}
                      }
                    >쿠폰받기</button>
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




