/* eslint-disable @typescript-eslint/no-unused-vars */
// import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import './styles.css';
import HomeProductEvent from "./HomeProductEvent";
import HomeEventBanner from './HomeEventBanner';
import HomeCoupon from "./HomeCoupon";

export default function Home() {
  const [eventProductData, setEventProductHomeData] = useState<ProductData[]>([]);

    // const [testData, setTestData] = useState([]);
    // const fetchData =  async() => {
    //   await fetch("/coupon.json")
    //   .then((res) => {
    //     res.json().then(rs => setTestData(rs))
    //   })
    //   .catch((err) => console.error(err));
    // };
    // const res = useQuery(["couponList"], fetchData, { staleTime: 5000 });

  // API 요청 시 "Authorization" 헤더에 JWT 토큰 추가
  // axios.post('http://localhost:8080/~~~~~~', {requestbody}, {
  //   headers: {
  //     'Authorization': `Bearer ${token}` // "Authorization" 헤더에 JWT 토큰 추가
  //   }
  // })
  //   .then(response => {
  //     console.log(response.data);
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });


  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACK_PORT}/product/all-product-list`)
    .then((response) => {
    console.log(response.data);
    console.log('데이터를 네트워크에서 받아옴');
    setEventProductHomeData(response.data);
    })
    .catch((error) => console.log(error));
    }, []);

  return (
    <>
      <HomeEventBanner/>
      <HomeProductEvent eventProductData={eventProductData}/>
      <HomeCoupon/>
    </>
  );
}
