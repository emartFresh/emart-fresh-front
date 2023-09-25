import React from "react";
import image3 from "../../assets/images/image3.png";
import image1 from "../../assets/images/image4.png";
import styles from "./EventList.module.css";

const EventEnded = () => {
  return (
    <div>
      <div className={styles.eventContainer}>
        <div className={styles.eventItem}>
          <img src={image3} alt="예시" className={styles.eventImage} />
          <div>
            <div className={styles.eventText}>2023.09.21 ~ 2023.10.08</div>
            <div className={styles.eventText}>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
        <div className={styles.eventItem}>
          <img src={image3} alt="예시" className={styles.eventImage} />
          <div>
            <div className={styles.eventText}>2023.09.21 ~ 2023.10.08</div>
            <div className={styles.eventText}>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
        <div className={styles.eventItem}>
          <img src={image3} alt="예시" className={styles.eventImage} />
          <div>
            <div className={styles.eventText}>2023.09.21 ~ 2023.10.08</div>
            <div className={styles.eventText}>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
        <div className={styles.eventItem}>
          <img src={image1} alt="예시" className={styles.eventImage} />
          <div>
            <div className={styles.eventText}>2023.09.21 ~ 2023.10.08</div>
            <div className={styles.eventText}>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
        <div className={styles.eventItem}>
          <img src={image1} alt="예시" className={styles.eventImage} />
          <div>
            <div className={styles.eventText}>2023.09.21 ~ 2023.10.08</div>
            <div className={styles.eventText}>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
        <div className={styles.eventItem}>
          <img src={image1} alt="예시" className={styles.eventImage} />
          <div>
            <div className={styles.eventText}>2023.09.21 ~ 2023.10.08</div>
            <div className={styles.eventText}>"9월 냉장커피 빙고 이벤트"</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventEnded;
