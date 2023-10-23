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

export default function EventOngoing() {
  const [eventId, setEventId] = useState<string>("");
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

        console.log("응답데이터", response.data);
        const currentDate = new Date();
        const filteredEventList = response.data.content.filter(
          (event: { eventEndDate: Date }) => {
            const eventEndDate = new Date(event.eventEndDate);
            return eventEndDate >= currentDate;
          }
        );
        setOnGoingEventList(filteredEventList);
        setEventId(response.data);
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
          <Link to={`/eventlistdetail/${eventlist.eventId}`}>
            <div>
              <img
                src={eventlist.eventBannerImage}
                className={styles.eventImage}
                alt="배너이미지"
              />
            </div>
            <div className={styles.eventText}>
              {new Date(eventlist.eventStartDate).toISOString().split("T")[0]}{" "}
              ~&nbsp;
              {new Date(eventlist.eventEndDate).toISOString().split("T")[0]}
            </div>
            <div className={styles.eventText}>{eventlist.eventTitle}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}
