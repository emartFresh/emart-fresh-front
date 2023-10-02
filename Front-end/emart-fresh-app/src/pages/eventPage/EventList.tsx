/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import styles from "./EventList.module.css";
import EventOngoing from "./EventOngoing";
import EventEnded from "./EventEnded";

interface EventList {
  eventId: number;
  eventTitle: string;
  eventBannerImage: string;
  eventDetailImage: string;
  eventStartDate: string;
  eventEndDate: string;
  eventListCount: number;
}
export default function EventList() {
  const [isOngoingEvent, setIsOngoingEvent] = useState(true);

  const onChangeEventType = (mode: boolean) => {
    setIsOngoingEvent(mode);
  };

  return (
    <div>
      <div className={styles.eventNavbar}>
        <div
          className={isOngoingEvent ? styles.eventActive : styles.event}
          onClick={() => onChangeEventType(true)}
        >
          진행중인 이벤트
        </div>
        <div
          className={!isOngoingEvent ? styles.eventActive : styles.event}
          onClick={() => onChangeEventType(false)}
        >
          종료된 이벤트
        </div>
      </div>
      <div>{isOngoingEvent ? <EventOngoing /> : <EventEnded />}</div>
    </div>
  );
}
