/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import styles from "../page_css/MyCoupon.module.css";
import CouponCard from "./CouponCard";
import icon_warning from "../../assets/images/icon_warning.svg";

import { Link } from "react-router-dom";

import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { sendAxiosGetRequest } from "../../utils/userUtils";
import { GetUserAllInfo } from "../../utils/LoginUtils";
import { toast } from "react-toastify";

//쿠폰 정보
interface CouponData {
  couponId: number;
  memberId: string;
  couponTitle: string;
  couponType: number;
  couponExpirationDate: string;
  myCouponCount: number;
}

export default function MyCoupon() {
  console.log("마이쿠폰페이지");
  const pageSize = 5;
  const [coupons, setCoupons] = useState<CouponData[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const allMember = GetUserAllInfo();

  useEffect(() => {
    async function fetchCoupons() {
      console.log("리프레쉬토큰", loginToken);
      const url = `${import.meta.env.VITE_BACK_PORT}/coupon/coupon-list`;
      try {
        const response = await sendAxiosGetRequest(
          url,
          loginToken,
          setLoginToken,
          {
            page: currentPage,
            size: pageSize,
          }
        );
        console.log("API Response:", response);
        const couponData = response.content;

        if (response.totalPages) {
          setTotalPages(response.totalPages);
        }
        if (response.totalElements) {
          setTotalElements(response.totalElements);
        }
        if (couponData && couponData.length > 0) {
          console.log("Coupon Data:", couponData);
          setCoupons(couponData);
        } else {
          // alert("쿠폰내역이 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast.error("쿠폰 조회 중 오류가 발생했습니다.");
      }
    }

    fetchCoupons();
  }, [currentPage, loginToken]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const pages: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(i + 1);
  }

  return (
    <div className={styles.couponMain}>
      <p className={styles.couponUserName}>
        <span className={styles.tossface}>😀</span>&nbsp;&nbsp;
        {allMember.memberId}님 반갑습니다.&nbsp;&nbsp;
        <span className={styles.tossface}>😀</span>
      </p>
      <div>
        <CouponCard totalElements={totalElements} />
      </div>

      {coupons === undefined || (coupons && coupons.length === 0) ? (
        <div className={styles.couponNoItem}>
          <img src={icon_warning} className={styles.couponNoItemImage} />
          <span className={styles.couponTitleName}>
            고객님이 보유하신 쿠폰이 없습니다
          </span>

          {/* <div>다양한 쿠폰과 혜택을 받아보세요.</div> */}
          <div>
            <Link to="/mycoupon" className={styles.couponBtn}>
              쿠폰받으러가기
            </Link>
          </div>
        </div>
      ) : (
        coupons.map((coupon) => (
          <div key={coupon.couponId} className={styles.couponContainer}>
            <div className={styles.couponText}>{coupon.couponTitle}</div>
            <div className={styles.couponText}>
              할인율&nbsp;{coupon.couponType}%
            </div>
            <div className={styles.couponText}>
              ~{new Date(coupon.couponExpirationDate).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
      <div className={styles.paginationList}>
        {coupons && coupons.length > 0 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_event, value) => handlePageChange(value)}
          />
        )}
      </div>
    </div>
  );
}
