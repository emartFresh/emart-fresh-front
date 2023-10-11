import { useState, useEffect, useRef } from "react";
import ShowProduct from "./component/ShowProduct";
import SearchingSection from "./component/SearchingSection";
import SearchingSelection from "./component/SearchingSelection";
import StoreListSideBar from "./component/StoreListSideBar";
import styles from "../page_css/ShowAllProduct.module.css";

//수정 : 무한 스크롤 적용(오프셋 리미트 0 30이 디폴트)
interface ProductFilterData {
  searchingTerm?: string;
  eventNumber?: number;
  select?: number;
  offset: number;
  limit: number;
}

export default function ShowAllProduct() {
  const [productDatas, setProductDatas] = useState<ProductData[]>([]);
  const [filteredData, setFilteredData] = useState<ProductFilterData>({
    searchingTerm: "",
    eventNumber: 0,
    select: 0,
    offset: 0,
    limit: 0,
  });

  const [selectedItem, setSelectedItem] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
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
      <h1 className={styles.aboveTitle}>전체 상품</h1>
      <p className={styles.aboveP}>
        fresh가 취급하는 물품들을 만나보세요. <br></br> 상품을 클릭하면 해당
        상품이 있는 근처 가게를 볼 수 있습니다.
      </p>

      <StoreListSideBar
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
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
      <div className={styles.showWrapper}>
        <ShowProduct
          productDatas={productDatas}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </div>
      <div className={styles.infTrigger} ref={triggerRef}></div>
    </div>
  );
}
