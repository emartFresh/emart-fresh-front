/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import styles from "./ToggleMyPageMenubar.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Administrator from "./Administrator";
import StoreManager from "./StoreManager";
import OrdinaryUser from "./OrdinaryUser";
import { GetUserAuth, SendLoginPageIfNotLogin } from "../../utils/LoginUtils";
import { loginState } from "../../atoms";
import { useRecoilState } from "recoil";
import { sendAxiosGetRequest } from "../../utils/userUtils";
import { toast } from "react-toastify";

const ToggleMyPageMenubar = () => {
  const drawerRef = useRef(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  useEffect(() => {
    if (!openDrawer) drawerRef.current.style.left = "-160px";
    else drawerRef.current.style.left = "0";
  }, [openDrawer]);

  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);

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
        console.error("Error fetching mypageMenuBar:", error);
        toast.error("오류가 발생했습니다.");
      }
    };
    getMemberAuth();
  }, []);
  return (
    <div ref={drawerRef} className={styles.myPageDrawerContainer}>
      <div className={styles.myPageDrawerWrapper}>
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
      <button
        className={styles.drawerBtn}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        {openDrawer ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
      </button>
    </div>
  );
};
export default ToggleMyPageMenubar;
