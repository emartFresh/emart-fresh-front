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

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACK_PORT}/product/all-product-list`)
    .then((response) => {
    // console.log(response.data);
    // console.log('데이터를 네트워크에서 받아옴');
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
