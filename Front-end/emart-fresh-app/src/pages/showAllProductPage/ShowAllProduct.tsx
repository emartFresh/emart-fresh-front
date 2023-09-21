import { useState } from "react";
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
}

export default function ShowAllProduct() {
  const [productDatas, setProductDatas] = useState<ProductData[]>([]);
  const [filteredData, setFilteredData] = useState<ProductFilterData>({
    searchingTerm: "",
    eventNumber: 0,
    select: 0,
  });
  const [selectedItem, setSelectedItem] = useState<string[]>([]);

  console.log("리스트 데이터", selectedItem);
  //수정 : 삭제하기

  return (
    <div className={styles.showAllSection}>
      <h1>올페이지</h1>
      <StoreListSideBar
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
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
      <ShowProduct
        productDatas={productDatas}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
    </div>
  );
}
