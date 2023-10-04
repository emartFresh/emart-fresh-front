import React, { useState, useEffect } from "react";
import { GetUserAllInfo } from "../../utils/LoginUtils";

import styles from "../page_css/StoreOrderList.module.css";

interface Order {
  orderedProductId: number;
  orderedDate: string;
  totalAmount: number;
}

export default function StoreOrderList() {
  const [orders, setOrders] = useState<Order[]>([]);

  const userInfo = GetUserAllInfo();

  const playTTS = (audioDataEncoded) => {
    if (!audioDataEncoded || audioDataEncoded.length === 0) {
      return;
    }
    const audioData = Uint8Array.from(atob(audioDataEncoded), (c) =>
      c.charCodeAt(0)
    );
    const audioBlob = new Blob([audioData], { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const connectToEventSource = () => {
    const eventSource = new EventSource(
      `http://localhost:8080/orderedproduct/storeordered-list?memberId=${userInfo.memberId}`
    );

    eventSource.onmessage = (event) => {
      const order = JSON.parse(event.data);
      console.log("데이터2", order);

      // 유효한 주문인지 검사합니다.
      if (order && order.orderedProductId) {
        playTTS(order.audioData);

        setOrders((prevOrders) => {
          // 이미 추가된 주문인지 확인합니다.
          if (
            !prevOrders.some(
              (prevOrder) =>
                prevOrder.orderedProductId === order.orderedProductId
            )
          ) {
            return [...prevOrders, order].sort(
              (b, a) => a.orderedProductId - b.orderedProductId
            ); // 주문번호를 기준으로 내림차순 정렬
          }
          return prevOrders; // 이미 존재하는 주문이면 상태를 그대로 반환합니다.
        });
      }
    };

    return () => {
      eventSource.close();
    };
  };

  useEffect(() => {}, []);

  return (
    <div className={styles.orderListContainer}>
      <button onClick={connectToEventSource}>Connect to Server</button>

      {orders.map((order, index) => (
        <div className={styles.orderListWrapper} key={index}>
          <div className={styles.badge_detail_Wrapper}>
            <span className={styles.badge}>{order.orderedProductId}</span>
            <button className={styles.detail}>주문상세</button>
          </div>
          <div className={styles.dataWrapper}>
            <span className={styles.date}>
              {new Date(order.orderedDate).toLocaleDateString()}{" "}
              {new Date(order.orderedDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className={styles.totalAmountWrapper}>
            <span className={styles.totalAmount}>
              총 결제액 {order.totalAmount}원
            </span>
          </div>
          <div>
            <button>픽업완료 처리</button>
          </div>
        </div>
      ))}
    </div>
  );
}
