/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import styles from "../page_css/MyPage.module.css";
import axios from "axios";

import CommonModalBasicEmail from "./CommonModalBasicEmail";
import CommonModalBasic from "./CommonModalBasic";

export default function MyPage() {
  console.log("마이페이지 컴포넌트");

  const [memberId, setMemberId] = useState<string>("user123");
  const [memberName, setMemberName] = useState<string>("");
  const [memberEmail, setMemberEmail] = useState<string>("");
  const [memberAuth, setMemberAuth] = useState<0 | 1 | 2>(0);
  const [ischange, setIsChange] = useState<boolean>(false);

  useEffect(() => {
    async function getMyinfo() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACK_PORT}/mypage/mypage-info`,
          null,
          {
            params: {
              memberId: memberId,
            },
          }
        );

        console.log(response.data);

        setMemberId(response.data.memberId);
        setMemberName(response.data.memberName);
        setMemberEmail(response.data.memberEmail);
        setMemberAuth(response.data.memberAuth);
      } catch (error) {
        alert(error);
      }
    }
    getMyinfo();
  }, [memberId, memberEmail, ischange]);

  return (
    <div className={styles.mypageMain}>
      <div className={styles.container}>
        <h3 className={styles.mypageTitle}>개인회원정보</h3>
        <div className={styles.myinfo}>
          <div>아이디</div>
          <div style={{ textAlign: "left" }}>{memberId}</div>
          <div>이름</div>
          <div style={{ textAlign: "left" }}>{memberName}</div>
          <div>이메일</div>
          <div style={{ textAlign: "left" }}>
            {memberEmail}
            <CommonModalBasicEmail
              ischange={ischange}
              setIsChange={setIsChange}
            />
          </div>
        </div>
        {/* <div>비밀번호</div> */}
        <div>
          <CommonModalBasic />

          {/* <ModifyEmail /> */}
        </div>
      </div>
    </div>
  );
}
