/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";

import styles from "../page_css/CommonModal.module.css";
import ExpiryTime from "../signupPage/ExpiryTime";
// import { GetUserAllInfo } from "../../utils/LoginUtil";
import { sendAxiosPostRequest } from "../../utils/userUtils";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";

// 이메일변경 메세지 1)
interface Messages {
  email: string;
  certificationCode: string;
}
// 인증번호
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
// eslint-disable-next-line react-hooks/rules-of-hooks
// const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
const ChangeEmail: React.FC<ModifyEmailProps> = ({
  onClose,
  ischange,
  setIsChange,
}) => {
  const [memberId, setMemberId] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [certificationCode, setCertificationCode] = useState<string>("");

  // const userInfos = GetUserAllInfo();
  // 실행시점 보장 되지 않는다 - 우선적으로 null 처리해야한다.

  // console.log("유저인포", userInfos);
  //이메일 메세지 2)
  const [messages, setMessages] = useState<Messages>({
    email: "",
    certificationCode: "",
  });

  // 유효성
  const [formValidity, setFormValidity] = useState<Validity>({
    isEmailValid: false,
    isEmailDuplicated: false,
    isCertificationCode: false,
  });

  const spaceRegex = /\s/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // 인증시작 -> 폼 입력창막기 / 인증번호 입력창 보이기 / 유효시간 보이기
  const [showInput, setShowInput] = useState<boolean>(false);
  const [showInputEmail, setShowInputEmail] = useState<boolean>(false);
  const [showExpiryTime, setShowExpiryTime] = useState<boolean>(false); // 인증만료 시간
  const [codeSendCount, setCodeSendCount] = useState(0); //

  useEffect(() => {
    isFormValid();
  }, []);

  const isFormValid = () => {
    const copyobj = { ...formValidity };
    delete copyobj.isCertificationCode;
  };
  // 회원가입시 유효한가에 대한 여부
  const isSignupValid = () => {
    const validity = Object.values(formValidity).every(Boolean);
    return validity;
  };

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

  // 이메일변경 메세지 3)
  const handleMessageChange = (fieldName: keyof Messages, value: string) => {
    setMessages({ ...messages, [fieldName]: value });
  };

  // 인증번호
  const handleValidityChange = (fieldName: keyof Validity, value: boolean) => {
    setFormValidity({ ...formValidity, [fieldName]: value });
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

  // 이메일 중복 여부 검사, DB 중복 여부 검사
  // const checkEmailDuplication = async () => {
  //   const data = {
  //     memberId: memberId,
  //     newEmail: newEmail,
  //   };
  //   const url = `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-checkemail`;
  //   // sendAxiosPostRequest(url, loginToken, setLoginToken, data)
  //   //   .then((response) => {
  //   //     console.log("API Response:", response.data);
  //   //     console.log(newEmail);
  //   //     console.log(memberId);

  //       if (response.data == "사용중인 이메일") {
  //         alert("사용가능한 이메일입니다!");
  //         handleMessageChange(
  //           "email",
  //           "사용가능한 이메일입니다. 인증번호를 확인하세요"
  //         );
  //         handleValidityChange("isEmailDuplicated", true);
  //         handleStartTimer();
  //         setShowInput(true); // 인증번호 입력창 활성화
  //       } else {
  //         alert("사용중인 이메일입니다!");
  //         handleMessageChange("email", "사용중인 이메일입니다");
  //         handleValidityChange("isEmailDuplicated", false);
  //       }
  //       onClose();
  //     })
  //     .catch((error) => {
  //       console.error("Error", error);
  //       alert("오류가 발생했습니다.");
  //     });
  // };

  // 취소
  const handleCancelClick = () => {
    onClose();
  };
  // 이메일 변경
  // const modifyEmailing = async () => {
  //   const data = {
  //     memberId: memberId,
  //     newEmail: newEmail,
  //     verificationCode: certificationCode,
  //   };
  //   const url = `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-changeemail`;
  //   sendAxiosPostRequest(url, loginToken, setLoginToken, data)
  //     .then((response) => {
  //       console.log("API Response:", response.data);
  //       console.log(newEmail);
  //       console.log(memberId);

  //       console.log(response.data);
  //       console.log(response.status); // 백엔드에서 보내는 상태

  //       if (response.data === "이메일변경 성공") {
  //         console.log("이메일 변경이 완료되었습니다");
  //         handleMessageChange("email", "이메일변경이 완료되었습니다.");
  //         handleValidityChange("isEmailDuplicated", true);
  //         alert("이메일변경!");
  //         setIsChange(!ischange);
  //         onClose();
  //       } else {
  //         handleMessageChange(
  //           "email",
  //           "이메일 변경에 실패했습니다. 인증번호를 다시 확인해주세요."
  //         );
  //         handleValidityChange("isEmailDuplicated", false);
  //       }
  //     })
  //     .catch((error) => console.log(error));
  // };

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
            validateEmail(e.target.value);
            setNewEmail(e.target.value);
          }}
          onBlur={() => {
            if (formValidity.isEmailValid) {
              // checkEmailDuplication();
            }
          }}
        />

        <button
          onClick={() => {
            // checkEmailDuplication();
            setCodeSendCount(() => codeSendCount + 1);
            setShowInput(true);
            setShowInputEmail(false);
          }}
        >
          인증번호발송
        </button>
      </span>
      <p className={styles.message}>{messages.email}</p>
      <div className={styles.inputWrap}>
        <div>
          <input
            type="text"
            name="certificationCode"
            autoComplete="off"
            // disabled={!showInput}
            className={styles.inputEmail}
            onChange={(e) => {
              setCertificationCode(e.target.value);
            }}
          />
        </div>
        <p className={styles.message}>{messages.certificationCode}</p>

        {showExpiryTime && (
          <ExpiryTime
            callCount={codeSendCount}
            onClose={handleCloseExpiryTime}
          />
        )}
      </div>

      <span className={styles.modifyControlBtn}>
        <button className={styles.modifyBackBtn} onClick={handleCancelClick}>
          취소
        </button>
        <button
          className={styles.modifyBtn}
          // onClick={modifyEmailing}
          disabled={!isSignupValid}
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
export default ChangeEmail;
