import { Bootpay } from "@bootpay/client-js";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";
import { MemberInfo, GetUserAllInfo } from "../../utils/LoginUtils";
import { ItemData } from "./Payment";
import {
  sendAxiosPostRequest,
  sendAxiosGetRequest,
} from "../../utils/userUtils";
import { toast } from "react-toastify";

import { Coupon } from "./Payment";
import { useEffect, useState } from "react";
import styles from "../page_css/Payment.module.css";

interface OrderProduct {
  orderedQuantity: number;
  productId: number;
}

interface OrderProductNameQqt {
  productQuantity: number;
  productTitle: string;
}

interface DopayProp {
  itemData: ItemData[];
  totalPriceAf: number;
  appliedCoupon: Coupon;
  setOpenPayment: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Dopay({
  itemData,
  totalPriceAf,
  appliedCoupon,
  setOpenPayment,
}: DopayProp) {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [myCartStoreId, setMyCartStoreId] = useState<number>();

  const memberInfo: MemberInfo = GetUserAllInfo();

  console.log("내가 넣을 데이터", itemData);
  useEffect(() => {
    const storeUrl = `${import.meta.env.VITE_BACK_PORT}/cart/myCartStoreId`;

    sendAxiosGetRequest(storeUrl, loginToken, setLoginToken).then((res) => {
      setMyCartStoreId(res);
    });
  }, []);

  const deleteMyCoupon = () => {
    const url = `${import.meta.env.VITE_BACK_PORT}/coupon/coupon-delete`;
    sendAxiosPostRequest(url, loginToken, setLoginToken, {
      couponId: appliedCoupon.couponId,
    }).then((res) => {
      console.log("쿠폰 사용하였슴", res);
    });
  };

  console.log("가게 아이디22222", myCartStoreId);
  //수정 : 로직 고민...

  const preProcesse = async () => {
    const orderedProductProducts: OrderProductNameQqt[] = itemData?.map(
      (item) => {
        return {
          productQuantity: item.qty,
          productTitle: item.name,
        };
      }
    );

    //가게 재고 깎기
    const url = `${import.meta.env.VITE_BACK_PORT}/cart/decreaseStoreProduct`;
    sendAxiosPostRequest(
      url,
      loginToken,
      setLoginToken,
      orderedProductProducts
    ).then((res) => {
      alert("ㅇㅇㅇ");
      console.log("응답", res);
      requestPayment();
    });
  };

  // 내 장바구니 수량 깎기
  const decreaseMyCart = async () => {
    const orderedProductProducts: OrderProductNameQqt[] = itemData?.map(
      (item) => {
        return {
          productQuantity: item.qty,
          productTitle: item.name,
        };
      }
    );

    const url = `${import.meta.env.VITE_BACK_PORT}/cart/decreaseCartProduct`;
    sendAxiosPostRequest(
      url,
      loginToken,
      setLoginToken,
      orderedProductProducts
    ).then((res) => {
      alert("장바구니 깎기!!");
      //수정 setter
    });
  };

  const saveToOrderList = async () => {
    const orderedProductProducts: OrderProduct[] = itemData?.map((item) => {
      return {
        orderedQuantity: item.qty,
        productId: Number(item.id),
      };
    });

    const orderInfos = {
      storeId: myCartStoreId,
      couponId: appliedCoupon.couponId,
      totalAmount: totalPriceAf,
      orderedDate: new Date(),
      orderedProductProduct: orderedProductProducts,
    };

    const orderUrl = `${
      import.meta.env.VITE_BACK_PORT
    }/orderedproduct/saveOrderedProductInfo`;

    console.log("스토어", orderInfos);
    sendAxiosPostRequest(orderUrl, loginToken, setLoginToken, orderInfos)
      .then((res) => {
        console.log("saveToOrderList---", res);
      })
      .catch((e) => {
        console.log("saveToOrderList error ---", e);
      });
  };

  //실결제
  const requestPayment = async () => {
    console.log("총액", totalPriceAf);
    const nameCnt = itemData.length;
    const repreName: string =
      itemData.length <= 1
        ? itemData[0].name
        : itemData[0].name + "외 " + (nameCnt - 1);

    await Bootpay.requestPayment({
      application_id: "6507a57300c78a001c44ef49", // REST API key
      price: totalPriceAf,
      order_name: repreName,
      // 결제할 상품명
      order_id: "orderedProductId", // 가맹점에서 식별할 주문번호 = orderedProductId
      pg: "nicepay",
      tax_free: 0,
      user: {
        id: memberInfo.memberId, // 토큰 memberId, Name, Email
        username: memberInfo.memberName,
        email: memberInfo.memberEmail,
      },
      items: itemData,
      extra: {
        open_type: "iframe", // redirect, iframe, popup
        card_quota: "0,2,3", // 카드 할부
      },
    }).then((res) => {
      saveToOrderList();
      decreaseMyCart();
      if (appliedCoupon !== null && appliedCoupon !== undefined) {
        deleteMyCoupon();
      }
      setOpenPayment(false);
      toast.success("결제되었습니다 👏🏻");
      console.log("부트 페이 응답 ", res);
    });
  };

  return (
    <div>
      <button className={styles.doPayBtn} onClick={preProcesse}>
        결제하기
      </button>
      <button onClick={saveToOrderList}>결제하기2</button>
      <button onClick={deleteMyCoupon}>쿠폰 깎기</button>
      <button onClick={decreaseMyCart}>장바구니 깎기</button>
    </div>
  );
}
