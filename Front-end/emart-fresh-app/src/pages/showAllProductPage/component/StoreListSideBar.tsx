/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";

import styles from "../../page_css/StoreListSideBar.module.css";
import { userLocation, setUserLoaction } from "../../../../modules/location";
import { getUserLocation } from "../../../utils/userUtils";
import { Link } from "react-router-dom";

interface StoreListSideBarProps {
  setSelectedItem: React.Dispatch<React.SetStateAction<string[]>>;
  selectedItem: string[];
}

interface SearchedStoreData {
  memberId: string | null;
  storeAddress: number;
  storeId: number;
  storeLatitude: number;
  storeLongitude: number;
  storeName: string;
}

export default function StoreListSideBar({
  selectedItem,
  setSelectedItem,
}: StoreListSideBarProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isXClicked, setIsXClied] = useState<boolean>(true);
  const [choosedDis, setChoosedDis] = useState<number>(1);
  const [searchedStoreList, setSearchedStoreList] = useState<
    SearchedStoreData[]
  >([]);

  const handleItemDelete = (e) => {
    if (selectedItem.includes(e.target.name)) {
      const updatedSelectedItems = selectedItem.filter(
        (item) => item !== e.target.name
      );
      setSelectedItem(updatedSelectedItems);
    }
  };

  const handleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleXClick = () => {
    setIsXClied(!isXClicked);
  };

  const handleSerachBtn = () => {
    if (selectedItem.length <= 0) {
      //수정 : 상품을 선택해주세요! 상단에 띄우기
      return;
    }
    setSearchedStoreList([]);
    getUserLocation().then((userLocation: userLocation) => {
      const params = {
        productNames: selectedItem, // 수정 : 실제 데이터로 수정
        maxDis: choosedDis,
        userLatitude: userLocation.latitude,
        userLongitude: userLocation.longitude,
      };
      console.log("파람", params);
      axios
        .post(`${import.meta.env.VITE_BACK_PORT}/store/get-store-witnin-n`, params)
        .then((res) => {
          console.log("넘겨받은 데이터", res);
          setSearchedStoreList(res.data);
        });
    });
  };

  console.log("afdsfs", choosedDis);
  return isXClicked ? (
    <div className={styles.sidebarContainer}>
      <div style={{ width: "100%", textAlign: "right" }}>
        <button onClick={handleXClick} className={styles.defaultBtn}>
          ☒
        </button>
      </div>
      <div>해당 상품이 있는 점포</div>
      <div style={{ color: "gray" }}>{selectedItem.length}개 선택</div>
      {isVisible ? (
        <button className={styles.defaultBtn} onClick={handleVisibility}>
          △
        </button>
      ) : (
        <button className={styles.defaultBtn} onClick={handleVisibility}>
          ▽
        </button>
      )}

      {isVisible && (
        <>
          <section className={styles.itemNamesSection}>
            {selectedItem.map((item) => {
              return (
                <span className={styles.itemNameSection}>
                  {item}
                  <button
                    className={styles.itemDeleteBtn}
                    name={item}
                    onClick={(e) => {
                      handleItemDelete(e);
                    }}
                  >
                    x
                  </button>
                </span>
              );
            })}
          </section>
          <span className={styles.listLine} />
          <select
            value={choosedDis}
            onChange={(e) => {
              setChoosedDis(parseInt(e.target.value));
            }}
            name=""
            id=""
            className={styles.eventSelectTag}
          >
            <option value="1">1km 이내</option>
            <option value="3">3km이내</option>
            <option value="5">5km 이내</option>
          </select>
          <button onClick={handleSerachBtn}>찾기</button>
          {searchedStoreList.map((storeData: SearchedStoreData) => {
            const url = `/storeproduct?storeid=${storeData.storeId}`;
            return <Link to={url}>{storeData.storeName}</Link>;
          })}
        </>
      )}
    </div>
  ) : (
    <div className={styles.sidebarContainerClosed}>
      <button className={styles.defaultBtn} onClick={handleXClick}>
        {" "}
        점포 찾기
      </button>
      <div style={{ color: "gray" }}>{selectedItem.length}개 선택</div>
    </div>
  );
}
