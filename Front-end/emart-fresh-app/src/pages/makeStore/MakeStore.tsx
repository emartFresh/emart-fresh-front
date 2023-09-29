import { useState, useRef, useEffect } from "react";
import styles from "../page_css/MakeStore.module.css";
import { Modal, Box } from "@mui/material";
import magnifier from "../../assets/images/magnifier.svg";
import UserInfoSide from "./UserInfoSide";
interface searchedKakoData {
  road_address_name: string;
  place_name: string;
  latitude: number;
  longitude: number;
}

declare global {
  interface Window {
    kakao: any;
  }
}

interface mapOption {
  center: any;
  level: number;
}

export default function MakeStore() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [storeDatas, setStoreDatas] = useState<searchedKakoData[]>([]);
  const [selectedStore, setSelectedStore] = useState<searchedKakoData>();
  const [confirmedStore, setConfirmedStore] = useState<searchedKakoData>();

  const mapRef = useRef(null);

  //지도 띄우기
  useEffect(() => {
    if (selectedStore) {
      const mapOption: mapOption = {
        center: new window.kakao.maps.LatLng(
          selectedStore.latitude,
          selectedStore.longitude
        ), //지도의 중심좌표.
        level: 3,
      };

      console.log("위도", selectedStore.latitude);
      console.log("맵옵션", mapOption);

      const map = new window.kakao.maps.Map(mapRef.current, mapOption);
      const places = new window.kakao.maps.services.Places();
      map.setLevel(2);
      places.setMap(map, selectedStore);
    }
    // setMarker(map, selectedStore);
  }, [confirmedStore]);

  //수정
  //   const setMarker = (map, selectedStore: searchedKakoData) => {
  //     let clusterer = new window.kakao.maps.MarkerClusterer({
  //       map: map,
  //       markers: [],
  //       gridSize: 35,
  //       averageCenter: true,
  //       minLevel: 6,
  //       disableClickZoom: true,
  //       styles: [
  //         {
  //           width: "53px",
  //           height: "52px",
  //           background: "url(cluster.png) no-repeat",
  //           color: "#fff",
  //           textAlign: "center",
  //           lineHeight: "54px",
  //         },
  //       ],
  //     });

  //     const marker = new window.kakao.maps.Marker({
  //       position: new window.kakao.maps.LatLng(
  //         selectedStore.latitude,
  //         selectedStore.longitude
  //       ),
  //     });

  //     map.setCenter(
  //       new window.kakao.maps.LatLng(
  //         selectedStore.latitude,
  //         selectedStore.longitude
  //       )
  //     );
  //     clusterer.addMarker(marker);
  //   };

  const searchMart = () => {
    const places = new window.kakao.maps.services.Places();
    const callback = function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        console.log("리설트", result);
        let newSotreDatas: searchedKakoData[] = [];
        for (const data of result) {
          console.log("반복");
          const storeData: searchedKakoData = {
            road_address_name: data.road_address_name,
            place_name: data.place_name,
            latitude: Number(data.y),
            longitude: Number(data.x),
          };
          newSotreDatas = [...newSotreDatas, storeData];
        }
        setStoreDatas(newSotreDatas);
      }
    };

    places.keywordSearch(inputValue, callback);
  };

  return (
    <div className={styles.makeStoreContainer}>
      <div className={styles.contentWrapper}>
        <UserInfoSide />
        <div className={styles.mapWrapper}>
          <div
            className={styles.mapContainer}
            ref={mapRef}
            id="map"
            style={{ width: "500px", height: "300px" }}
          ></div>

          <div className={styles.storeInfo}>
            <span>점포명</span>
            <span>{confirmedStore?.place_name}</span>
          </div>
          <div className={styles.storeInfo}>
            <span>도로명 주소</span>
            <span>{confirmedStore?.road_address_name}</span>
          </div>
          <button
            onClick={() => {
              setShowModal(!showModal);
            }}
          >
            매장 찾기
          </button>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(!showModal);
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className={styles.modalContainer}>
            <div>
              <input
                className={styles.makerMartinput}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                type="text"
              />{" "}
              <button onClick={searchMart}>
                <img src={magnifier} alt="" />
                검색
              </button>
            </div>
            <div>{selectedStore?.place_name}</div>
            <div className={styles.scrollView}>
              {storeDatas.map((ele, inx) => {
                return (
                  <div key={inx}>
                    {ele.place_name}
                    <button
                      className={styles.selectBtn}
                      onClick={() => setSelectedStore(ele)}
                    >
                      선택
                    </button>
                  </div>
                );
              })}
            </div>
            <div>
              <button
                className={styles.cancleBtn}
                onClick={() => {
                  setShowModal(!showModal);
                }}
              >
                닫기
              </button>
              <button
                className={styles.cofirmBtn}
                onClick={() => {
                  setShowModal(!showModal);
                  setConfirmedStore(selectedStore);
                }}
              >
                확인
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
