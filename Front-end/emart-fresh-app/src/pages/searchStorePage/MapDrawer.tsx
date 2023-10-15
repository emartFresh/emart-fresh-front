import { useState, useEffect, useRef } from "react";
import { useQuery, UseQueryResult } from "react-query";
import axios from "axios";
import styles from "../page_css/SearchStore.module.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { Location } from "./SearchStorePage";
import PopularItem from "./PopularItem";
import StoreList from "./StoreList";

interface MapDrawerProps {
  storeData: StoreData[];
  setStoreData: React.Dispatch<React.SetStateAction<StoreData[]>>;
  userLocation: Location;
  selectedDistance: number;
  setSelectedDistance: React.Dispatch<React.SetStateAction<number>>;
}

export interface ReviewSummary {
  productTitle: string;
  avgReviewScore: number;
}

export interface OrderedCount {
  productTitle: string;
  orderedCount: number;
}

interface GetStoreInDis {
  productName: string; //실제 데이터로 수정
  maxDis: number;
  userLatitude: number;
  userLongitude: number;
}

export default function MapDrawer({
  storeData,
  setStoreData,
  userLocation,
  selectedDistance,
  setSelectedDistance,
}: MapDrawerProps) {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [selectedProductOption, setSelectedProductOption] = useState<number>(1);
  // const [selectedDistance, setSelectedDistance] = useState<number>(5);
  const [selectedProductName, setSelectedProductName] = useState<string>(null);

  const oneKmBtn = useRef(null);
  const twoKmBtn = useRef(null);
  const threeKmBtn = useRef(null);
  const kmBtnRefs = [oneKmBtn, twoKmBtn, threeKmBtn];

  const drawerRef = useRef(null);

  useEffect(() => {
    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/store/get-store-witnin-n-map`;

    const param: GetStoreInDis = {
      productName: selectedProductName, //수정
      maxDis: selectedDistance, //수정 ->selectedDistance
      userLatitude: userLocation.latitude,
      userLongitude: userLocation.longitude,
    };

    axios.get(url, { params: param }).then((res) => {
      setStoreData(res?.data);
    });
  }, [selectedDistance, selectedProductName]);

  const fetchTopReviewedProducts = () => {
    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/orderedproduct/topProductListByReview?n=10`;

    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        throw error;
      });
  };

  const fetchTopOrderedProducts = () => {
    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/orderedproduct/topProductListByOrderedCount?n=10`;

    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        throw error;
      });
  };

  const topReviewedProducts: UseQueryResult<ReviewSummary[], unknown> =
    useQuery(["topReviewedProducts"], fetchTopReviewedProducts, {
      staleTime: 100000,
    });

  const topOrderedProducts: UseQueryResult<OrderedCount[], unknown> = useQuery(
    ["topOrderedProducts"],
    fetchTopOrderedProducts,
    {
      staleTime: 100000,
    }
  );

  useEffect(() => {
    if (openDrawer) drawerRef.current.style.left = "-350px";
    else drawerRef.current.style.left = "0";
  }, [openDrawer]);

  useEffect(() => {
    for (const ref of kmBtnRefs) {
      ref.current.style.backgroundColor = "gray";
    }

    switch (String(selectedDistance)) {
      case "1":
        kmBtnRefs[0].current.style.backgroundColor = "#f95a00";
        break;
      case "3":
        kmBtnRefs[1].current.style.backgroundColor = "#f95a00";
        break;
      case "5":
        kmBtnRefs[2].current.style.backgroundColor = "#f95a00";
        break;
    }
  }, [selectedDistance]);

  const handleDisBtn = (e) => {
    const distance = e.target.name;
    setSelectedDistance(Number(distance));
  };

  return (
    <div ref={drawerRef} className={styles.drawerContainer}>
      <div className={styles.drawerWrapper}>
        <div className={styles.locationWrapper}>
          <div className={styles.title}>매장 검색</div>
          <div className={styles.btnWrapper}>
            <button
              ref={oneKmBtn}
              name="1"
              className={styles.disBtnOne}
              onClick={(e) => handleDisBtn(e)}
            >
              1km
            </button>
            <button
              ref={twoKmBtn}
              name="3"
              className={styles.disBtnTwo}
              onClick={(e) => handleDisBtn(e)}
            >
              3km
            </button>
            <button
              ref={threeKmBtn}
              name="5"
              className={styles.disBtnThree}
              onClick={(e) => handleDisBtn(e)}
            >
              5km
            </button>
            <div className={styles.inputWraaper}>
              <input className={styles.disInput} type="text" />
              <button className={styles.searchBtn}>
                <TravelExploreIcon />
              </button>
            </div>
          </div>
        </div>
        <div className={styles.productWrapper}>
          <div className={styles.productSelectWrapper}>
            <div className={styles.title}>인기상품</div>
            <select
              name=""
              id=""
              onChange={(e) => setSelectedProductOption(Number(e.target.value))}
            >
              <option value={1}>구매 횟수</option>
              <option value={2}>평점</option>
            </select>
          </div>
          <div className={styles.productListWrapper}>
            <PopularItem
              topReviewedProducts={topReviewedProducts}
              topOrderedProducts={topOrderedProducts}
              selectedProductOption={selectedProductOption}
              setSelectedProductName={setSelectedProductName}
            />
          </div>
        </div>
        <div className={styles.storeWrapper}>
          <div className={styles.storeListWrapper}>
            <StoreList storeData={storeData} />
          </div>
        </div>
      </div>
      <button
        className={styles.drawerBtn}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        {openDrawer ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
      </button>
    </div>
  );
}
