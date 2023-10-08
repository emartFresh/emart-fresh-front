/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import styles from "./EventListDetail.module.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import EventBadge from "./EventBadge";

interface EventList {
  eventId: string;
  eventTitle: string;
  eventBannerImage: string;
  eventDetailImage: string;
  eventStartDate: string;
  eventEndDate: string;
  eventListCount: number;
}
export default function EventListDetail() {
  const { eventId } = useParams();
  const [onGoingEventList, setOnGoingEventList] = useState<EventList>({
    eventId: eventId,
    eventTitle: "",
    eventBannerImage: "",
    eventDetailImage: "",
    eventStartDate: "",
    eventEndDate: "",
    eventListCount: 0,
  });

  useEffect(() => {
    async function DetailEvent() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACK_PORT}/event/detail`,
          {
            params: {
              eventId: eventId,
            },
          }
        );
        console.log(response.data);
        const eventListData = response.data;
        setOnGoingEventList(eventListData);
      } catch (error) {
        console.error("Error fetching eventdetail:", error);
      }
    }
    DetailEvent();
  }, [eventId]);
  console.log(onGoingEventList);

  return (
    <div>
      <div className={styles.eventWrapper}>
        <div>
          <div className={styles.eventTitle}>
            {new Date(onGoingEventList.eventEndDate) >= new Date()
              ? "진행중인 이벤트"
              : "종료된 이벤트"}
          </div>
          <p className={styles.eventTitleText}>
            {new Date(onGoingEventList.eventEndDate) >= new Date()
              ? "이마트 24의 다양한 이벤트에 참여해보세요."
              : "종료된 이벤트입니다. 당첨자발표는 이마트24 앱에서 확인해 주세요."}
          </p>
        </div>
        <div className={styles.eventDetailDiv}>
          <div>
            <p>
              {new Date(onGoingEventList.eventEndDate) >= new Date() ? (
                <EventBadge
                  className={styles.eventOngoingBadge}
                  text="진행중"
                />
              ) : (
                <EventBadge className={styles.eventEndedBadge} text="종료" />
              )}
            </p>
            <p className={styles.eventDetailTitle}>
              {onGoingEventList.eventTitle}
            </p>
          </div>
          <p className={styles.eventDetailDate}>
            {new Date(onGoingEventList.eventStartDate).toLocaleDateString()}~
            {new Date(onGoingEventList.eventEndDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <img
            src={onGoingEventList.eventDetailImage}
            className={styles.eventDetailImage}
            alt="상세이미지"
          />
        </div>
        <Link to="/eventlist">
          <button className={styles.eventListBtn}>목록</button>
        </Link>
      </div>
    </div>
  );
}
