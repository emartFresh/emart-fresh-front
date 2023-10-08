/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import styles from "./EventList.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

interface EventList {
  eventId: string;
  eventTitle: string;
  eventBannerImage: string;
  eventDetailImage: string;
  eventStartDate: string;
  eventEndDate: string;
  eventListCount: number;
}

export default function EventEnded() {
  const [eventId, setEventId] = useState<string>("");
  const [endedEventList, setEndedEventList] = useState<EventList[]>([]);
  const pageSize = 50;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function EventListup() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_PORT}/event/event-list`,
          {
            params: {
              eventId: eventId,
              page: currentPage,
              size: pageSize,
            },
          }
        );

        console.log(response.data);
        const currentDate = new Date();
        const filteredEventList = response.data.content.filter(
          (event: { eventEndDate: Date }) => {
            const eventEndDate = new Date(event.eventEndDate);
            return eventEndDate < currentDate;
          }
        );
        setEndedEventList(filteredEventList);
        setEventId(response.data.eventId);
        console.log(
          "현재날짜 기준정리한 종료된 이벤트 리스트",
          filteredEventList
        );
      } catch (error) {
        console.error("Error fetching eventlist:", error);
        alert(error);
      }
    }
    EventListup();
  }, []);
  console.log("종료된 이벤트", endedEventList);

  return (
    <div className={styles.eventContainer}>
      {endedEventList.map((eventlist) => (
        <div key={eventlist.eventId}>
          <Link to={`/eventlistdetail/${eventlist.eventId}`}>
            <div>
              <img
                src={eventlist.eventBannerImage}
                className={styles.endedEventImage}
                alt="배너이미지"
              />
            </div>
            <div className={styles.eventText}>
              {new Date(eventlist.eventStartDate).toLocaleDateString()} ~&nbsp;
              {new Date(eventlist.eventEndDate).toLocaleDateString()}
            </div>
            <div className={styles.eventText}>{eventlist.eventTitle}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}
