/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import styles from "../page_css/MyCoupon.module.css";
import CouponCard from "./CouponCard";
import axios from "axios";
import icon_warning from "../../assets/images/icon_warning.svg";

// 쿠폰 정보
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
  const [memberId, setMemberId] = useState("user123");
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    async function fetchCoupons() {
      console.log("coupon axios");

      try {
        const response = await axios.post(`${import.meta.env.VITE_BACK_PORT}/coupon/coupon-list`,
          null,
          {
            params: {
              memberId: memberId,
              page: currentPage,
              size: pageSize,
            },
          }
        );
        console.log("API Response:", response.data.content);
        const couponData = response.data.content;

        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        }
        if (couponData && couponData.length > 0) {
          console.log("Coupon Data:", couponData);
          setCoupons(couponData);
        }

        if (response.data.totalElements) {
          setTotalElements(response.data.totalElements);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        alert("쿠폰 조회 중 오류가 발생했습니다.");
      }
    }

    fetchCoupons();
  }, [memberId, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const pages: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(i + 1);
  }

  console.log("페이지 배열 > " + pages);

  return (
    <div>
      <div className={styles.couponTest}>
        <h3>
          <span className={styles.tossface}>😀</span>
          {memberId}님 반갑습니다.
        </h3>
        <div>
          <CouponCard totalElements={totalElements} />
        </div>
        <div>
          {coupons === undefined || (coupons && coupons.length === 0) ? (
            <div style={{ alignItems: "center" }}>
              <img
                src={icon_warning}
                style={{ width: "1.2rem", marginBottom: "1vw" }}
              />
              <span style={{ fontSize: "1.2rem" }}>등록된 쿠폰이 없습니다</span>
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
