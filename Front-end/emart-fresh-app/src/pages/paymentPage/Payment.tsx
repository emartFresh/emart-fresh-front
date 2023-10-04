import React, { useState, useEffect } from "react";
import styles from "../page_css/Payment.module.css";
import Dopay from "./DoPay";
import CopuonApply from "./CopuonApply";

interface PaymentProps {
  cartInfo: CartData[];
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

export default function Payment({ cartInfo }: PaymentProps) {
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
    console.log("인포", cartInfo);
    let totalPrice = 0;
    const items =
      cartInfo &&
      cartInfo.map((item) => {
        console.log("아이디", item.productId);
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

    console.log("이거 이거");
    setItemData(items);
    setTotalPriceAf(totalPrice);
  }, [appliedCoupon, cartInfo]);

  return (
    <div className={styles.paymentContainer}>
      가게 위치 및 이름 보여주기
      <hr />
      <CopuonApply
        setAppliedCoupon={setAppliedCoupon}
        appliedCoupon={appliedCoupon}
      />
      총결제액:{totalPriceAf}
      <Dopay
        itemData={itemData}
        totalPriceAf={totalPriceAf}
        appliedCoupon={appliedCoupon}
      />
    </div>
  );
}
