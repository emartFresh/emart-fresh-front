import axios from "axios";
import styles from "../../page_css/SearchingSection.module.css";
import { useEffect } from "react";

interface ProductFilterData {
  searchingTerm?: string;
  eventNumber?: number;
  select?: number;
  offset: number;
  limit: number;
}

interface ChildProps {
  setFilteredData: React.Dispatch<React.SetStateAction<ProductFilterData>>;
  filterData: ProductFilterData;
  setProductDatas: React.Dispatch<React.SetStateAction<ProductData[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function SearchingSection({
  setFilteredData,
  filterData,
  setProductDatas,
  page,
  setPage,
}: ChildProps) {
  useEffect(() => {
    submitSearch(page);
  }, [page]);

  const resetData = () => {
    setProductDatas([]);
    setPage(0);
    submitSearch(0);
  };

  const submitSearch = (page: number) => {
    const param = filterData;
    param.offset = page;
    param.limit = 30;

    const searchingData = { params: filterData };

    console.log("서치", searchingData);

    axios
      .get(
        `${import.meta.env.VITE_BACK_PORT}/product/all-product-list/filter`, //수정 : 페이징 처리
        searchingData
      )
      .then((res) => {
        console.log("현재 데이터");

        console.log("받는 데이터", res.data);
        setProductDatas((prevProductDatas) => [
          ...prevProductDatas,
          ...res.data,
        ]);
      });
  };

  const handleSearchInputChange = (e) => {
    const searchigData: ProductFilterData = {
      ...filterData,
      [e.target.name]: e.target.value,
    };
    setFilteredData(searchigData);
  };

  return (
    <section className={styles.inputSection}>
      <input
        onChange={handleSearchInputChange}
        name="searchingTerm"
        className={styles.searchingInput}
        type="text"
        placeholder="상품명을 검색해주세요."
      />
      <button className={styles.searchBtn} onClick={resetData}>
        검색
      </button>
    </section>
  );
}
