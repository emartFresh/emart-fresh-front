/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import styles from "./EventList.module.css";
// import { Link } from "react-router-dom";
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

export default function EventOngoing() {
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
    <div className={styles.eventContainer}>
      {onGoingEventList.map((eventlist) => (
        <div key={eventlist.eventId}>
          <div className={styles.eventItem}>
            <div>
              <img
                src={eventlist.eventBannerImage}
                className={styles.eventImage}
                alt="배너이미지"
              />
            </div>
            <div className={styles.eventText}>
              {new Date(eventlist.eventStartDate).toLocaleDateString()} ~
              {new Date(eventlist.eventEndDate).toLocaleDateString()}
            </div>
            <div className={styles.eventText}>{eventlist.eventTitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
