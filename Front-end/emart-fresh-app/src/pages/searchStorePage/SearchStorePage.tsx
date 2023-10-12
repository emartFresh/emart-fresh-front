import { getUserLocation } from "../../utils/userUtils";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "react-query";
import styles from "../page_css/SearchStore.module.css";
import axios from "axios";
import MapDrawer from "./MapDrawer";

interface mapOption {
  center: any;
  level: number;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface StoreData extends Location {
  road_address_name: string;
  place_name: string;
}

export default function SearchStore() {
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 35.165823,
    longitude: 129.132308,
  });
  const [storeData, setStoreData] = useState<StoreData>();

  const fetchStoreData = async () => {
    let resultData: StoreData | [] = [];
    await axios
      .get(`${import.meta.env.VITE_BACK_PORT}/store/all-product-list`) //수정 실제값
      .then((res) => {
        resultData = res.data;
        console.log("결과 데이터", resultData);
      });

    return resultData;
  };
  //   const productData = useQuery(["nearStoreData"], fetchStoreData, {
  //     staleTime: 100000,
  //   });

  useEffect(() => {
    getUserLocation()
      .then((res) => {
        setUserLocation(res);
      })
      .catch((err) => {
        console.log("유저 위치 정보 획득 X", err);
      });
  }, []);

  const mapRef = useRef(null);
  useEffect(() => {
    const mapOption: mapOption = {
      center: new window.kakao.maps.LatLng(
        userLocation?.latitude,
        userLocation?.longitude
      ), //지도의 중심좌표.
      level: 3,
    };

    const map = new window.kakao.maps.Map(mapRef.current, mapOption);
    const places = new window.kakao.maps.services.Places();
    //   map.setLevel(2);
    //   places.setMap(map, selectedStore);
    //   setMarker(map, selectedStore);
  }, [userLocation]);

  return (
    <div className={styles.searchStoreContainer}>
      <div className={styles.mapContainer} ref={mapRef} id="map" />
      <MapDrawer />
    </div>
  );
}
