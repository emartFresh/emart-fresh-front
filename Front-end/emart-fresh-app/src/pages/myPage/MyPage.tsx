/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import styles from "../page_css/MyPage.module.css";
import CommonModalBasicEmail from "./CommonModalBasicEmail";
import CommonModalBasic from "./CommonModalBasic";

import {
  SendLoginPageIfNotLogin,
  GetUserName,
  GetUserAllInfo,
} from "../../utils/LoginUtils";

import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { sendAxiosGetRequest } from "../../utils/userUtils";

export default function MyPage() {
  console.log("마이페이지 컴포넌트");

  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [memberEmail, setMemberEmail] = useState<string>("");
  const [ischange, setIsChange] = useState<boolean>(false);
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const allMember = GetUserAllInfo();
  SendLoginPageIfNotLogin();
  console.log("확인", GetUserAllInfo());

  useEffect(() => {
    const response = sendAxiosGetRequest(
      `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-info`,
      loginToken,
      setLoginToken
    );

    response
      .then((res) => {
        setMemberData(res.data);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, [memberEmail, ischange]);

  return (
    <div className={styles.mainContent}>
      <div className={styles.mypageMain}>
        <div className={styles.container}>
          <div className={styles.myinfo}>
            <div className={styles.myTitleId}>아이디</div>
            <div className={styles.myTitleIdValue}>{allMember.memberId}</div>
            <div className={styles.myTitleName}>이름</div>
            <div className={styles.myTitleNameValue}>
              {allMember.memberName}
            </div>
            <div className={styles.myTitleEmail}>이메일</div>
            <div className={styles.myTitleEmailValue}>
              {allMember.memberEmail}&nbsp;&nbsp;&nbsp;
              <div>
                <CommonModalBasicEmail
                  ischange={ischange}
                  setIsChange={setIsChange}
                />
              </div>
            </div>
            <div className={styles.editPassword}>
              <CommonModalBasic />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
