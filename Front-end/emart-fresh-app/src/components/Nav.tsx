/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from "./comp_css/Nav.module.css";

import { Link, useLocation, useNavigate } from "react-router-dom";
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
import {
  faBars,
  faRightFromBracket,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/pick-fresh logo.png";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/"; // 홈 페이지 여부 확인
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [kakaoToken, setKakaoToken] = useRecoilState<string>(kakaoAccessToken);
  const [naverToken, setNaverToken] = useRecoilState<string>(naverAccessToken);
  const [loginType, setLoginType] = useRecoilState<string>(loginTypeState);
  const [cartCount, setCartCount] = useRecoilState<number>(cartItemCount);

  const [menuBarRight, setMenuBarRight] = useState(-100);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setMenuBarRight(0);
    } else {
      setMenuBarRight(-100);
    }
  }, [isOpen]);

  const logout = () => {
    const checkLogout = confirm("로그아웃하시겠습니까?");
    console.log("checkLogout >", checkLogout);

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
        .catch(() => toast.error("로그아웃에 실패했습니다."));
    }
  };

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
      fontSize: "8px",
      backgroundColor: "#f9bb00",
      color: "#000000",
    },
  }));

  return (
    <>
      <nav className={styles.subNav}>
        <div className={styles.subContentDiv}>
          {loginToken.refreshToken !== "" ? (
            <span className={styles.subMenuItem}>
              <Link to="/" onClick={logout} className={styles.logoutLink}>
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className={styles.loginLink}
                />
              </Link>
              <p className={styles.arrowBox}>로그아웃</p>
            </span>
          ) : (
            <span className={styles.subMenuItem}>
              <Link to="/login">
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  className={styles.loginLink}
                />
              </Link>
              <p className={styles.arrowBox}>로그인</p>
            </span>
          )}
          <span className={styles.subMenuItem}>
            <Link to="/mypageMain">
              <FontAwesomeIcon icon={faUser} className={styles.mypageIcon} />
            </Link>
            <p className={styles.arrowBox}>마이페이지</p>
          </span>
          <span
            onClick={() => navigate("/cart")}
            className={styles.subMenuItem}
          >
            <IconButton
              aria-label="cart"
              onClick={() => navigate("/cart")}
              className={styles.cartIcon}
            >
              <StyledBadge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon />
              </StyledBadge>
            </IconButton>
            <p className={styles.cartArrowBox}>장바구니</p>
          </span>
        </div>
      </nav>
      <nav className={`${styles.nav} ${isHomePage ? styles.home : ""}`}>
        <div className={styles.logoWrapper}>
          <img
            src={logo}
            alt=""
            className={styles.logoImage}
            onClick={() => navigate("/")}
          />
        </div>
        <div className={styles.contentDiv}>
          <span>
            <Link to="/show-all-product">전체 상품</Link>
          </span>
          <span>
            <Link to="/search-store">근처 매장찾기</Link>
          </span>
          <span>
            <Link to="/eventlist">이벤트</Link>
          </span>
        </div>
        <span className={styles.burger}>
          <FontAwesomeIcon
            icon={faBars}
            onClick={() => {
              setIsOpen(true);
            }}
          />
        </span>
      </nav>
      <hr />
      <div className={styles.menuBar} style={{ right: `${menuBarRight}%` }}>
        <div>
          <img src={logo} alt="" className={styles.logoImage} />
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => {
              setIsOpen(false);
            }}
          />
        </div>
        <div>메뉴1</div>
      </div>
    </>
  );
}
