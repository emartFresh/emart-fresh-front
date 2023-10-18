import { getUserLocation } from "../../utils/userUtils";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "../page_css/SearchStore.module.css";
import MapDrawer from "./MapDrawer";

interface mapOption {
  center: any;
  level: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface StoreDataMap extends Location {
  road_address_name: string;
  place_name: string;
}

export default function SearchStore() {
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 37.57986,
    longitude: 126.97711,
  });
  const [storeData, setStoreData] = useState<StoreData[]>();
  const [selectedDistance, setSelectedDistance] = useState<number>(5);

  useEffect(() => {
    getUserLocation()
      .then((res) => {
        setUserLocation(res);
      })
      .catch((err) => {
        toast.error("위치 정보를 허용해주세요.", {
          position: "top-center",
          autoClose: 1000,
        });
      });
  }, []);

  const mapRef = useRef(null);

  const setCircle = (map, userLocation: Location) => {
    const circle = new window.kakao.maps.Circle({
      center: new window.kakao.maps.LatLng(
        userLocation.latitude,
        userLocation.longitude
      ), // 원의 중심좌표 입니다
      radius: selectedDistance * 1000, // 미터 단위의 원의 반지름입니다
      strokeWeight: 5, // 선의 두께입니다
      strokeColor: "#75B8FA", // 선의 색깔입니다
      strokeOpacity: 10, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "dashed", // 선의 스타일 입니다
      fillColor: "#CFE7FF", // 채우기 색깔입니다
      fillOpacity: 0, // 채우기 불투명도 입니다
    });

    circle.setMap(map);
  };
  const setMarker = (map) => {
    console.log("스토어 데이터", storeData);

    const positions = storeData?.map((ele) => {
      return {
        title: ele.storeName,
        latlng: new window.kakao.maps.LatLng(
          ele.storeLatitude,
          ele.storeLongitude
        ),
      };
    });
    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    console.log("포지션", positions);

    for (let i = 0; i < positions?.length; i++) {
      const imageSize = new window.kakao.maps.Size(24, 35);
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize
      );
      const marker = new window.kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: positions[i].latlng, // 마커를 표시할 위치
        title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });

      marker.setMap(map);
    }
  };

  useEffect(() => {
    const mapOption: mapOption = {
      center: new window.kakao.maps.LatLng(
        userLocation?.latitude,
        userLocation?.longitude
      ), //지도의 중심좌표.
      level: 7,
    };

    const map = new window.kakao.maps.Map(mapRef.current, mapOption);
    //const places = new window.kakao.maps.services.Places();
    //map.setLevel(13);
    // places.setMap(map, selectedStore);
    setCircle(map, {
      latitude: userLocation.latitude,
      longitude: userLocation?.longitude,
    });
    setMarker(map);
  }, [userLocation, storeData]);

  return (
    <div className={styles.searchStoreContainer}>
      <div className={styles.mapContainer} ref={mapRef} id="map" />
      <MapDrawer
        userLocation={userLocation}
        storeData={storeData}
        setStoreData={setStoreData}
        selectedDistance={selectedDistance}
        setSelectedDistance={setSelectedDistance}
      />
    </div>
  );
}
