/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import styles from "../page_css/CommonModal.module.css";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { sendAxiosPostRequest } from "../../utils/userUtils";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";

interface ChangePWState {
  memberId: string;
  // currentPw: string;
  memberPw: string;
  newPw?: string;
}
// 비밀번호변경 메세지1)
interface Messages {
  password: string;
  passwordConfirm: string;
}
interface ModalProps {
  onClose: () => void;
}
const ChangePw = ({ onClose }: ModalProps) => {
  const initialChangePWState: ChangePWState = {
    memberId: "",
    // currentPw: "",
    memberPw: "",
    newPw: "",
  };

  const [currentPwVisible, setCurrentPwVisible] = useState<boolean>(false);
  const [newPwVisible, setNewPwVisible] = useState<boolean>(false);

  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [memberPw, setMemberPw] = useState<string>("");
  const [newPw, setNewPw] = useState<string>("");
  // const [currentPw, setCurrentPw] = useState<string>("");
  const [formData, setFormData] = useState<ChangePWState>(initialChangePWState);

  // 비밀번호변경 메세지2)
  const [messages, setMessages] = useState<Messages>({
    password: "",
    passwordConfirm: "",
  });

  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isPasswordConfirmValid, setIsPasswordConfirmValid] =
    useState<boolean>(false);

  // 비밀번호 변경부분!!
  async function changepassword() {
    console.log("콘솔 나오니?");
    const data = {
      memberPw: memberPw,
      newPw: newPw,
    };
    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/mypage/mypage-changepassword`;
    sendAxiosPostRequest(url, loginToken, setLoginToken, data).then((res) => {
      console.log("응답데이터, res", res); //undefined
      console.log("현재비밀번호 memberPW", memberPw);
      console.log("새비밀번호 newPW", newPw);

      // console.log("로그인토큰Access", loginToken);
    });

    // if (res.data === "fail") {
    //   alert("현재비밀번호를 확인하세요");
    // } else {
    //   alert("비밀번호가 성공적으로 변경되었습니다");
    //   onClose();
    // }
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

  // const validatePassword = (value: string) => {
  //   // 비밀번호 유효성 검사 로직 / 결과에 따라 메시지 및 유효성 상태 업데이트
  //   // const password = value; // 비밀번호 값 별도 변수에 저장
  //   if (value.trim() === "") {
  //     handleMessageChange("password", "비밀번호를 입력해주세요.");
  //     setIsPasswordValid(false);
  //   } else if (
  //     !/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*]).{8,16}$/.test(value)
  //   ) {
  //     handleMessageChange(
  //       "password",
  //       "영문/숫자/특수문자를 포함하고, 최소8자 최대16자로 입력해주세요."
  //     );
  //     setIsPasswordValid(false);
  //   } else if (value === formData.memberId) {
  //     handleMessageChange(
  //       "password",
  //       "비밀번호는 아이디와 동일할 수 없습니다."
  //     );
  //     setIsPasswordValid(false);
  //   } else {
  //     handleMessageChange("password", "");
  //     setIsPasswordValid(true);
  //   }
  // };

  // const validatePasswordConfirm = (value: string) => {
  //   // 비밀번호 확인 유효성 검사 로직 / 결과에 따라 메시지 및 유효성 상태 업데이트
  //   if (value !== formData.newPw) {
  //     handleMessageChange(
  //       "passwordConfirm",
  //       "비밀번호를 동일하게 입력해주세요"
  //     );
  //     setIsPasswordConfirmValid(false);
  //   } else if (value === formData.newPw) {
  //     handleMessageChange("passwordConfirm", "");
  //     setIsPasswordConfirmValid(true);
  //   }
  // };
  // 취소
  const handleCancelClick = () => {
    onClose();
  };

  const toggleCurrentPwVisibility = () => {
    setCurrentPwVisible(!currentPwVisible);
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
              type={currentPwVisible ? "text" : "password"}
              // name="currentPw"
              name="memberPw"
              placeholder="현재비밀번호를 입력해주세요"
              autoComplete="off"
              className={styles.inputPw}
              onChange={(e) => {
                // handleInputChange("currentPw", e.target.value);
                handleInputChange("memberPw", e.target.value);
                setMemberPw(e.target.value);
              }}
            />
            <button onClick={toggleCurrentPwVisibility}>
              {currentPwVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
                // validatePassword(e.target.value);
              }}
            />
            <button onClick={toggleNewPwVisibility}>
              {newPwVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </span>
          <p className={styles.message}>{messages.password}</p>
        </div>

        <div className={styles.inputWrap}>
          <span className={styles.modifyControlBtn}>
            <input
              type={newPwVisible ? "text" : "password"}
              name="newNewPw"
              placeholder="비밀번호를 다시 입력해주세요"
              autoComplete="off"
              className={styles.inputPw}
              onChange={(e) => {
                handleInputChange("newPw", e.target.value);
                // validatePasswordConfirm(e.target.value);
              }}
            />

            <button onClick={toggleNewPwVisibility}>
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
