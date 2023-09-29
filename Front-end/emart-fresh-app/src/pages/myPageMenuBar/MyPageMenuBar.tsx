import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "../page_css/MyPage.module.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import ReorderIcon from "@mui/icons-material/Reorder";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import MailIcon from "@mui/icons-material/Mail";
import EventIcon from "@mui/icons-material/Event";
import {
  SendLoginPageIfNotLogin,
  GetUserName,
  GetUserAllInfo,
  GetUserAuth,
} from "../../utils/LoginUtils";
import { sendAxiosGetRequest } from "../../utils/userUtils";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";

// npm install @mui/material @emotion/react @emotion/styled
// npm install @mui/icons-material

interface Props {
  memberAuth: 0 | 1 | 2;
}
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
            {getUserAuth === 0 && (
              <div className={styles.mypagemenubar}>
                <ReorderIcon />
                <Link to="/mypageMain/mypageApplyManager">점포점주신청</Link>
              </div>
            )}
            <hr />
            {/* memberAuth==1(점주)일 때, 나오는 컴포넌트  */}
            {getUserAuth === 1 && (
              <div className={styles.mypagemenubar}>
                <ReorderIcon />
                <MemberAuthManager />
              </div>
            )}

            {/* memberAuth==2(관리자)일 때, 나오는 컴포넌트  */}
            {getUserAuth === 2 && (
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
