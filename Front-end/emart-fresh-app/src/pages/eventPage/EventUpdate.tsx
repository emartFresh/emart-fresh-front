/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import styles from "./EventUpdate.module.css";
import BannerImageIcon from "../../assets/images/BannerImageIcon.png";
import DetailImageIcon from "../../assets/images/DetailImageIcon.png";
import { SendLoginPageIfNotLogin } from "../../utils/LoginUtils";
import icon from "../../assets/images/i-icon.webp";

import { sendAxiosMediaPostRequest } from "../../utils/userUtils";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

export default function EventUpdate() {
  SendLoginPageIfNotLogin();
  const [formData, setFormData] = useState<EventFormState>({
    eventTitle: "",
    eventBannerImage: null,
    eventDetailImage: null,
    eventStartDate: null,
    eventEndDate: null,
  });
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    BannerImageIcon
  );
  const [detailImagePreview, setDetailImagePreview] = useState<string | null>(
    DetailImageIcon
  );
  const eventBannerImageInputRef = useRef<HTMLInputElement>(null);
  const eventDetailImageInputRef = useRef<HTMLInputElement>(null);
  //
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBannerImageFileClick = () => {
    if (eventBannerImageInputRef.current) {
      eventBannerImageInputRef.current.click();
    }
  };
  const handleDetailImageFileClick = () => {
    if (eventDetailImageInputRef.current) {
      eventDetailImageInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    console.log("이름  파일 벨류", name, value, files);
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
    } else {
      setFormData((formData) => ({
        ...formData,
        [name]: value,
      }));

      if (name === "eventBannerImage") {
        setBannerImagePreview(BannerImageIcon);
      } else if (name === "eventDetailImage") {
        setDetailImagePreview(DetailImageIcon);
      }
    }
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  useEffect(() => {
    const isTitleValid = formData.eventTitle.trim() !== "";
    const isDateValid =
      formData.eventStartDate &&
      formData.eventEndDate &&
      new Date(formData.eventEndDate) >= new Date(formData.eventStartDate);
    const isBannerImageValid = formData.eventBannerImage;
    const isDetailImage = formData.eventDetailImage;

    console.log(isTitleValid);
    console.log(isDateValid);
    console.log(isBannerImageValid);
    console.log(isDetailImage);

    setIsButtonDisabled(
      !(isTitleValid && isDateValid && isBannerImageValid && isDetailImage)
    );
  }, [formData]);

  // 폼제출
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("eventTitle", formData.eventTitle);
    formDataToSend.append("eventBannerImage", formData.eventBannerImage || "");
    formDataToSend.append("eventDetailImage", formData.eventDetailImage || "");
    formDataToSend.append("eventStartDate", formData.eventStartDate || "");
    formDataToSend.append("eventEndDate", formData.eventEndDate || "");

    const url = `${import.meta.env.VITE_BACK_PORT}/event/event-update`;

    sendAxiosMediaPostRequest(url, loginToken, setLoginToken, formDataToSend)
      .then((response) => {
        console.log("파일전송 : " + response);

        toast.success("이벤트가 등록되었습니다!");
        setFormData({
          eventTitle: "",
          eventBannerImage: null,
          eventDetailImage: null,
          eventStartDate: null,
          eventEndDate: null,
        });
        setBannerImagePreview(BannerImageIcon);
        setDetailImagePreview(DetailImageIcon);
      })
      .catch((error) => {
        toast.error("이벤트 생성에 실패하였습니다.", error);
      })
      .finally(() => {
        // 이벤트 등록 완료 후 상태 재설정
        setIsSubmitting(false);
      });
  };

  return (
    <div className={styles.eventUpdateMain}>
      <div className={styles.eventUpdateContainer}>
        <div className={styles.eventUpdateTitle}>
          등록이벤트&nbsp;&nbsp;
          <input
            type="text"
            name="eventTitle"
            className={styles.inputEventUpdate}
            value={formData.eventTitle}
            onChange={handleFileChange}
            placeholder="이벤트이름을 등록하세요"
          />
          &nbsp;&nbsp;
          <div className={styles.iconContainer}>
            <img src={icon} style={{ width: "20px" }} />
            <div className={styles.hoverText}>
              시작날짜는 종료날짜보다 빨라야합니다.
              <br />
            </div>
          </div>
        </div>
        <div className={styles.eventDate}>
          <div>
            이벤트 시작날짜&nbsp;&nbsp;
            <input
              type="date"
              name="eventStartDate"
              value={formData.eventStartDate || ""}
              onChange={handleFileChange}
            />
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div>
            이벤트 종료날짜&nbsp;&nbsp;
            <input
              type="date"
              name="eventEndDate"
              value={formData.eventEndDate || ""}
              onChange={handleFileChange}
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
                    style={{ width: "70%" }}
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
                    style={{ width: "70%" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className={`${styles.eventSubmitBtn} ${
          isButtonDisabled || (isSubmitting && styles.disabledButton)
        }`}
        disabled={isButtonDisabled || isSubmitting}
      >
        {isSubmitting ? "이벤트 등록 중..." : "이벤트 등록"}
      </button>
    </div>
  );
}
