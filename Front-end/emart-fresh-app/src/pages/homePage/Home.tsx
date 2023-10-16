/* eslint-disable @typescript-eslint/no-unused-vars */
// import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import './styles.css';
import HomeProductEvent from "./HomeProductEvent";
import HomeEventBanner from './HomeEventBanner';
import HomeCoupon from "./HomeCoupon";
import { IsLogin } from "../../utils/LoginUtils";
import { sendAxiosRequest } from "../../utils/userUtils";
import { useRecoilState } from "recoil";
import { cartItemCount, loginState } from "../../atoms";

export default function Home() {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [cartCount, setCartCount] = useRecoilState<number>(cartItemCount);
  const isLogined = IsLogin();

  useEffect(() => {
    if(isLogined){
      sendAxiosRequest('/cart/myCartInfoCount', 'get', loginToken, setLoginToken, setCartCount)
      .then((res) => {
        setCartCount(JSON.parse(JSON.stringify(res)));
      })
      .catch(console.error)
    }
  })

  return (
    <>
      <HomeEventBanner/>
      <HomeProductEvent/>
      <HomeCoupon/>
    </>
  );
}
