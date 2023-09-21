/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import ShowProduct from "./component/ShowProduct";
import SearchingSection from "./component/SearchingSectionStore";
import SearchingSelection from "./component/SearchingSelectionStore";
import styles from "../page_css/ShowAllProduct.module.css";
//수정 : 무한 스크롤 적용(오프셋 리미트 0 30이 디폴트)

interface ProductFilterData {
  searchingTerm?: string;
  eventNumber?: number;
  select?: number;
}

export default function ShowStoreProduct() {
  const [productDatas, setProductDatas] = useState<ProductData[]>([]);
  const [filteredData, setFilteredData] = useState<ProductFilterData>({
    searchingTerm: "",
    eventNumber: 0,
    select: 0,
  });

  console.log("필터 데이터", filteredData);
  //수정 : 삭제하기

  return (
    <div className={styles.showAllSection}>
      <h1>가게페이지</h1>
      <SearchingSection
        setFilteredData={setFilteredData}
        filterData={filteredData}
        setProductDatas={setProductDatas}
      />
      <SearchingSelection
        setFilteredData={setFilteredData}
        filterData={filteredData}
        productDatas={productDatas}
      />
      <ShowProduct productDatas={productDatas} />
    </div>
  );
}
