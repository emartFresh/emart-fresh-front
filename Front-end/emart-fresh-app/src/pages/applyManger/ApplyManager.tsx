import { useState } from "react";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";
import { Modal, Box } from "@mui/material";
import styles from "../page_css/ApplyManager.module.css";
import ApplyForm from "./ApplyForm";
import { GetUserAllInfo } from "../../utils/LoginUtils";
import { sendAxiosPostRequest } from "../../utils/userUtils";
import { toast } from "react-toastify";

export default function ApplyManager() {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [initialComp, setInitialComp] = useState<number>(0);
  const [certifFile, setCertifFile] = useState<File>();
  const userInfo = GetUserAllInfo();

  const handleApplyBtn = () => {
    if (certifFile === undefined) {
      toast.error("사진을 선택해 주세요.", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }
    setShowModal(!showModal);

    const formData = new FormData();
    formData.append("file", certifFile);

    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/applymanager/apply-requestapplymanager`;

    sendAxiosPostRequest(url, loginToken, setLoginToken, formData)
      .then((res) => {
        toast.success("신청에 성공하였습니다.", {
          position: "top-center",
          autoClose: 1000,
        });
        setInitialComp((prev) => prev + 1);
        setShowModal(false);
      })
      .catch((e) => {
        const res = e.response;
        const exsitCondition =
          res.status === 400 && res.data === "신청내역이 존재합니다.";
        const invalidPicCondition =
          res.status === 400 && res.data === "사진 삽입 실패";
        if (exsitCondition) {
          toast.error("신청내역이 존재합니다.", {
            position: "top-center",
            autoClose: 1000,
          });
        } else if (invalidPicCondition) {
          toast.error("유효하지 않은 사진입니다.", {
            position: "top-center",
            autoClose: 1000,
          });
        }

        console.log("에러", e);
      });
  };

  return (
    <>
      <div className={styles.applyManagerContainer}>
        <ApplyForm showModal={showModal} initialComp={initialComp}></ApplyForm>
        <Modal
          open={showModal}
          onClose={() => {
            setShowModal(!showModal);
          }}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 2,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className={styles.certificateContainer}>
              <h2>점주 신청</h2>
              <div className={styles.certificateWrapper}>
                <div className={styles.certifTitle}>신청자명</div>
                <div className={styles.certifContent}>
                  {userInfo.memberName}
                </div>
                <div className={styles.certifTitle}>신청자 이메일</div>
                <div className={styles.certifContent}>
                  {userInfo.memberEmail}
                </div>
                <div className={styles.certifTitle}>사업자 등록증</div>
                <div className={styles.certifContent}>
                  <input
                    onChange={(e) => {
                      setCertifFile(e.target.files[0]);
                    }}
                    className={styles.certifInput}
                    type="file"
                    readOnly={true}
                  />
                </div>
              </div>
              <div>
                <button
                  className={styles.cancleBtn}
                  onClick={() => {
                    setShowModal(!showModal);
                  }}
                >
                  닫기
                </button>
                <button
                  className={styles.cofirmBtn}
                  onClick={() => {
                    handleApplyBtn();
                  }}
                >
                  신청
                </button>
              </div>
            </div>
          </Box>
        </Modal>

        <button
          className={styles.applyBtn}
          onClick={() => {
            setShowModal(true);
          }}
        >
          점주 신청
        </button>
      </div>
    </>
  );
}
