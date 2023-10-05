/* eslint-disable @typescript-eslint/no-unused-vars */
import Card from "./Card";
import coupon from "../../assets/images/coupon.png";
import styles from "../page_css/MyCoupon.module.css";

interface CouponCardProps {
  totalElements: number;
}
export default function CouponCard({ totalElements }: CouponCardProps) {
  return (
    <Card title="쿠폰 조회">
      <div className={styles.couponIcon}>
        <img src={coupon} style={{ width: "200px", marginBottom: "0.6rem" }} />
        <p>총 보유쿠폰은 {totalElements} 장 입니다</p>
      </div>
    </Card>
  );
}
