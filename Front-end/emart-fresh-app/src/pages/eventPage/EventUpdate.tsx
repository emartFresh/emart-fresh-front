/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import axios from "axios";
import styles from "./EventUpdate.module.css";

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
  const [formData, setFormData] = useState<EventFormState>({
    eventTitle: "",
    eventBannerImage: null,
    eventDetailImage: null,
    eventStartDate: null,
    eventEndDate: null,
  });

  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    null
  );
  const [detailImagePreview, setDetailImagePreview] = useState<string | null>(
    null
  );
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

      const reader = new FileReader();
      reader.onloadend = () => {
        const imagePreview = reader.result as string;
        if (name === "eventBannerImage") {
          setBannerImagePreview(imagePreview);
        } else if (name === "eventDetailImage") {
          setDetailImagePreview(imagePreview);
        }
      };
      reader.readAsDataURL(selectedFile);
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
        alert("이벤트 등록성공!");

        if (
          eventBannerImageInputRef.current &&
          eventDetailImageInputRef.current
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
    <div className={styles.eventUpdateWrapper}>
      <div className={styles.eventUpdateContainer}>
        <div className={styles.등록이벤트}>
          등록이벤트&nbsp;&nbsp;
          <input
            type="text"
            name="eventTitle"
            className={styles.inputEventUpdate}
            value={formData.eventTitle}
            onChange={handleInputChange}
            placeholder="이벤트이름을 등록하세요"
          />
        </div>
        <div className={styles.eventDate}>
          <div>
            이벤트 시작날짜&nbsp;&nbsp;
            <input
              type="date"
              name="eventStartDate"
              value={formData.eventStartDate || ""}
              onChange={handleInputChange}
            />
          </div>{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div>
            이벤트 마지막날짜&nbsp;&nbsp;
            <input
              type="date"
              name="eventEndDate"
              value={formData.eventEndDate || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className={styles.tableContainer}>
          <table>
            <tbody>
              <tr>
                <td>
                  <div>
                    배너이미지&nbsp;&nbsp;
                    <input
                      type="file"
                      name="eventBannerImage"
                      onChange={handleFileChange}
                      ref={eventBannerImageInputRef}
                    />
                  </div>
                </td>
                <td>
                  <div className={styles.배너이미지미리보기}>
                    {bannerImagePreview && (
                      <img
                        src={bannerImagePreview}
                        alt="Banner Image Preview"
                        style={{ height: "200px" }}
                      />
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    상세이미지&nbsp;&nbsp;
                    <input
                      type="file"
                      name="eventDetailImage"
                      onChange={handleFileChange}
                      ref={eventDetailImageInputRef}
                    />
                  </div>
                </td>
                <td>
                  <div className={styles.디테일이미지미리보기}>
                    {detailImagePreview && (
                      <img
                        src={detailImagePreview}
                        alt="Detail Image Preview"
                        style={{ height: "450px" }}
                      />
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button onClick={handleSubmit} className={styles.eventSubmitBtn}>
          이벤트 등록
        </button>
      </div>
    </div>
  );
}
