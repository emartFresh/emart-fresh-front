import { useState } from "react";

import styles from "../page_css/CommonModal.module.css";
import { sendAxiosPostRequest } from "../../utils/userUtils";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";

// 이메일변경 메세지 1)
interface Messages {
  email: string;
  certificationCode: string;
}
// 인증번호
// interface Validity {
//   isEmailValid: boolean;
//   isEmailDuplicated: boolean;
//   isCertificationCode?: boolean;
// }
interface ModifyEmailProps {
  ischange: boolean;
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}
const ModifyEmail: React.FC<ModifyEmailProps> = () =>
  // onClose,
  // ischange,
  // setIsChange,
  {
    const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
    const [newEmail, setNewEmail] = useState<string>("");
    const [certificationCode, setCertificationCode] = useState<string>("");

    //이메일 메세지 2)
    const [messages, setMessages] = useState<Messages>({
      email: "",
      certificationCode: "",
    });

    const spaceRegex = /\s/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // 인증시작 -> 폼 입력창막기 / 인증번호 입력창 보이기 / 유효시간 보이기
    // const [showInput, setShowInput] = useState<boolean>(false);
    // const [showInputEmail, setShowInputEmail] = useState<boolean>(false);
    // const [showExpiryTime, setShowExpiryTime] = useState<boolean>(false); // 인증만료 시간
    // const [codeSendCount, setCodeSendCount] = useState(0); //

    // 이메일 유효성 검사 로직
    const validateEmail = (value: string) => {
      if (value.trim() === "") {
        handleMessageChange("email", "이메일을 입력해주세요.");
        // handleValidityChange("isEmailValid", false);
      } else if (spaceRegex.test(value)) {
        handleMessageChange(
          "email",
          "이메일은 띄어쓰기를 포함 할 수 없습니다."
        );
        // handleValidityChange("isEmailValid", false);
      } else if (!emailRegex.test(value)) {
        handleMessageChange("email", "이메일 형식이 유효하지 않습니다.");
        // handleValidityChange("isEmailValid", false);
      } else {
        handleMessageChange("email", "");
        // handleValidityChange("isEmailValid", false);
      }
    };

    // 인증 시간 시작 타이머
    // const handleStartTimer = () => {
    //   setShowExpiryTime(true);
    //   handleMessageChange("certificationCode", "인증번호를 입력해주세요");
    // };

    // 인증시간 만료 타이머
    // const handleCloseExpiryTime = () => {
    //   setShowExpiryTime(false);
    //   handleMessageChange(
    //     "certificationCode",
    //     "인증시간이 만료되었습니다. 다시 시도해주세요."
    //   );
    //   setCertificationCode("");
    // };
    // 이메일변경 메세지 3)
    const handleMessageChange = (fieldName: keyof Messages, value: string) => {
      setMessages({ ...messages, [fieldName]: value });
    };
    const handleCancelClick = () => {
      // onClose();
    };

    const checkEmailDuplication = async () => {
      const data = {
        newEmail: newEmail,
      };
      const url = `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-checkemail`;
      sendAxiosPostRequest(url, loginToken, setLoginToken, data)
        .then((response) => {
          console.log("API Response:", response);
          console.log(newEmail);
          alert("사용가능한 이메일입니다. 인증번호를 확인하세요");
        })
        .catch((error) => {
          console.log("Error", error);
          alert("사용중인 이메일입니다.");
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

          if (response.data === "이메일변경 성공") {
            console.log("이메일 변경이 완료되었습니다.");
            alert("이메일 변경이 완료되었습니다");
          }
        })

        .catch((error) => {
          console.log(error);
        });
    };
    return (
      <div>
        <h5>
          이메일 수정을 위해서는 <b>이메일 인증</b>이 필요합니다
        </h5>
        <p></p>
        <span className={styles.modifyControlBtn}>
          <input
            type="text"
            name="newEmail"
            placeholder="이메일을 입력하세요"
            autoComplete="off"
            className={styles.inputEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              validateEmail(e.target.value);
            }}
          />

          <button onClick={checkEmailDuplication}>인증번호발송</button>
        </span>
        <p className={styles.message}>{messages.email}</p>
        <div className={styles.inputWrap}>
          <div>
            <input
              type="text"
              name="certificationCode"
              autoComplete="off"
              className={styles.inputEmail}
              onChange={(e) => {
                setCertificationCode(e.target.value);
              }}
            />
          </div>
        </div>
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
