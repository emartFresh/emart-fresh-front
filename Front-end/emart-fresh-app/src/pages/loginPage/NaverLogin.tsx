/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../page_css/Login.module.css";
import axios from 'axios';
import { useRecoilState } from "recoil";
import { naverAccessToken, loginState, loginTypeState } from "../../atoms";

const NaverLogin = () => {
    const navigate = useNavigate();
    const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
    const [naverToken, setNaverToken] = useRecoilState<string>(naverAccessToken);
    const [loginType, setLoginType] = useRecoilState<string>(loginTypeState);

    useEffect(() => {
        const loadNaverLoginScript = async () => {
            try {
                const script = document.createElement('script');
                script.src = 'https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js';
                script.charset = 'utf-8';
                script.async = true;

                script.onload = () => {
                    const naver_id_login = new (window as any).naver_id_login("cK9SlUJ8PJ4TPM9Vuxir", "http://localhost:5173/naverCallBack");
                    const state = naver_id_login.getUniqState();
                    naver_id_login.setButton("green", 3, 50);
                    naver_id_login.setDomain("http://localhost:5173");
                    naver_id_login.setState(state);
                    naver_id_login.init_naver_id_login();

                    naver_id_login.getLoginStatus((status: any) => {
                        if (status) {
                            console.log('네이버 로그인 상태:', status);
                            const naverAccessToken = naver_id_login.oauthParams.access_token;

                            // Recoil 상태에 naverAccessToken 업데이트
                            setNaverToken(naverAccessToken);

                            // 백엔드에 요청 보내기
                            axios.post(`${import.meta.env.VITE_BACK_PORT}/member/naverLogin`, {
                                access_token: naverAccessToken
                            })
                                .then((response) => {
                                    console.log('네이버 로그인 응답:', response);
                                    setLoginToken(response.data.tokens);
                                    setLoginType(response.data.loginType);
                                    navigate('/');
                                })
                                .catch((error) => {
                                    console.error('네이버 로그인 실패:', error);
                                    setLoginType('');
                                    navigate('/');
                                });
                        }
                    });
                };

                document.head.appendChild(script);
            } catch (error) {
                console.error('네이버 로그인 스크립트 로드 실패:', error);
            }
        };

        loadNaverLoginScript();

        return () => {
            const script = document.querySelector('script[src="https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js"]');
            if (script) {
                document.head.removeChild(script);
            }
        };
    }, [navigate, setNaverToken, setLoginToken, setLoginType]);


    return (
        <div id="naver_id_login" className={styles.naverLoginBtn}></div>
    );
};

export default NaverLogin;