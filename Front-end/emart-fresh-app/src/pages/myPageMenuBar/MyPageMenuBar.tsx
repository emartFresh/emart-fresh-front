/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";

import styles from "../page_css/MyPage.module.css";
import Administrator from "./Administrator";
import StoreManager from "./StoreManager";
import OrdinaryUser from "./OrdinaryUser";
import {
  GetUserAllInfo,
  GetUserAuth,
  SendLoginPageIfNotLogin,
} from "../../utils/LoginUtils";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";
import { sendAxiosGetRequest } from "../../utils/userUtils";

const MyPageMenuBar = () => {
  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);

  SendLoginPageIfNotLogin();
  console.log("확인", GetUserAllInfo());

  const getUserAuth = GetUserAuth();
  useEffect(() => {
    const getMemberAuth = async () => {
      try {
        const response = await sendAxiosGetRequest(
          `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-info`,
          loginToken,
          setLoginToken
        );
        console.log("완료 후 토큰", loginToken);
        console.log("Axios Response:", response);

        setMemberData(response.data);
        console.log("멤버 아이디:", response.memberId);
        console.log("멤버Auth:", response.memberAuth);
      } catch (error) {
        console.error("Error fetching mypageMenuBar:", error);
        alert("오류가 발생했습니다.");
      }
    };
    getMemberAuth();
  }, []);

  return (
    <div className={styles.sideMenuBarWrapper}>
      <div className={styles.sideMenuBar}>
        <div>
          {getUserAuth === 0 && (
            <div className={styles.mypagemenubar}>
              <OrdinaryUser />
            </div>
          )}
          {getUserAuth === 1 && (
            <div className={styles.mypagemenubar}>
              <StoreManager />
            </div>
          )}
          {getUserAuth === 2 && (
            <div className={styles.mypagemenubar}>
              <Administrator />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyPageMenuBar;
