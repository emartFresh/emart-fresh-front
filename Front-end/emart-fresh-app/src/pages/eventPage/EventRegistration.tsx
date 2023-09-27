/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import styles from "../page_css/EventRegi.module.css";

interface EventFormProps {
  onSubmit: (data: EventData) => void;
}

interface EventData {
  eventTitle: string;
  eventBannerImage: File | null;
  eventDetailImage: File | null;
  eventStartDate: Date | null;
  eventEndDate: Date | null;
}
// 이벤트 정보
interface EventFormState {
  eventId?: number; // 이벤트 아이디 (프라이머리 키)
  eventTitle: string; // 이벤트 제목
  eventBannerImage: File | null; // 배너 이미지
  eventDetailImage: File | null; // 디테일 이미지
  eventStartDate: Date | null; // 시작 날짜 (Date | null)
  eventEndDate: Date | null; // 종료 날짜 (Date | null)
}
export default function EventRegistration({ onSubmit }: EventFormProps) {
  //
  const [formData, setFormData] = useState<EventFormState>({
    eventTitle: "",
    eventBannerImage: null,
    eventDetailImage: null,
    eventStartDate: null,
    eventEndDate: null,
  });

  //
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : null,
    });
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

    //
    const eventData: EventData = {
      eventTitle,
      eventBannerImage: eventBannerImage || null,
      eventDetailImage: eventDetailImage || null,
      eventStartDate: eventStartDate || new Date(),
      eventEndDate: eventEndDate || new Date(),
    };

    const formDataToSend = new FormData();
    formDataToSend.append("event_title", eventTitle);
    formDataToSend.append("event_banner_image", eventBannerImage || "");
    formDataToSend.append("event_detail_image", eventDetailImage || "");
    // formDataToSend.append("event_start_date", eventStartDate || "");
    // formDataToSend.append("event_end_date", eventEndDate || "");

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

      if (response.data === "Success") {
        console.log("이벤트 생성에 성공하였습니다.");
      } else {
        console.error("이벤트 생성에 실패하였습니다.");
      }
    } catch (error) {
      console.error("error", error);
    }

    //
    // onSubmit(formData);

    //
    setFormData({
      eventTitle: "",
      eventBannerImage: null,
      eventDetailImage: null,
      eventStartDate: null,
      eventEndDate: null,
    });
  };

  return (
    <div>
      <div className={styles.eventRegiWrapper}>
        <div className={styles.eventRegiContainer}>
          <form onSubmit={handleSubmit}>
            <div>
              등록이벤트:
              <input
                type="text"
                name="eventTitle"
                className={styles.inputEventRegi}
                value={formData.eventTitle}
                onChange={handleInputChange}
              />
            </div>
            <div>
              배너이미지:
              <input
                type="file"
                name="eventBannerImage"
                onChange={handleFileChange}
              />
            </div>
            <div>
              상세이미지:
              <input
                type="file"
                name="eventDetailImage"
                onChange={handleFileChange}
              />
            </div>
            <div>
              시작날짜:
              <input
                type="date"
                name="eventStartDate"
                // value={formData.eventStartDate || ""}
                onChange={handleInputChange}
              />
            </div>
            &nbsp;&nbsp; &nbsp;&nbsp;
            <div>
              마지막날짜:
              <input
                type="date"
                name="eventEndDate"
                // value={formData.eventEndDate || ""}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className={styles.eventSubmitBtn}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
