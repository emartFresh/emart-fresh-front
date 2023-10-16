/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import styles from "../page_css/CommonModal.module.css";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { sendAxiosPostRequest } from "../../utils/userUtils";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

interface ChangePWState {
  memberId: string;
  memberPw: string;
  newPw?: string;
  newPwAgain: string;
}
// 비밀번호변경 메세지1)
interface Messages {
  password: string;
  passwordConfirm: string;
}
// 인증번호
interface Validity {
  isPasswordValid: boolean;
  isPasswordConfirmValid: boolean;
}
interface ModalProps {
  onClose: () => void;
}
const ChangePw = ({ onClose }: ModalProps) => {
  const initialChangePWState: ChangePWState = {
    memberId: "",
    memberPw: "",
    newPw: "",
    newPwAgain: "",
  };

  const [memberPwVisible, setMemberPwVisible] = useState<boolean>(false);
  const [newPwVisible, setNewPwVisible] = useState<boolean>(false);

  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [memberPw, setMemberPw] = useState<string>("");
  const [newPw, setNewPw] = useState<string>("");

  const [formData, setFormData] = useState<ChangePWState>(initialChangePWState);

  // 비밀번호변경 메세지2)
  const [messages, setMessages] = useState<Messages>({
    password: "",
    passwordConfirm: "",
  });

  // 유효성
  const [formValidity, setFormValidity] = useState<Validity>({
    isPasswordValid: false,
    isPasswordConfirmValid: false,
  });

  // 비밀번호 변경부분!!
  async function changepassword() {
    const data = {
      memberPw: memberPw,
      newPw: newPw,
    };
    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/mypage/mypage-changepassword`;
    sendAxiosPostRequest(url, loginToken, setLoginToken, data)
      .then((res) => {
        console.log("응답데이터, res", res);
        console.log("현재비밀번호 memberPW", memberPw);
        console.log("새비밀번호 newPW", newPw);

        if (res === "비밀번호변경 성공") {
          toast.success("비밀번호가 성공적으로 변경되었습니다.");
        } else {
          toast.error("현재 비밀번호가 잘못되었습니다. 다시 시도해주세요.");
        }

        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("비밀번호 변경 중에 문제가 발생했습니다.");
      });
  }

  const handleInputChange = (fieldName: keyof ChangePWState, value: string) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };
  // 비밀번호변경 메세지3)
  const handleMessageChange = (fieldName: keyof Messages, value: string) => {
    setMessages({
      ...messages,
      [fieldName]: value,
    });
  };
  // 유효성
  const handleValidityChange = (fieldName: keyof Validity, value: boolean) => {
    setFormValidity({
      ...formValidity,
      [fieldName]: value,
    });
  };

  const validatePassword = (value: string) => {
    // 비밀번호 유효성 검사 로직 / 결과에 따라 메시지 및 유효성 상태 업데이트
    // const password = value; // 비밀번호 값 별도 변수에 저장
    if (value.trim() === "") {
      handleMessageChange("password", "비밀번호를 입력해주세요.");
      setMemberPwVisible(false);
    } else if (
      !/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*]).{8,16}$/.test(value)
    ) {
      handleMessageChange(
        "password",
        "영문/숫자/특수문자를 포함하고, 최소8자 최대16자로 입력해주세요."
      );
      setMemberPwVisible(false);
    } else if (value === formData.memberId) {
      handleMessageChange(
        "password",
        "비밀번호는 아이디와 동일할 수 없습니다."
      );
      setMemberPwVisible(false);
    } else {
      handleMessageChange("password", "");
      // setMemberPwVisible(true);
    }
  };

  const validatePasswordConfirm = (value: string) => {
    // 비밀번호 확인 유효성 검사 로직 / 결과에 따라 메시지 및 유효성 상태 업데이트
    if (value.trim() === "") {
      handleMessageChange("passwordConfirm", "확인 비밀번호을 입력해주세요.");
      handleValidityChange("isPasswordConfirmValid", false);
    } else if (value !== formData.newPw) {
      handleMessageChange(
        "passwordConfirm",
        "비밀번호를 동일하게 입력해주세요"
      );
      handleValidityChange("isPasswordConfirmValid", false);
    } else if (value === formData.newPw) {
      handleMessageChange("passwordConfirm", "");
      handleValidityChange("isPasswordConfirmValid", false);
    }
  };

  // 취소
  const handleCancelClick = () => {
    onClose();
  };

  const toggleMemberPwVisibility = () => {
    setMemberPwVisible(!memberPwVisible);
  };

  const toggleNewPwVisibility = () => {
    setNewPwVisible(!newPwVisible);
  };
  return (
    <div className={styles.container}>
      <div className={styles.modifyPwForm}>
        <div className={styles.inputWrap}>
          <span className={styles.modifyControlBtn}>
            <input
              type={memberPwVisible ? "text" : "password"}
              name="memberPw"
              placeholder="현재비밀번호를 입력해주세요"
              autoComplete="off"
              className={styles.inputPw}
              onChange={(e) => {
                handleInputChange("memberPw", e.target.value);
                setMemberPw(e.target.value);
              }}
            />
            <button
              className={styles.passwordVisibility}
              onClick={toggleMemberPwVisibility}
            >
              {memberPwVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </span>
          <p></p>
        </div>
        <div className={styles.inputWrap}>
          <span className={styles.modifyControlBtn}>
            <input
              type={newPwVisible ? "text" : "password"}
              name="newPw"
              placeholder="새비밀번호를 입력해주세요"
              autoComplete="off"
              className={styles.inputPw}
              onChange={(e) => {
                setNewPw(e.target.value);
                handleInputChange("newPw", e.target.value);
                validatePassword(e.target.value);
              }}
            />
            <button
              className={styles.passwordVisibility}
              onClick={toggleNewPwVisibility}
            >
              {newPwVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </span>
          <p className={styles.message}>{messages.password}</p>
        </div>

        <div className={styles.inputWrap}>
          <span className={styles.modifyControlBtn}>
            <input
              type={newPwVisible ? "text" : "password"}
              name="newPwAgain"
              placeholder="비밀번호를 다시 입력해주세요"
              autoComplete="off"
              className={styles.inputPw}
              onChange={(e) => {
                handleInputChange("newPwAgain", e.target.value);
                validatePasswordConfirm(e.target.value);
              }}
            />

            <button
              className={styles.passwordVisibility}
              onClick={toggleNewPwVisibility}
            >
              {newPwVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </span>
          <p className={styles.message}>{messages.passwordConfirm}</p>
        </div>
        <span className={styles.modifyControlBtn}>
          <button className={styles.modifyBackBtn} onClick={handleCancelClick}>
            취소
          </button>
          <button className={styles.modifyBtn} onClick={changepassword}>
            비밀번호수정완료
          </button>
        </span>
      </div>
    </div>
  );
};

export default ChangePw;
