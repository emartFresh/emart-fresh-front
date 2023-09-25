import React, { useState } from "react";
import { Bootpay } from "@bootpay/client-js";
import axios from "axios";

const Payment = () => {
  const [paymentInfoDto, setPaymentInfoDto] = useState(null);

  const handlePaymentInfoDto = async (paymentInfoDto) => {
    try {
      await axios.post(
        "http://localhost:8080/payment/paymentInfo",
        paymentInfoDto
      );
      alert("결제 정보가 성공적으로 전송되었습니다.");
    } catch (error) {
      console.error("백엔드 결제 정보 전송 실패 :", error);
    }
  };

  const requestPayment = async () => {
    const response = await Bootpay.requestPayment({
      application_id: "6507a57300c78a001c44ef49", // REST API key
      price: 200,
      order_name: "productTitle1,2", // 결제할 상품명
      order_id: "orderedProductId", // 가맹점에서 식별할 주문번호 = orderedProductId
      pg: "nicepay",
      tax_free: 0,
      user: {
        id: "memberId", // 토큰 memberId, Name, Email
        username: "memberName",
        email: "test@test.com",
      },
      items: [
        {
          id: "productId",
          name: "productTitle",
          qty: 1,
          price: 100,
        },
        {
          id: "productId1",
          name: "productTitle1",
          qty: 1,
          price: 100,
        },
      ],
      extra: {
        open_type: "iframe", // redirect, iframe, popup
        card_quota: "0,2,3", // 카드 할부
      },
    });

    const paymentInfoDto = {
      receiptId: response.data.receipt_id,
      orderId: response.data.order_id,
      pg: response.data.pg,
      methodOrigin: response.data.method_origin,
      method: response.data.method,
      statusLocale: response.data.status_locale,
      receiptUrl: response.data.receipt_url,
      orderedProductId: "1",
    };
  };

  const handlePaymentButtonClick = () => {
    requestPayment();
  };

  const handleCancelClick = async () => {
    try {
      const receiptId = "65094762d259850028c6fd8c";
      const orderId = "orderedProductId";
      const Response = await axios.post(
        "http://localhost:8080/payment/cancel",
        {
          receiptId,
          orderId,
        }
      );

      console.log("결제 취소 정보 :", Response.data);
    } catch (error) {
      console.error("결제 취소 실패 :", error);
    }
  };

  return (
    <div>
      <h1>Bootpay PaymentInfo</h1>
      <button onClick={handlePaymentButtonClick}>결제하기</button>
      <button onClick={handleCancelClick}>결제 취소</button>
      {paymentInfoDto && <pre>{JSON.stringify(paymentInfoDto, null, 2)}</pre>}
    </div>
  );
};

export default Payment;
