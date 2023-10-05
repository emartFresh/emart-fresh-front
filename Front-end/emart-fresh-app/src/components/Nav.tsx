/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from "./comp_css/Nav.module.css";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";
import { useRecoilState } from "recoil";
import { kakaoAccessToken, loginState, loginTypeState } from "../atoms";
import { sendAxiosRequest } from "../utils/userUtils";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import logo from '../assets/images/default/defaultLogo.png';

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/"; // 홈 페이지 여부 확인
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [kakaoToken, setKakaoToken] = useRecoilState<string>(kakaoAccessToken);
  const [loginType, setLoginType] = useRecoilState<string>(loginTypeState);

  const logout = () => { 
    sendAxiosRequest('/member/logout', 'post', loginToken, setLoginToken, {loginType: loginType, kakaoAccessToken: kakaoToken})
    .then(() => {
      setLoginToken({
        accessToken: "",
        refreshToken: "",
      });
      setLoginType("");
      alert("로그아웃 완료! (임시 알림)");
    })
    .catch(
      console.error  
    )
  };

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  return (
    <>
      <nav className={styles.subNav}>
        <div className={styles.subContentDiv}>
          <span>
            {loginToken.refreshToken !== "" ? (
              <Link to="/" onClick={logout}>
                Logout
              </Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </span>
          <span>
            <Link to="/show">show</Link>
          </span>
          <span>
            {/* <Link to="/search">Search</Link> */}
            <IconButton aria-label="cart" onClick={() => navigate("/cart")}>
              <StyledBadge badgeContent={4} color="secondary">
                <ShoppingCartIcon />
              </StyledBadge>
            </IconButton>
          </span>
          <span>
            <Link to="/mypageMain">MyPage</Link>
          </span>
        </div>
      </nav>
      <nav className={`${styles.nav} ${isHomePage ? styles.home : ""}`}>
        <div>
          {/* <img src={logo} alt="" /> */}
          로고
        </div>
        <div className={styles.contentDiv}>
          <span>
            <Link to="/">Home</Link>
          </span>
          <span>
            <Link to="/order-request">발주</Link>
          </span>
          <span>
            <Link to="/request-order-list">발주승인</Link>
          </span>
          <span>
            <Link to="/show-all-product">전체</Link>
          </span>
          <span>
            <Link to="/storeproduct">가게</Link>
          </span>
          <span>
            <Link to="/eventlist">이벤트</Link>
          </span>
        </div>
        <div></div>
      </nav>
      <hr />
    </>
  );
}
