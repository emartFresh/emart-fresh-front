/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import styles from "../page_css/Login.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import Inquiry from "./Inquiry";
import Modal from "./Modal";

const Login = () => {
    const [memberId, setMemberId] = useState<string>('');
    const [memberPw, setMemberPw] = useState<string>('');
    const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    // 모달을 열기 위한 함수
    const openModal = ():void => {
      setIsModalOpen(true);
    };

    // 모달을 닫기 위한 함수
    const closeModal = ():void => {
      setIsModalOpen(false);
    };

  const handleLogin = async () => {
    console.log(import.meta.env.VITE_BACK_PORT);
    
    await axios
      .post(`${import.meta.env.VITE_BACK_PORT}/member/loginJwt`, {
        memberId: memberId,
        memberPw: memberPw,
      })
      .then((response) => {
        setLoginToken(response.data);
        console.log("access >>>>> " + response.data.accessToken);
        console.log("refresh >>>>>" + response.data.refreshToken);
        alert("로그인 완료! (임시 알림)");
        navigate("/");
      })
      .catch((error) => console.log(error));
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
        />
        <div className={styles.links}>
          <p onClick={openModal}>아이디 / 비밀번호 찾기</p>
          <Link to="/signup">아직 회원이 아니신가요?</Link>
        </div>
        {
        isModalOpen && (
            <Modal closeModal={closeModal}>
              <Inquiry closeModal={closeModal}/>
            </Modal>
        )}
        <button className={styles.loginBtn} onClick={handleLogin}>
          로그인
        </button>
        {/* 수정 : <div>카카오로그인</div> */}
      </div>
    </div>
  );
};

export default Login;
