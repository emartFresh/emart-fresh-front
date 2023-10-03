/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import styles from "../page_css/Login.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { kakaoAccessToken, loginState, loginTypeState } from "../../atoms";
import Inquiry from "./Inquiry";
import Modal from "./Modal";

const Login = () => {
  const [memberId, setMemberId] = useState<string>("");
  const [memberPw, setMemberPw] = useState<string>("");
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [kakaoToken, setKakaoToken] = useRecoilState<string>(kakaoAccessToken);
  const [loginType, setLoginType] = useRecoilState<string>(loginTypeState);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const REDIRECT_URL = 'http://localhost:5173/login';
  const { Kakao } = window;


  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if(code){
      axios.post('https://kauth.kakao.com/oauth/token', {
        grant_type: 'authorization_code',
        client_id: "d19f32cfc8b52ff1cea52dd94e860f6b",
        redirect_uri: REDIRECT_URL, 
        code: code,
      },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          }
        }
      )
      .then(async (res) => {
        console.log(res);
        setKakaoToken(res.data.access_token);
        await axios.post(`${import.meta.env.VITE_BACK_PORT}/member/kakaoLogin`, {
          access_token: res.data.access_token,
        })
        .then((res) => {
          setLoginToken(res.data.tokens);
          setLoginType(res.data.loginType);
          navigate("/");
        })
        .catch(
          console.error
        )
      })
      .catch(
        console.error
      )
    }
  });

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
        //jjs에 의한 수정
        //setLoginToken(response.data);
        console.log("수정값", response.data);
        setLoginToken(response.data.tokens);
        setLoginType(response.data.loginType);
        alert("로그인 완료! (임시 알림)");
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  const loginWithKakao = () => {
    /* 수정 : 이미 가입한 유저는 가입절차가 다름 -> 이메일/닉네임 허용할건지 안물어봐도됨 */

    Kakao.Auth.authorize({
      redirectUri: REDIRECT_URL,
      scope: 'account_email,profile_nickname'
    });
  };

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
            if(e.key === 'Enter') handleLogin() }}
        />
        <div className={styles.links}>
          <p onClick={openModal}>아이디 / 비밀번호 찾기</p>
          <Link to="/signup">아직 회원이 아니신가요?</Link>
        </div>
        {isModalOpen && (
          <Modal closeModal={closeModal}>
            <Inquiry closeModal={closeModal} />
          </Modal>
        )}
        <button className={styles.loginBtn} onClick={handleLogin}>
          로그인
        </button>
        <hr/>
        <p>SNS 로그인</p>
        <a id="kakao-login-btn" onClick={loginWithKakao} className={styles.kakaoLoginBtn}>
          <img src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" 
            width="222"
            alt="카카오 로그인 버튼" 
            className={styles.kakaoLoginBtn}/>
        </a>
      </div>
    </div>
  );
};

export default Login;
