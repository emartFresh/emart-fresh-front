/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import axios from "axios";
import styles from "./EventRegi.module.css";

// 이벤트 정보
interface EventFormState {
  eventId?: number; // 이벤트 아이디 (프라이머리 키)
  eventTitle: string; // 이벤트 제목
  eventBannerImage?: File | null; // 배너 이미지
  eventDetailImage?: File | null; // 디테일 이미지
  eventStartDate: string | null; // 시작 날짜 (Date | null)
  eventEndDate: string | null; // 종료 날짜 (Date | null)
}
export default function EventUpdate() {
  //
  const [formData, setFormData] = useState<EventFormState>({
    eventTitle: "",
    eventBannerImage: null,
    eventDetailImage: null,
    eventStartDate: null,
    eventEndDate: null,
  });
  const eventBannerImageInputRef = useRef<HTMLInputElement>(null);
  const eventDetailImageInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFormData({
        ...formData,
        [name]: selectedFile,
      });
    }
  };

  // 폼 제출
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const {
      eventTitle,
      eventBannerImage,
      eventDetailImage,
      eventStartDate,
      eventEndDate,
    } = formData;
    console.log(formData);

    const formDataToSend = new FormData();
    formDataToSend.append("event_title", eventTitle);
    formDataToSend.append("event_banner_image", eventBannerImage || "");
    formDataToSend.append("event_detail_image", eventDetailImage || "");
    formDataToSend.append("event_start_date", eventStartDate || "");
    formDataToSend.append("event_end_date", eventEndDate || "");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_PORT}/event/event-update`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data === "success") {
        console.log("이벤트 생성에 성공하였습니다.");
        alert("이벤트 성공!");
        console.log(setFormData);
        if (
          (eventBannerImageInputRef.current, eventDetailImageInputRef.current)
        ) {
          eventBannerImageInputRef.current.value = "";
          eventDetailImageInputRef.current.value = "";
        }

        setFormData({
          eventTitle: "",
          eventBannerImage: null,
          eventDetailImage: null,
          eventStartDate: null,
          eventEndDate: null,
        });
      } else {
        console.error("이벤트 생성에 실패하였습니다.");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div>
      <div className={styles.eventRegiWrapper}>
        <div className={styles.eventRegiContainer}>
          <div>
            등록이벤트:
            <input
              type="text"
              name="eventTitle"
              className={styles.inputEventRegi}
              value={formData.eventTitle}
              onChange={handleInputChange}
              placeholder="이벤트 이름을 입력하세요"
            />
          </div>
          <div>
            배너이미지:
            <input
              type="file"
              name="eventBannerImage"
              onChange={handleFileChange}
              ref={eventBannerImageInputRef}
              // placeholder="배너이미지를 등록하세요"
            />
          </div>
          <div>
            상세이미지:
            <input
              type="file"
              name="eventDetailImage"
              onChange={handleFileChange}
              ref={eventDetailImageInputRef}
              // placeholder="상세이미지를 등록하세요"
            />
          </div>
          <div>
            시작날짜:
            <input
              type="date"
              name="eventStartDate"
              value={formData.eventStartDate || ""}
              onChange={handleInputChange}
            />
          </div>
          &nbsp;&nbsp; &nbsp;&nbsp;
          <div>
            마지막날짜:
            <input
              type="date"
              name="eventEndDate"
              value={formData.eventEndDate || ""}
              onChange={handleInputChange}
            />
          </div>
          <button onClick={handleSubmit} className={styles.eventSubmitBtn}>
            이벤트 등록
          </button>
        </div>
      </div>
    </div>
  );
}
