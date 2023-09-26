import React, { useState, useEffect } from "react";
import styles from "../page_css/Payment.module.css";
import Dopay from "./DoPay";
import CopuonApply from "./CopuonApply";

interface CartInfo {
  cartId: number;
  cartProductId: number;
  productTitle: string;
  priceNumber: number;
  cartProductQuantity: number;
  storeId: number;
  productEvent: number;
}

interface PaymentProps {
  cartInfo: CartInfo[];
  totlaPrice: number;
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
    couponId: 0,
    couponTitle: "",
    couponType: 0,
    memberId: "",
  });

  cartInfo = [
    //수정 : 삭제하기3

    {
      cartId: 1,
      cartProductId: 1,
      productTitle: "Product A",
      priceNumber: 1000,
      cartProductQuantity: 20,
      storeId: 1,
      productEvent: 30,
    },
    {
      cartId: 1,
      cartProductId: 1,
      productTitle: "Product B",
      priceNumber: 2000,
      cartProductQuantity: 30,
      storeId: 1,
      productEvent: 0,
    },
  ];

  useEffect(() => {
    let totalPrice = 0;
    const items =
      cartInfo &&
      cartInfo.map((item) => {
        totalPrice +=
          item.priceNumber *
          (1 - appliedCoupon.couponType / 100) *
          item.cartProductQuantity;
        return {
          id: String(item.cartId),
          name: item.productTitle,
          qty: item.cartProductQuantity,
          price: item.priceNumber * (1 - appliedCoupon.couponType / 100),
        };
      });
    setItemData(items);
    setTotalPriceAf(totalPrice);
  }, [appliedCoupon]);

  return (
    <div className={styles.paymentContainer}>
      가게 위치 및 이름 보여주기
      <hr />
      <CopuonApply
        setAppliedCoupon={setAppliedCoupon}
        appliedCoupon={appliedCoupon}
      />
      총결제액:{totalPriceAf}
      <Dopay itemData={itemData} totalPriceAf={totalPriceAf} />
    </div>
  );
}
