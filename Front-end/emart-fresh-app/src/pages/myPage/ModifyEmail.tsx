/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";

import styles from "../page_css/CommonModal.module.css";
import ExpiryTime from "../signupPage/ExpiryTime";
import { sendAxiosPostRequest } from "../../utils/userUtils";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

// 이메일변경 메세지 1)
interface Messages {
  email: string;
  certificationCode: string;
}

//인증번호
interface Validity {
  isEmailValid: boolean;
  isEmailDuplicated: boolean;
  isCertificationCode?: boolean;
}
interface ModifyEmailProps {
  ischange: boolean;
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}
const ModifyEmail: React.FC<ModifyEmailProps> = ({
  onClose,
  ischange,
  setIsChange,
}) => {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [newEmail, setNewEmail] = useState<string>("");
  const [certificationCode, setCertificationCode] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  //이메일 메세지 2)
  const [messages, setMessages] = useState<Messages>({
    email: "",
    certificationCode: "",
  });
  // 이메일변경 메세지 3)
  const handleMessageChange = (fieldName: keyof Messages, value: string) => {
    setMessages({ ...messages, [fieldName]: value });
  };
  // 유효성
  const [formValidity, setFormValidity] = useState<Validity>({
    isEmailValid: false,
    isEmailDuplicated: false,
    isCertificationCode: false,
  });
  // 인증번호
  const handleValidityChange = (fieldName: keyof Validity, value: boolean) => {
    setFormValidity({ ...formValidity, [fieldName]: value });
  };

  const spaceRegex = /\s/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  //취소
  const handleCancelClick = () => {
    onClose();
  };
  // 이메일 유효성 검사 로직
  const validateEmail = (value: string) => {
    if (value.trim() === "") {
      handleMessageChange("email", "이메일을 입력해주세요.");
      handleValidityChange("isEmailValid", false);
    } else if (spaceRegex.test(value)) {
      handleMessageChange("email", "이메일은 띄어쓰기를 포함 할 수 없습니다.");
      handleValidityChange("isEmailValid", false);
    } else if (!emailRegex.test(value)) {
      handleMessageChange("email", "이메일 형식이 유효하지 않습니다.");
      handleValidityChange("isEmailValid", false);
    } else {
      handleMessageChange("email", "");
      handleValidityChange("isEmailValid", false);
    }
  };

  // 인증시작 -> 폼 입력창막기 / 인증번호 입력창 보이기 / 유효시간 보이기
  const [showInput, setShowInput] = useState<boolean>(false);
  const [showExpiryTime, setShowExpiryTime] = useState<boolean>(false); // 인증만료 시간
  const [codeSendCount, setCodeSendCount] = useState(0); //
  const [enableCodeSendBtn, setEnableCodeSendBtn] = useState<boolean>(false);
  // 인증 시간 시작 타이머
  const handleStartTimer = () => {
    setShowExpiryTime(true);
    handleMessageChange("certificationCode", "인증번호를 입력해주세요");
  };

  // 인증시간 만료 타이머
  const handleCloseExpiryTime = () => {
    setShowExpiryTime(false);
    handleMessageChange(
      "certificationCode",
      "인증시간이 만료되었습니다. 다시 시도해주세요."
    );
    setCertificationCode("");
  };

  // 이메일 중복 여부 검사 후 인증번호 발송
  const checkEmailDuplication = async () => {
    const data = {
      newEmail: newEmail,
    };
    const url = `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-checkemail`;

    if (!emailRegex.test(newEmail)) {
      handleMessageChange("email", "유효한 이메일 주소를 입력하세요");
      handleValidityChange("isEmailValid", false);
      return;
    }
    sendAxiosPostRequest(url, loginToken, setLoginToken, data)
      .then((response) => {
        handleValidityChange("isEmailDuplicated", true);
        setIsEmailValid(true);
        toast.success("사용가능한 이메일입니다. 인증번호를 확인하세요");
        handleStartTimer();
        setShowInput(true); // 인증번호 입력창 활성화
      })
      .catch((error) => {
        console.error("Error", error);
        toast.error("사용중인 이메일입니다. ");
        handleValidityChange("isEmailValid", true);
        handleMessageChange("email", "사용중인 이메일입니다");
        handleValidityChange("isEmailDuplicated", false);
        setIsEmailValid(false);
      });
  };
  // 이메일 변경
  const modifyEmailing = async () => {
    const data = {
      memberEmail: newEmail,
      verifyCode: certificationCode,
    };
    const url = `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-changeemail`;
    sendAxiosPostRequest(url, loginToken, setLoginToken, data)
      .then((response) => {
        console.log("API Response: ", response);
        console.log("변경이메일", newEmail);
        console.log("인증코드 ", certificationCode);

        console.log("이메일 변경이 완료되었습니다.");
        toast.success("이메일 변경이 완료되었습니다");
        handleMessageChange("email", "이메일변경이 완료되었습니다.");
        handleValidityChange("isEmailDuplicated", true);
        setIsChange(!ischange);
        onClose();
      })
      .catch((error) => {
        console.log(error);
        toast.error("인증번호를 다시 확인해주세요.");
        handleMessageChange(
          "email",
          "이메일 변경에 실패했습니다. 인증번호를 다시 확인해주세요."
        );
        handleValidityChange("isEmailDuplicated", false);
      });
  };
  return (
    <div>
      <p className={styles.emailTitle}>
        이메일 수정을 위해서&nbsp;<b>이메일 인증</b>이 필요합니다.
      </p>
      <span className={styles.modifyControlBtn}>
        <input
          type="text"
          name="newEmail"
          placeholder="이메일을 입력하세요"
          autoComplete="off"
          className={styles.inputEmail}
          value={newEmail}
          onChange={(e) => {
            setNewEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          disabled={isEmailValid}
        />
        <button onClick={checkEmailDuplication}>이메일 중복확인</button>
      </span>
      <p className={styles.message}>{messages.email}</p>
      <div className={styles.inputCertificationCode}>
        <input
          type="text"
          name="certificationCode"
          placeholder="인증번호를 입력하세요"
          autoComplete="off"
          className={styles.inputEmailCertificationCode}
          onChange={(e) => {
            setCertificationCode(e.target.value);
          }}
        />
        &nbsp;&nbsp;&nbsp;
        {showExpiryTime && (
          <ExpiryTime
            callCount={codeSendCount}
            onClose={handleCloseExpiryTime}
            enableSendBtn={() => setEnableCodeSendBtn(false)}
          />
        )}
      </div>
      <p className={styles.message}>{messages.certificationCode}</p>
      <span className={styles.modifyControlBtn}>
        <button className={styles.modifyBackBtn} onClick={handleCancelClick}>
          취소
        </button>
        <button
          className={styles.modifyBtn}
          onClick={modifyEmailing}
          onChange={(e) => {
            setCertificationCode(e.currentTarget.value);
          }}
        >
          이메일변경
        </button>
      </span>
    </div>
  );
};
export default ModifyEmail;
