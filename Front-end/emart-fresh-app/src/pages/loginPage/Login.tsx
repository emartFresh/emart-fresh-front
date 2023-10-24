/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import styles from "../page_css/Login.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { kakaoAccessToken, loginState, loginTypeState } from "../../atoms";
import Inquiry from "./Inquiry";
import Modal from "./Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsLogin } from "../../utils/LoginUtils";
import NaverLogin from "./NaverLogin";
import kakaoLogin from "../../assets/images/kakao_login.png";

const Login = () => {
  const [memberId, setMemberId] = useState<string>("");
  const [memberPw, setMemberPw] = useState<string>("");
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [kakaoToken, setKakaoToken] = useRecoilState<string>(kakaoAccessToken);
  const [loginType, setLoginType] = useRecoilState<string>(loginTypeState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const isLogin = IsLogin();

  const navigate = useNavigate();
  const { Kakao } = window;

  useEffect(() => {
    console.log("call useEffect");
    const code = new URL(window.location.href).searchParams.get("code");

    if (isLogin) {
      navigate("/");
      toast.error("이미 로그인 상태입니다.");
      return;
    }

    if (code) {
      axios
        .post(
          "https://kauth.kakao.com/oauth/token",
          {
            grant_type: "authorization_code",
            client_id: "d19f32cfc8b52ff1cea52dd94e860f6b",
            redirect_uri: `${import.meta.env.VITE_KAKAOLOGIN_REDIRECTURL}`,
            code: code, 
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          }
        )
        .then(async (res) => {
          console.log(res);
          setKakaoToken(res.data.access_token);
          await axios
            .post(`${import.meta.env.VITE_BACK_PORT}/member/kakaoLogin`, {
              access_token: res.data.access_token,
            })
            .then((res) => {
              setLoginToken(res.data.tokens);
              setLoginType(res.data.loginType);
              navigate("/");
              toast.success(`로그인 되었습니다. 환영합니다 🙌🏻`, {
                icon: "✅",
              });
            })
            .catch(() =>
              toast.error("로그인에 실패했습니다. 관리자에게 문의해주세요.")
            );
        })
        .catch(console.error);
    }
  }, []);

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  const handleLogin = async () => {
    await axios
      .post(`${import.meta.env.VITE_BACK_PORT}/member/loginJwt`, {
        memberId: memberId,
        memberPw: memberPw,
      })
      .then((response) => {
        setLoginToken(response.data.tokens);
        setLoginType(response.data.loginType);
        navigate("/");
        toast.success(`로그인 되었습니다. 환영합니다 🙌🏻`, {
          icon: "✅",
        });
      })
      .catch(() => toast.error("아이디 / 비밀번호를 확인해주세요."));
  };

  const loginWithKakao = () => {
    /* 수정 : 이미 가입한 유저는 가입절차가 다름 -> 이메일/닉네임 허용할건지 안물어봐도됨 */

    Kakao.Auth.authorize({
      redirectUri: `${import.meta.env.VITE_KAKAOLOGIN_REDIRECTURL}`,
      scope: "account_email,profile_nickname",
    });
  };

  if (!IsLogin())
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>로그인</h2>
        <div className={styles.loginForm}>
          <input
            type="text"
            name="memberId"
            placeholder="아이디를 입력해주세요"
            className={styles.loginId}
            onChange={(e) => setMemberId(e.target.value)}
          />
          <input
            type="password"
            name="memberPw"
            placeholder="비밀번호를 입력해주세요"
            className={styles.loginPw}
            onChange={(e) => setMemberPw(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
          <div className={styles.links}>
            <p onClick={openModal} className={styles.inquiryOpen}>
              아이디 / 비밀번호 찾기
            </p>
            <Link to="/signup" className={styles.signupLink}>
              아직 회원이 아니신가요?
            </Link>
          </div>
          {isModalOpen && (
            <Modal closeModal={closeModal}>
              <Inquiry closeModal={closeModal} />
            </Modal>
          )}
          <button className={styles.loginBtn} onClick={handleLogin}>
            로그인
          </button>
          <hr />
          <h6 className={styles.snsLoginTitle}>SNS 로그인</h6>
          <div className={styles.snsBtnWrap}>
            <a id="kakao-login-btn">
              <img
                onClick={loginWithKakao}
                src={kakaoLogin}
                width="220"
                alt="카카오 로그인 버튼"
                className={styles.kakaoLoginBtn}
              />
            </a>
            <NaverLogin />
          </div>
        </div>
      </div>
    );
};

export default Login;
