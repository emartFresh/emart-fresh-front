/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import ShowProduct from "./component/ShowProduct";
import SearchingSection from "./component/SearchingSectionStore";
import SearchingSelection from "./component/SearchingSelectionStore";
import styles from "../page_css/ShowAllProduct.module.css";
import axios from "axios";
import ToTopBtn from "../../components/ToTopBtn";
//수정 : 무한 스크롤 적용(오프셋 리미트 0 30이 디폴트)

interface ProductFilterData {
  searchingTerm?: string;
  eventNumber?: number;
  select?: number;
  offset: number;
  limit: number;
}

export default function ShowStoreProduct() {
  const [productDatas, setProductDatas] = useState<ProductData[]>([]);
  const [page, setPage] = useState<number>(0);
  const [filteredData, setFilteredData] = useState<ProductFilterData>({
    searchingTerm: "",
    eventNumber: 0,
    select: 0,
    offset: 0,
    limit: 0,
  });

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const storeId: string | null = searchParams.get("storeid");
  if (storeId === null || storeId === undefined) {
    navigate("/search-store");
  }

  const fetchStoreData = async () => {
    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/store/get-storeinfo?storeId=${storeId}`;
    const data = await axios.get(url);

    return data;
  };

  const storeData = useQuery([`store${storeId}`], fetchStoreData, {
    staleTime: 10000,
  }).data;

  const triggerRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setPage((prevTrigger) => prevTrigger + 1);
        }
      },
      {
        root: null, // 루트 엘리먼트. null일 경우 뷰포트
        rootMargin: "10px", // 루트 엘리먼트 주변 여백
        threshold: 1.0, // 뷰포트에 대한 요소의 가시성 비율
      }
    );

    // Intersection Observer를 화면 트리거 엘리먼트에 연결
    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    // 컴포넌트 언마운트 시 Intersection Observer 해제
    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.showAllSection}>
      <div className={styles.nameWrapper}>
        <h1>{storeData?.data?.storeName}</h1>
        <p>{storeData?.data?.storeAddress}</p>
      </div>
      <SearchingSection
        page={page}
        setPage={setPage}
        setFilteredData={setFilteredData}
        filterData={filteredData}
        setProductDatas={setProductDatas}
      />
      <SearchingSelection
        setFilteredData={setFilteredData}
        filterData={filteredData}
        productDatas={productDatas}
      />
      <div className={styles.showAllCenterDiv}>
        <div className={styles.showWrapper}>
          <ShowProduct productDatas={productDatas} />
        </div>
      </div>

      <div className={styles.infTrigger} ref={triggerRef}></div>
      <ToTopBtn />
    </div>
  );
}
