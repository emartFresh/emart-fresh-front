/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";

import axios from "axios";
import styles from "../page_css/OrderRequest.module.css";

//수정 : 인증 인가, 유통기한 처리
//수정 : 전역 날짜 데이터 to String 처리 함수 추가해서 리팩토링

interface QuantityData {
  productId: number;
  quantity: number;
}

export default function OrderRequest() {
  const [selectedProducts, setSelectedProducts] = useState<ProductData[]>([]);
  const [belowProductList, setBelowProductList] = useState<ProductData[]>([]);
  const [quantityMap, setQuantityMap] = useState<{
    [productId: number]: number;
  }>({});
  const navigate = useNavigate();
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [quantityData, setQuantityData] = useState<QuantityData[]>([]);

  const fetchProductData = async () => {
    let resultData: ProductData | [] = [];

    // 수정 : 작동하도록
    // useEffect(() => {
    //   console.log("우이ㅣㅇ", isValidMemberToken(loginToken));
    // }, []);

    await axios
      .get(`${import.meta.env.VITE_BACK_PORT}/product/all-product-list`)
      .then((res) => {
        resultData = res.data;
        console.log("결과 데이터", resultData);
        if (res.data === "success") {
          navigate("/");
        }
      });

    return resultData;
  };

  const productData = useQuery(["products"], fetchProductData, {
    staleTime: 100000,
  });

  const handleCheckboxChange = (product: ProductData) => {
    if (selectedProducts.some((p) => p.productId === product.productId)) {
      // 이미 선택된 상태라면 선택 해제
      setSelectedProducts(
        selectedProducts.filter((p) => p.productId !== product.productId)
      );
    } else {
      // 선택되지 않은 상태라면 선택 추가
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleQuanInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    product: ProductData
  ) => {
    const newQuantityMap = {
      ...quantityMap,
      [product.productId]: parseInt(event.target.value) || 0,
    };

    const productId = product.productId;
    const newQuantity = parseInt(event.target.value);

    const existingIndex = quantityData.findIndex(
      (item) => item.productId === productId
    );

    if (existingIndex !== -1) {
      // 이미 해당 productId가 존재하는 경우 업데이트
      const updatedQuantityData = quantityData.map((item, index) =>
        index === existingIndex ? { ...item, quantity: newQuantity } : item
      );
      setQuantityData(updatedQuantityData);
    } else {
      // 해당 productId가 없는 경우 추가
      const newQuantityData = [
        ...quantityData,
        {
          productId: productId,
          quantity: newQuantity,
        },
      ];
      setQuantityData(newQuantityData);
    }
    setQuantityMap(newQuantityMap);
  };

  const insertToBelow = () => {
    setBelowProductList([...selectedProducts]);
  };

  const handleOrderBtn = async () => {
    let sendingData: ManagerOrderData[] = [];
    sendingData = quantityData.map((data) => ({
      productId: data.productId,
      storeId: 1, // 수정: 실제 가게 아이디로 변경
      managerOrderStatus: false,
      managerOrderQuantity: data.quantity,
      managerOrderDate: new Date(),
    }));
    console.log("실행");
    console.log("ㄷ이터", sendingData);
    await axios
      .post(
        `${import.meta.env.VITE_BACK_PORT}/order/add-manager-order`,
        sendingData
      )
      .then((res) => {
        console.log(res);
        if (res.data === "success") {
          navigate("/");
          //수정 : 플래쉬 메시지 띄우기
        }
      });
  };

  const productListEle: JSX.Element[] | undefined = productData.data?.map(
    (product: ProductData, index: number) => {
      console.log("데이터 하나", product);
      return (
        <div key={index} className={styles.productListSection}>
          <div>
            <span>{product.productTitle}</span>
            <span style={{ marginLeft: "1em" }}>{product.priceString}</span>
            <span style={{ marginLeft: "1em" }}>
              {String(product.productExpirationDate)}
            </span>
          </div>
          <input
            type="checkbox"
            checked={selectedProducts.some(
              (p) => p.productId === product.productId
            )}
            onChange={() => handleCheckboxChange(product)}
          />
        </div>
      );
    }
  );

  const belowProducts: JSX.Element[] | undefined = belowProductList?.map(
    (product: ProductData, index: number) => {
      return (
        <div key={index} className={styles.productListSection}>
          <div>
            <span>{product.productTitle}</span>
            <span style={{ marginLeft: "1em" }}>{product.priceString}</span>
            <span style={{ marginLeft: "1em" }}></span>
          </div>
          <input
            type="text"
            onChange={(event) => handleQuanInputChange(event, product)}
            style={{ width: "5em" }}
            value={quantityMap[product.productId] || ""}
          />
        </div>
      );
    }
  );

  console.log("수량", quantityMap);
  console.log("수량2", quantityData);
  return (
    <>
      <div className={styles.productListWrapper}>{productListEle}</div>
      <button onClick={insertToBelow}>버튼</button>
      <div className={styles.productListWrapper}>{belowProducts}</div>
      <button onClick={handleOrderBtn}>주문하기</button>
    </>
  );
}
