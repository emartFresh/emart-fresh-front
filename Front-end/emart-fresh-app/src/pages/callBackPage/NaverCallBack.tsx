import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState } from "recoil";
import { naverAccessToken, loginState, loginTypeState } from "../../atoms";

import { useNavigate } from 'react-router-dom';

const NaverCallBack: React.FC = () => {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [naverToken, setNaverToken] = useRecoilState<string>(naverAccessToken);
  const [loginType, setLoginType] = useRecoilState<string>(loginTypeState);

  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const loadScripts = async () => {
      // Load jQuery
      const jqueryScript = document.createElement('script');
      jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
      jqueryScript.async = true;

      await new Promise<void>((resolve) => {
        jqueryScript.onload = () => resolve();
        document.head.appendChild(jqueryScript);
      });

      // Load Naver login script
      const naverScript = document.createElement('script');
      naverScript.src = 'https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js';
      naverScript.async = true;
      naverScript.charset = 'utf-8';

      await new Promise<void>((resolve) => {
        naverScript.onload = () => resolve();
        document.head.appendChild(naverScript);
      });

      try {
        const naver_id_login = new (window as any).naver_id_login("cK9SlUJ8PJ4TPM9Vuxir", "http://localhost:5173/naverCallBack");
        const naverAccessToken = naver_id_login.oauthParams.access_token;
        setNaverToken(naverAccessToken);
        const response = await axios.post(`${import.meta.env.VITE_BACK_PORT}/member/naverLogin`, {
          access_token: naverAccessToken
        });

        if (response.status === 200) {
          console.log(response);
          setLoginToken(response.data.tokens);
          setLoginType(response.data.loginType);

          navigate("/");

          const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
          }, 1000);

          setTimeout(() => {
            clearInterval(countdownInterval);
            window.close();
          }, 0);
        }
      } catch (error) {
        console.error('네이버 로그인에 실패했습니다.', error);
        setLoginType('');
        navigate("/login");
      }
    };

    loadScripts();
  }, []);

  return (
    <div>
      <h2>Naver Login</h2>
      {countdown > 0 && <p>창이 {countdown} 초 뒤에 닫힙니다.</p>}
      {loginType && <p>Login Type: {loginType}</p>}
    </div>
  );
};

export default NaverCallBack;