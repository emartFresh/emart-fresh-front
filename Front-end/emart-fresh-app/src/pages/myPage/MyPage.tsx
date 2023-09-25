/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import styles from "../page_css/MyPage.module.css";
import axios from "axios";

import CommonModalBasicEmail from "./CommonModalBasicEmail";
import CommonModalBasic from "./CommonModalBasic";
import {
  SendLoginPageIfNotLogin,
  GetUserName,
  GetUserAllInfo,
} from "../../utils/LoginUtils";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";

export default function MyPage() {
  console.log("마이페이지 컴포넌트");

  const [memberId, setMemberId] = useState<string>("");
  const [memberName, setMemberName] = useState<string>("");
  const [memberEmail, setMemberEmail] = useState<string>("");
  const [memberAuth, setMemberAuth] = useState<0 | 1 | 2>(0);
  const [ischange, setIsChange] = useState<boolean>(false);
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);

  SendLoginPageIfNotLogin();
  console.log(GetUserAllInfo());

  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_BACK_PORT}/mypage/mypage-info`)
      .then((res) => {
        console.log(res.data);
        setProductData(res.data);
      });
  }, []);

  useEffect(() => {
    async function getMyinfo() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-info`,
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
        {/* <div className={styles.mypageTitle}>개인회원정보</div> */}
        <div className={styles.myinfo}>
          <div className={styles.myTitleId}>아이디</div>
          <div className={styles.myTitleIdValue}>{memberId}</div>
          <div className={styles.myTitleName}>이름</div>
          <div className={styles.myTitleNameValue}>{memberName}</div>
          <div className={styles.myTitleEmail}>이메일</div>
          <div className={styles.myTitleEmailValue}>
            {memberEmail}&nbsp;&nbsp;&nbsp;{" "}
            {/* className={styles.mypageTitleEmailValueBtn} */}
            <div>
              <CommonModalBasicEmail
                ischange={ischange}
                setIsChange={setIsChange}
              />
            </div>
          </div>

          {/* <div>비밀번호</div> */}

          {/* <div className={styles.editEmail}>
            <CommonModalBasicEmail
              ischange={ischange}
              setIsChange={setIsChange}
            /> */}
          {/* </div> */}
          <div className={styles.editPassword}>
            <CommonModalBasic />
          </div>
        </div>
      </div>
    </div>
  );
}
