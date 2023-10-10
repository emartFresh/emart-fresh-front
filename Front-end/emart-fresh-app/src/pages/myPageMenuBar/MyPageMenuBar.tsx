/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";

import styles from "../page_css/MyPage.module.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
// import ReorderIcon from "@mui/icons-material/Reorder";
// import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
// import MailIcon from "@mui/icons-material/Mail";
// import EventIcon from "@mui/icons-material/Event";
import {
  SendLoginPageIfNotLogin,
  GetUserAllInfo,
  GetUserAuth,
} from "../../utils/LoginUtils";
import { sendAxiosGetRequest } from "../../utils/userUtils";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import OrdinaryUser from "./OrdinaryUser"; // Auth =0 일때 추가할 컴포넌트
import Administrator from "./Administrator";
import StoreManager from "./StoreManager";
import { Link } from "react-router-dom";

// npm install @mui/material @emotion/react @emotion/styled
// npm install @mui/icons-material

// interface Props {
//   memberAuth: 0 | 1 | 2;
// }

// const MyPageMenuBar: React.FC<Props> = ({ memberAuth = 2 }) => {
//   const [open, setOpen] = useState(false);

//   const toggleDrawer = (isOpen) => () => {
//     setOpen(isOpen);
//   };

const MyPageMenuBar = () => {
  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [open, setOpen] = useState(false);
  const toggleDrawer = (isOpen: boolean) => () => {
    setOpen(isOpen);
  };
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
    <div className={styles.sideMenuBar}>
      <div>
        <Button
          sx={{
            marginLeft: "14rem",
            marginTop: 0,
            width: "50px",
          }}
          onClick={toggleDrawer(true)}
        >
          {/* <ReorderIcon /> */} 열기
        </Button>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              marginLeft: "5em",
              marginTop: "10em",
              width: "200px",
              background: "white",
            }}
            // role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            {getUserAuth === 0 && (
              <div className={styles.mypagemenubar}>
                <OrdinaryUser />
                <Link to="/mypageMain/mypageApplyManager">점포점주신청</Link>
              </div>
            )}
            <hr />
            {/* memberAuth==2일 때, 나오는 컴포넌트   수정: auth 2로 변경*/}
            {getUserAuth === 0 && (
              <div className={styles.mypagemenubar}>
                <Link to="/mypageMain/HandleApplyManager">점포점주신청</Link>
              </div>
            )}
            <hr />
            {/* memberAuth==1(점주)일 때, 나오는 컴포넌트  */}
            {getUserAuth === 1 && (
              <div className={styles.mypagemenubar}>
                {/* <MemberAuthManager /> */}
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
          </Box>
        </Drawer>
      </div>
    </div>
  );
};
export default MyPageMenuBar;
