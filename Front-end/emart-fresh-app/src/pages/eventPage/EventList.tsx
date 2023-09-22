import React from "react";
import styles from "./EventList.module.css";

import image1 from "../../assets/images/image1.png";

const EventList = () => {
  return (
    <div className={styles.eventWrapper}>
      <div className={styles.eventNavbar}>
        <div>진행중인 이벤트</div>
        <div>진행완료 된 이벤트</div>
      </div>
      <div className={styles.eventContainer}>
        <div className={styles.eventItem}>
          <div>
            <img src={image1} alt="예시" className={styles.eventImage} />
          </div>
          <div className={styles.eventText}>
            <div>2023.09.21 ~ 2023.10.08</div>
            <div>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
        <div className={styles.eventItem}>
          <div>
            <img src={image1} alt="예시" className={styles.eventImage} />
          </div>
          <div>
            <div>2023.09.21 ~ 2023.10.08</div>
            <div>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
        <div className={styles.eventItem}>
          <div>
            <img src={image1} alt="예시" className={styles.eventImage} />
          </div>
          <div>
            <div>2023.09.21 ~ 2023.10.08</div>
            <div>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
        <div className={styles.eventItem}>
          <div>
            <img src={image1} alt="예시" className={styles.eventImage} />
          </div>
          <div>
            <div>2023.09.21 ~ 2023.10.08</div>
            <div>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
        <div className={styles.eventItem}>
          <div>
            <img src={image1} alt="예시" className={styles.eventImage} />
          </div>
          <div>
            <div>2023.09.21 ~ 2023.10.08</div>
            <div>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
        <div className={styles.eventItem}>
          <div>
            <img src={image1} alt="예시" className={styles.eventImage} />
          </div>
          <div>
            <div>2023.09.21 ~ 2023.10.08</div>
            <div>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventList;
