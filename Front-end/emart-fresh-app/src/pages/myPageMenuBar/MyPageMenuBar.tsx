import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import styles from "../page_css/MyPage.module.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import ReorderIcon from "@mui/icons-material/Reorder";

import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

import MailIcon from "@mui/icons-material/Mail";

import EventIcon from "@mui/icons-material/Event";

// npm install @mui/material @emotion/react @emotion/styled
// npm install @mui/icons-material

interface Props {
  memberAuth: 0 | 1 | 2;
}

// const MyPageMenuBar: React.FC<Props> = ({ memberAuth = 2 }) => {
//   const [open, setOpen] = useState(false);

//   const toggleDrawer = (isOpen) => () => {
//     setOpen(isOpen);
//   };

const MyPageMenuBar = () => {
  const [open, setOpen] = useState(false);

  const [memberId, setMemberId] = useState(""); /* owner1 => auth=1(점주) */
  const [memberAuth, setMemberAuth] = useState<0 | 1 | 2>(0);

  const toggleDrawer = (isOpen: boolean) => () => {
    setOpen(isOpen);
  };

  // useEffect(() => {
  //   async function getMyinfo() {
  //     try {
  //       const response = await axios.post(
  //         `${import.meta.env.VITE_BACK_PORT}/mypage/mypage-info`,
  //         null,
  //         {
  //           params: {
  //             memberId: memberId,
  //           },
  //         }
  //       );

  //       console.log(response.data);

  //       setMemberId(response.data.memberId);
  //       setMemberAuth(response.data.memberAuth);
  //     } catch (error) {
  //       alert(error);
  //     }
  //   }
  //   getMyinfo();
  // }, []);
  return (
    <div className={styles.sideMenuBar}>
      <div>
        <Button onClick={toggleDrawer(true)}>
          <ReorderIcon /> 열기
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
            <div className={styles.mypagemenubar}>
              <ReorderIcon />
              <Link to="/mypageMain">개인정보관리</Link>
            </div>
            <div className={styles.mypagemenubar}>
              <ReorderIcon />
              <Link to="/mypageMain/myorder">나의주문내역</Link>
            </div>
            <div className={styles.mypagemenubar}>
              <ReorderIcon />
              <Link to="/mypageMain/myreview">내가작성한리뷰</Link>
            </div>
            <div className={styles.mypagemenubar}>
              <ReorderIcon />
              <Link to="/mypageMain/mycoupon">나의쿠폰조회</Link>
            </div>
            <hr />
            <hr />
            {/* memberAuth==0일 때, 나오는 컴포넌트  */}
            {memberAuth === 0 && (
              <div className={styles.mypagemenubar}>
                <ReorderIcon />
                <Link to="/mypageMain/mypageApplyManager">점포점주신청</Link>
              </div>
            )}
            <hr />
            {/* memberAuth==2일 때, 나오는 컴포넌트   수정: auth 2로 변경*/}
            {memberAuth === 0 && (
              <div className={styles.mypagemenubar}>
                <ReorderIcon />
                <Link to="/mypageMain/HandleApplyManager">점포점주신청</Link>
              </div>
            )}
            <hr />
            {/* memberAuth==1(점주)일 때, 나오는 컴포넌트  */}
            {memberAuth === 1 && (
              <div className={styles.mypagemenubar}>
                <ReorderIcon />
                <MemberAuthManager />
              </div>
            )}

            {/* memberAuth==2(관리자)일 때, 나오는 컴포넌트  */}
            {memberAuth === 2 && (
              <div className={styles.mypagemenubar}>
                <ReorderIcon />
                <MemberAuthAdmin />
              </div>
            )}
          </Box>
        </Drawer>
      </div>
    </div>
  );
};
export default MyPageMenuBar;

// /* memberAuth==1일 때, 나오는 컴포넌트  */
function MemberAuthManager() {
  return (
    <div>
      <div className={styles.mypagemenubar}>
        <MailIcon />
        <Link to="/mypageMain/mycoupon">나의쿠폰조회</Link>
        {/* 링크 수정 */}
      </div>

      <div className={styles.mypagemenubar}>
        <ProductionQuantityLimitsIcon />
        발주받기
      </div>
    </div>
  );
}

// /* memberAuth==2일 때, 나오는 컴포넌트  */
function MemberAuthAdmin() {
  return (
    <div>
      <div className={styles.mypagemenubar}>
        <MailIcon />
        <Link to="/mypageMain/mycoupon">발주받는 페이지</Link>
        {/* 링크 수정 */}
      </div>
      <div className={styles.mypagemenubar}>
        <ProductionQuantityLimitsIcon />
        발주주는 페이지
      </div>
      <div className={styles.mypagemenubar}>
        <EventIcon />
        <Link to="/mypageMain/EventRegi">이벤트 생성</Link>
        {/* 링크 수정 */}
      </div>
    </div>
  );
}
