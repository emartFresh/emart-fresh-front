import { useState, useEffect, useRef } from "react";
import styles from "../page_css/SearchStore.module.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

export default function MapDrawer() {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    console.log("상태", openDrawer);
    if (openDrawer) drawerRef.current.style.left = "-350px";
    else drawerRef.current.style.left = "0";
  }, [openDrawer]);

  return (
    <div ref={drawerRef} className={styles.drawerContainer}>
      <div className={styles.drawerWrapper}>
        <div className={styles.locationWrapper}>
          <div className={styles.title}>매장 검색</div>
          <div className={styles.btnWrapper}>
            <button className={styles.disBtnOne}>1km</button>
            <button className={styles.disBtnTwo}>3km</button>
            <button className={styles.disBtnThree}>5km</button>
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
            <select name="" id="">
              <option>구매 횟수</option>
              <option>평점</option>
            </select>
          </div>
          <div className={styles.productListWrapper}>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
          </div>
        </div>
        <div className={styles.storeWrapper}>
          <div className={styles.storeListWrapper}>
            <li>12</li>
            <li>123</li>
            <li>213</li>
            <li>312</li>
            <li>132</li>
            <li>312</li>
            <li>312</li>
            <li>132</li>
            <li>132</li>
            <li>12</li>
            <li>123</li>
            <li>213</li>
            <li>312</li>
            <li>132</li>
            <li>312</li>
            <li>312</li>
            <li>132</li>
            <li>132</li>
            <li>12</li>
            <li>123</li>
            <li>213</li>
            <li>312</li>
            <li>132</li>
            <li>312</li>
            <li>312</li>
            <li>132</li>
            <li>132</li>
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
