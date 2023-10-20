/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from "./comp_css/Nav.module.css";

import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  kakaoAccessToken,
  loginState,
  loginTypeState,
  cartItemCount,
  naverAccessToken,
} from "../atoms";
import { sendAxiosRequest } from "../utils/userUtils";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/pick-fresh logo.png";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/"; // 홈 페이지 여부 확인
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [kakaoToken, setKakaoToken] = useRecoilState<string>(kakaoAccessToken);
  const [naverToken, setNaverToken] = useRecoilState<string>(naverAccessToken);
  const [loginType, setLoginType] = useRecoilState<string>(loginTypeState);
  const [cartCount, setCartCount] = useRecoilState<number>(cartItemCount);

  // useEffect(() => {
  // }, []);
  

  const logout = () => {
    // aws 클라이언트 - 서버 에서 로그아웃 안되는 오류 있음
    const checkLogout = confirm("로그아웃하시겠습니까?");
    console.log('checkLogout >', checkLogout)

    if (checkLogout) {
      sendAxiosRequest(
        "/member/logout",
        "post",
        loginToken,
        setLoginToken,
        setCartCount,
        {
          loginType: loginType,
          kakaoAccessToken: kakaoToken,
          naverAccessToken: naverToken,
        }
      )
        .then(() => {
          setLoginType("");
          setKakaoToken("");
          setLoginToken({
            accessToken: "",
            refreshToken: "",
          });
          // setNaverToken("");
          setCartCount(0);
          toast.success("로그아웃되었습니다.");
        })
        .catch(console.error);
    }
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
          <span className={styles.loginLinkWrap}>
            {loginToken.refreshToken !== "" ? (
              <Link className={styles.logoutLink} to="/" onClick={logout}>
                Logout
              </Link>
            ) : (
              <Link to="/login">
                Login
                <FontAwesomeIcon icon={faRightToBracket} className={styles.loginLink}/>
              </Link>
            )}
            <p className={styles.arrowBox}>로그인</p>
          </span>
          <span onClick={() => navigate("/cart")}>
            <IconButton aria-label="cart" onClick={() => navigate("/cart")}>
              <StyledBadge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon />
              </StyledBadge>
            </IconButton>
          </span>
          <span>
            <Link className={styles.pypageLink} to="/mypageMain">
              MyPage
            </Link>
          </span>
        </div>
      </nav>
      <nav className={`${styles.nav} ${isHomePage ? styles.home : ""}`}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt="" className={styles.logoImage} />
        </div>
        <div className={styles.contentDiv}>
          <span className={styles.homeLink}>
            <Link to="/">Home</Link>
          </span>
          <span>
            <Link to="/show-all-product">상품</Link>
          </span>
          <span>
            <Link to="/search-store">매장찾기</Link>
          </span>
          <span>
            <Link to="/eventlist">이벤트</Link>
          </span>
        </div>
        <span className={styles.burger}>
          <MenuIcon />
        </span>
      </nav>
      <hr />
    </>
  );
}
