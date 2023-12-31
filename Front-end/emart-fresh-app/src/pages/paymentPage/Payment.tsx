/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";

import styles from "../page_css/Payment.module.css";
import Dopay from "./DoPay";
import CopuonApply from "./CopuonApply";
import { formatKoreanCurrency } from "../../utils/formatUtils";

interface PaymentProps {
  setOpenPayment: React.Dispatch<React.SetStateAction<boolean>>;
  cartInfo: CartData[];
  setReRender: React.Dispatch<React.SetStateAction<number>>;
}

export interface ItemData {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface Coupon {
  couponExpirationDate: string;
  couponId: number;
  couponTitle: string;
  couponType: number;
  memberId: string;
}

export default function Payment({
  setOpenPayment,
  cartInfo,
  setReRender,
}: PaymentProps) {
  const [itemData, setItemData] = useState<ItemData[]>();
  const [totalPriceAf, setTotalPriceAf] = useState<number>();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon>({
    couponExpirationDate: "",
    couponId: null,
    couponTitle: "",
    couponType: 0,
    memberId: "",
  });

  useEffect(() => {
    let totalPrice = 0;
    const items =
      cartInfo &&
      cartInfo.map((item) => {
        totalPrice +=
          item.priceNumber *
          (1 - appliedCoupon.couponType / 100) * //수정 : productTimeSale (떙처리)적용
          item.cartProductQuantity;
        return {
          id: String(item.productId),
          name: item.productTitle,
          qty: item.cartProductQuantity,
          price: item.priceNumber * (1 - appliedCoupon.couponType / 100),
        };
      });

    setItemData(items);
    setTotalPriceAf(totalPrice);
  }, [appliedCoupon, cartInfo]);

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.closeBtnWrapper}>
        <button
          onClick={() => setOpenPayment(false)}
          className={styles.closeBtn}
        >
          ✖
        </button>
      </div>
      <CopuonApply
        setAppliedCoupon={setAppliedCoupon}
        appliedCoupon={appliedCoupon}
      />
      <div className={styles.allPayWrapper}>
        <div className={styles.applyCouponWrapper}>
          <span className={styles.applyCoupon}>적용 쿠폰 </span>
          <span>{appliedCoupon.couponTitle}</span>
          <br />
          <div>
            <span className={styles.applyCouponDis}>쿠폰 할인률</span>
            <span> {appliedCoupon.couponType}%</span>
          </div>
        </div>
        <div className={styles.oneLine}></div>
        <div className={styles.totalPriceWrapper}>
          <span className={styles.totalPriceTitle}>총 결제액 </span>
          <span>{totalPriceAf && formatKoreanCurrency(totalPriceAf)}원</span>
        </div>
      </div>
      <Dopay
        itemData={itemData}
        totalPriceAf={totalPriceAf}
        appliedCoupon={appliedCoupon}
        setOpenPayment={setOpenPayment}
        setReRender={setReRender}
      />
    </div>
  );
}
