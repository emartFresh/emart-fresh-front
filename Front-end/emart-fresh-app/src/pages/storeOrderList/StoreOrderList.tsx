import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";

import { GetUserAllInfo } from "../../utils/LoginUtils";

import styles from "../page_css/StoreOrderList.module.css";
import axios from "axios";
import { formatCurrency } from "../../utils/formatUtils";

interface Order {
  orderedProductId: number;
  orderedDate: string;
  totalAmount: number;
  memberId: string;
}

interface DetailData {
  productImgUrl: string;
  orderedQuantity: number;
  price: number;
  productName: string;
}

export default function StoreOrderList() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [detailData, setDetailData] = useState<DetailData[]>([]);
  const [evtSource, setEvtSource] = useState<EventSource>();

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

  useEffect(() => {
    if (!evtSource) {
      connectToEventSource();
    }

    return () => {
      if (evtSource) {
        evtSource.close();
        setEvtSource(null);
      }
    };
  }, [evtSource]);

  const handleDetail = (orderedProductId: number) => {
    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/orderedproduct/getProductDetails?orderedProductId=${orderedProductId}`;
    axios.get(url).then((res) => {
      setDetailData(res.data);
      setShowModal(true);
    });

    //axios요청
  };
  const connectToEventSource = () => {
    console.log("연결");

    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/orderedproduct/storeordered-list?memberId=${userInfo.memberId}`;

    const eventSource = new EventSource(url);
    setEvtSource(eventSource);

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
  };

  const handlePickUpComplete = (orderId: number) => {
    console.log("픽", orderId);
    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/orderedproduct/completepickup`;
    axios.post(url, { orderedProductId: orderId }).then((res) => {
      console.log(res.data);
      location.reload();
    });
  };

  return (
    <div className={styles.orderListContainer}>
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(!showModal);
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className={styles.detailContainer}>
            {detailData.map((item, inx) => {
              return (
                <div className={styles.detailWrapper} key={inx}>
                  <div>
                    <span>
                      <img
                        className={styles.detailImg}
                        src={item.productImgUrl}
                        alt=""
                      />
                    </span>
                    <span className={styles.detailName}>
                      {item.productName}
                    </span>
                  </div>
                  <span className={styles.detailPrice}>
                    {item.price && formatCurrency(item.price)}원
                  </span>
                </div>
              );
            })}
          </div>
          <div className={styles.btnWrapper}>
            <button
              className={styles.cancleBtn}
              onClick={() => {
                setShowModal(!showModal);
              }}
            >
              닫기
            </button>
          </div>
        </Box>
      </Modal>
      {/* <button onClick={connectToEventSource}>Connect to Server</button> */}
      {orders?.map((order, index) => (
        <div className={styles.orderListWrapper} key={index}>
          <div className={styles.badge_detail_Wrapper}>
            <span className={styles.badge}>{order.orderedProductId}</span>
            <button
              onClick={() => {
                handleDetail(order.orderedProductId);
              }}
              className={styles.detail}
            >
              주문상세
            </button>
          </div>
          <div className={styles.dataWrapper}>
            <span className={styles.date}>
              {new Date(order.orderedDate).toLocaleDateString()}{" "}
              {new Date(order.orderedDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <div className={styles.memberWrapper}>
              <span>아이디</span>
              <span> {order.memberId}</span>
            </div>
          </div>
          <div className={styles.totalAmountWrapper}>
            <span className={styles.totalAmount}>총 결제액</span>
            {formatCurrency(order.totalAmount)}원
          </div>
          <div>
            <button
              onClick={() => handlePickUpComplete(order.orderedProductId)}
            >
              픽업완료 처리
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
