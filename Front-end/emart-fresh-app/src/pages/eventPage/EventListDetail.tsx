/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import styles from "./EventListDetail.module.css";
import axios from "axios";
interface EventList {
  eventId: number;
  eventTitle: string;
  eventBannerImage: string;
  eventDetailImage: string;
  eventStartDate: string;
  eventEndDate: string;
  eventListCount: number;
}
const EventListDetail = () => {
  const [onGoingEventList, setOnGoingEventList] = useState<EventList[]>([]);
  const pageSize = 50;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function EventListup() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_PORT}/event/event-list`,

          {
            params: {
              page: currentPage,
              size: pageSize,
            },
          }
        );

        console.log(response.data);
        const evnetListData = response.data.content;
        setOnGoingEventList(evnetListData);
      } catch (error) {
        console.error("Error fetching eventlist:", error);
        alert(error);
      }
    }
    EventListup();
  }, []);
  return (
    <div>
      <div className={styles.eventWrapper}>
        <div>
          <div className={styles.eventTitle}>진행중인 이벤트</div>
          <p className={styles.eventTitleText}>
            이마트 24의 다양한 이벤트에 참여해보세요.
          </p>
        </div>
        <div>
          {onGoingEventList.map((eventlist) => (
            <div key={eventlist.eventId}>
              <div className={styles.eventDetailDiv}>
                <p className={styles.eventDetailTitle}>
                  {eventlist.eventTitle}
                </p>
                <p className={styles.eventDetailDate}>
                  {new Date(eventlist.eventStartDate).toLocaleDateString()} ~
                  {new Date(eventlist.eventEndDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <img
                  src={eventlist.eventDetailImage}
                  className={styles.eventDetailImage}
                  alt="상세이미지"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default EventListDetail;
