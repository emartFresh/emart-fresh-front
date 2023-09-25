import React from "react";
import image2 from "../../assets/images/image2.png";
import image1 from "../../assets/images/image1.png";
import styles from "./EventList.module.css";
import { Link } from "react-router-dom";

const EventOngoing = () => {
  return (
    <div>
      <div className={styles.eventContainer}>
        <div className={styles.eventItem}>
          <Link to="/eventlistdetail">
            <img src={image2} alt="예시" className={styles.eventImage} />
            <div>
              <div className={styles.eventText}>2023.09.21 ~ 2023.10.08</div>
              <div className={styles.eventText}>"9월 냉장커피 빙고 이벤트"</div>
            </div>
          </Link>
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

export default EventOngoing;
