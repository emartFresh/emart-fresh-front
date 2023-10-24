/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";

import styles from "../page_css/MyPage.module.css";
import Administrator from "./Administrator";
import StoreManager from "./StoreManager";
import OrdinaryUser from "./OrdinaryUser";
import { GetUserAuth, SendLoginPageIfNotLogin } from "../../utils/LoginUtils";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";
import { sendAxiosGetRequest } from "../../utils/userUtils";
import { toast } from "react-toastify";

const MyPageMenuBar = () => {
  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  SendLoginPageIfNotLogin();

  const getUserAuth = GetUserAuth();
  useEffect(() => {
    const getMemberAuth = async () => {
      try {
        const response = await sendAxiosGetRequest(
          `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-info`,
          loginToken,
          setLoginToken
        );
        setMemberData(response.data);
      } catch (error) {
        toast.error("오류가 발생했습니다.");
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
              <OrdinaryUser setOpenDrawer={setOpenDrawer} />
            </div>
          )}
          {getUserAuth === 1 && (
            <div className={styles.mypagemenubar}>
              <StoreManager setOpenDrawer={setOpenDrawer} />
            </div>
          )}
          {getUserAuth === 2 && (
            <div className={styles.mypagemenubar}>
              <Administrator setOpenDrawer={setOpenDrawer} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyPageMenuBar;
