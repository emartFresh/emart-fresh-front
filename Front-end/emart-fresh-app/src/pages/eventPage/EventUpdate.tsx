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
    BannerImageIcon
  );
  const [detailImagePreview, setDetailImagePreview] = useState<string | null>(
    DetailImageIcon
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
  const handleBannerImageFileClick = () => {
    if (eventBannerImageInputRef.current) {
      eventBannerImageInputRef.current.click();
    }
  };
  console.log(handleBannerImageFileClick);

  const handleDetailImageFileClick = () => {
    if (eventDetailImageInputRef.current) {
      eventDetailImageInputRef.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    console.log("핸들파일체인지", handleFileChange);

    console.log(name, files);
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const webpfile = await webpImageIncoder(selectedFile);

      setBannerImagePreview(webpfile + "");
      // setDetailImagePreview(webpfile + "");
      // console.log("배너이미지 프리뷰가 웹파일? ", setBannerImagePreview);

      console.log("웹파일은어떻게 나와?", webpfile);
      setFormData({
        ...formData,
        [name]: selectedFile,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        const imagePreview = reader.result as string;

        console.log("이미지 미리보기 ", imagePreview);
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

        setFormData({
          eventTitle: "",
          eventBannerImage: null,
          eventDetailImage: null,
          eventStartDate: null,
          eventEndDate: null,
        });
        setBannerImagePreview(BannerImageIcon);
        setDetailImagePreview(DetailImageIcon);
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
        <div className={styles.eventUpdateTitle}>
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
          </div>
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

        <div>
          <div>
            <p className={styles.pTag}>배너이미지</p>
            <div onClick={handleBannerImageFileClick}>
              <input
                style={{ display: "none" }}
                type="file"
                name="eventBannerImage"
                onChange={handleFileChange}
                ref={eventBannerImageInputRef}
              />
              <div className={styles.bannerImagePrev}>
                {bannerImagePreview && (
                  <img
                    src={bannerImagePreview}
                    alt="Banner Image Preview"
                    style={{ width: "500px" }}
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <p className={styles.pTag}>상세이미지</p>
            <div onClick={handleDetailImageFileClick}>
              <input
                style={{ display: "none" }}
                type="file"
                name="eventDetailImage"
                onChange={handleFileChange}
                ref={eventDetailImageInputRef}
              />
              <div className={styles.detailImagePrev}>
                {detailImagePreview && (
                  <img
                    src={detailImagePreview}
                    alt="Detail Image Preview"
                    style={{ width: "500px" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleSubmit} className={styles.eventSubmitBtn}>
        이벤트 등록
      </button>
    </div>
  );
}
