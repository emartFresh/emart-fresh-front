/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, ChangeEvent, FormEvent, useRef } from "react";
import styles from "./EventUpdate.module.css";
import BannerImageIcon from "../../assets/images/BannerImageIcon.png";
import DetailImageIcon from "../../assets/images/DetailImageIcon.png";
import { webpImageIncoder } from "./webpImageIncoder";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { sendAxiosMediaPostRequest } from "../../utils/userUtils";
import { toast } from "react-toastify";
import { SendLoginPageIfNotLogin } from "../../utils/LoginUtils";

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    console.log("이름  파일 벨류", name, value, files);
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFormData({
        ...formData,
        [name]: selectedFile,
      });
      const webpfile = await webpImageIncoder(selectedFile);

      if (name === "eventBannerImage") {
        setBannerImagePreview(webpfile + "");
        // console.log("첫번째 배너", webpfile);
      } else if (name === "eventDetailImage") {
        setDetailImagePreview(webpfile + "");
        // console.log("두번째 디테일", webpfile);
      }
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

  // 폼 제출
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submit button clicked");
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    if (!formData.eventTitle && formData.eventTitle.trim() === "") {
      toast.error("이벤트 제목을 입력하세요");
      setIsSubmitting(false);
    } else if (!formData.eventStartDate) {
      toast.error("이벤트 시작날짜를 입력하세요");
      setIsSubmitting(false);
    } else if (!formData.eventEndDate) {
      toast.error("이벤트 종료날짜를 입력하세요");
      setIsSubmitting(false);
    } else if (
      new Date(formData.eventEndDate) < new Date(formData.eventStartDate)
    ) {
      toast.error("이벤트 시작날짜는 종료날짜보다 빨라야합니다.");
      setIsSubmitting(false);
    } else if (!formData.eventBannerImage || !formData.eventDetailImage) {
      toast.error("이벤트 이미지를 등록하세요");
      setIsSubmitting(false);
    } else {
      const formDataToSend = new FormData();
      formDataToSend.append("eventTitle", formData.eventTitle);
      formDataToSend.append(
        "eventBannerImage",
        formData.eventBannerImage || ""
      );
      formDataToSend.append(
        "eventDetailImage",
        formData.eventDetailImage || ""
      );
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
          setIsButtonDisabled(true);
        });
    }
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
            이벤트 마지막날짜&nbsp;&nbsp;
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
          isSubmitting && styles.disabledButton
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "이벤트 등록 중..." : "이벤트 등록"}
      </button>
    </div>
  );
}
