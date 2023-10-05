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
      .catch((err) => {
        console.log("-----------------------------에러");
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
