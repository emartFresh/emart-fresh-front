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
import { GetUserAllInfo, GetUserName } from "../../utils/LoginUtils";

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
  const [memberId, setMemberId] = useState("");
  const [coupons, setCoupons] = useState<CouponData[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  GetUserName();
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
        alert("쿠폰 조회 중 오류가 발생했습니다.");
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
  const allMember = GetUserAllInfo();
  allMember.memberId;
  return (
    <div>
      <div className={styles.couponMain}>
        <h3>
          <span className={styles.tossface}>😀</span>
          {allMember.memberId}님 반갑습니다.
          <span className={styles.tossface}>😀</span>
        </h3>
        <div>
          <CouponCard totalElements={totalElements} />
        </div>
        <div>
          {coupons === undefined || (coupons && coupons.length === 0) ? (
            <div className={styles.couponNoItem}>
              <img
                src={icon_warning}
                style={{ width: "1.2rem", marginBottom: "0.6rem" }}
              />
              <span style={{ fontSize: "1.2rem" }}>
                고객님이 보유하신 쿠폰이 없습니다
              </span>
              <div>다양한 쿠폰과 혜택을 받아보세요.</div>
              <div>
                <Link to="/mycoupon" className={styles.couponBtn}>
                  쿠폰받으러가기
                </Link>
              </div>
            </div>
          ) : (
            coupons.map((coupon) => (
              <div key={coupon.couponId} className={styles.couponWrapper}>
                <div className={styles.couponContainer}>
                  <div className={styles.couponText}>{coupon.couponTitle}</div>
                  <div className={styles.couponText}>{coupon.couponType}%</div>
                  <div className={styles.couponText}>
                    ~
                    {new Date(coupon.couponExpirationDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}

          <div className={styles.paginationList}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => handlePageChange(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
