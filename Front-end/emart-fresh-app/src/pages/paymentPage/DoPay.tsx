import { Bootpay } from "@bootpay/client-js";
import axios from "axios";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";
import { MemberInfo, GetUserAllInfo } from "../../utils/LoginUtils";
import { ItemData } from "./Payment";
import { sendAxiosPostRequest } from "../../utils/userUtils";

interface DopayProp {
  itemData: ItemData[];
  totalPriceAf: number;
}

export default function Dopay({ itemData, totalPriceAf }: DopayProp) {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);

  const memberInfo: MemberInfo = GetUserAllInfo();

  //수정 : 로직 고민...
  const preProcesse = async () => {
    const url = `${import.meta.env.VITE_BACK_PORT}/cart/decreaseCartProduct`;
    sendAxiosPostRequest(url, loginToken, setLoginToken).then((res) => {
      console.log("응답", res);
      requestPayment();
    });
  };

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
      console.log("부트 페이 응답 ", res);
    });
  };

  return (
    <div>
      <button onClick={preProcesse}>결제하기</button>
    </div>
  );
}