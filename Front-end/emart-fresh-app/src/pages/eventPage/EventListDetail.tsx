import React from "react";
import styles from "./EventListDetail.module.css";
import eventDetail1 from "../../assets/images/eventDetail1.png";

const EventListDetail = () => {
  return (
    <>
      <div>
        <div className={styles.eventWrapper}>
          <div>
            <div className={styles.eventTitle}>진행중인 이벤트</div>
            <p className={styles.eventTitleText}>
              이마트 24의 다양한 이벤트에 참여해보세요.
            </p>
          </div>
          <div className={styles.eventDetailDiv}>
            <p className={styles.evnetDetailTitle}>힘내라 대한민국 이벤트</p>
            <p className={styles.eventDetailDate}>2023.09.21~2023.10.08</p>
          </div>
          <hr></hr>
          <div>
            <img
              src={eventDetail1}
              alt="예시"
              className={styles.eventDetailImage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventListDetail;
