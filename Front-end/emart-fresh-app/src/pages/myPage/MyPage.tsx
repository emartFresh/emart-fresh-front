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
import { sendAxiosGetRequest } from "../../utils/userUtils";

// 회원 정보
interface MemberData {
  memberId: string; // 회원 아이디 (로그인용)
  memberPw: string; // 회원 비밀번호
  newPw?: string; // 비밀번호 재설정 (선택적 필드)
  memberName: string; // 사용자 이름
  memberEmail: string; // 사용자 메일
  memberAuth: 0 | 1 | 2; // 사용자 구분 (0: 일반유저, 1: 점주, 2: 웹 관리자)
  memberWarning: number; // 경고 횟수
  memberDel: boolean; // 회원 탈퇴 여부
}
export default function MyPage() {
  console.log("마이페이지 컴포넌트");

  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [memberId, setMemberId] = useState<string>("");
  const [memberName, setMemberName] = useState<string>("");
  const [memberEmail, setMemberEmail] = useState<string>("");
  const [memberAuth, setMemberAuth] = useState<0 | 1 | 2>(0);
  const [ischange, setIsChange] = useState<boolean>(false);
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);

  SendLoginPageIfNotLogin();
  console.log(GetUserAllInfo());

  useEffect(() => {
    const getMemberInfo = async () => {
      try {
        const response = await sendAxiosGetRequest(
          `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-info`,
          loginToken,
          setLoginToken
        );
        console.log("완료 후 토큰", loginToken);
        console.log(response.data); //undefined?
        console.log("Member ID:", response.data.memberId);

        setMemberData(response.data);
        setMemberId(response.data.memberId);
        setMemberName(response.data.memberName);
        setMemberEmail(response.data.memberEmail);
        setMemberAuth(response.data.memberAuth);
      } catch (error) {
        alert(error);
      }
    };
    getMemberInfo();
  }, [memberEmail, ischange]);

  // useEffect(() => {
  //   async function getMyinfo() {
  //     console.log(import.meta.env.VITE_BACK_PORT);
  //     try {
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-info`,
  //         { memberId: memberId }
  //       );

  //       console.log(response.data);

  //       setMemberId(response.data.memberId);
  //       setMemberName(response.data.memberName);
  //       setMemberEmail(response.data.memberEmail);
  //       setMemberAuth(response.data.memberAuth);
  //     } catch (error) {
  //       alert(error);
  //     }
  //   }
  //   getMyinfo();
  // }, [memberId, memberEmail, ischange]);

  return (
    <div className={styles.mypageMain}>
      <div className={styles.container}>
        <div className={styles.myinfo}>
          <div className={styles.myTitleId}>아이디</div>
          <div className={styles.myTitleIdValue}>{memberId}</div>
          <div className={styles.myTitleName}>이름</div>
          <div className={styles.myTitleNameValue}>{memberName}</div>
          <div className={styles.myTitleEmail}>이메일</div>
          <div className={styles.myTitleEmailValue}>
            {memberEmail}&nbsp;&nbsp;&nbsp;
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
