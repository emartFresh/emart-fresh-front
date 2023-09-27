import axios from "axios";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { GetUserAllInfo, IsLogIn } from "../../utils/LoginUtils";
import { sendAxiosPostRequest } from "../../utils/userUtils";

import styles from "../page_css/ProductDetail.module.css";
import ProductReview from "./ProductReview";
import { sendAxiosGetRequest } from "../../utils/userUtils";
/*
public class AddToCartDto {
	int storeId;
	String productName;
	int requestQuantity;
}

*/

interface AddToCartDto {
  storeId: number;
  productName: string;
  requestQuantity: number;
}

export default function ProductDetail() {
  const [productData, setProductData] = useState<ProductData>();
  const [quantity, setQuantity] = useState<number>(1);
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  console.log("로그인 토큰", loginToken);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("product-id");
  const storeId: string | null = queryParams.get("store-id");

  console.log("디테일");
  console.log("유저인포", GetUserAllInfo());
  console.log("로그인 함 ", IsLogIn());

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACK_PORT
        }/product/product-detail?productId=${productId}`
      )
      .then((res) => {
        console.log(res.data);
        setProductData(res.data);
      });
  }, []);

  //setInterval 29분마다 localstorage에 토큰 있는지 검사
  //있으면 ? 새토큰 갈아끼우고
  //없으면 ? 로그아웃한 거니까 setInterval중지

  const handleTest = async () => {
    await sendAxiosGetRequest(
      `${import.meta.env.VITE_BACK_PORT}/review/hello`,
      loginToken,
      setLoginToken
    );
  };

  const handleTest2 = async () => {
    await sendAxiosGetRequest(
      `${import.meta.env.VITE_BACK_PORT}/review/hello2`,
      loginToken,
      setLoginToken,
      {
        name: "정진성",
        age: "27",
      }
    );
  };

  const handleQuantityDown = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
    }
  };

  const handleQuantityUp = () => {
    if (quantity < 100) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
    }
  };

  const handleCartInsert = () => {
    const data: AddToCartDto = {
      storeId: Number(storeId),
      productName: productData.productTitle,
      requestQuantity: quantity,
    };

    const url = `${import.meta.env.VITE_BACK_PORT}/cart/addToCart`;
    sendAxiosPostRequest(url, loginToken, setLoginToken, data).then((res) => {
      console.log("응답 완료", res);
      alert("장바구니 담기!");
    });
  };

  return (
    <div className={styles.productDetailContainer}>
      <div className={styles.itemContainer}>
        <img
          className={styles.itemImage}
          src={productData?.productImgUrl}
          alt="no image"
        />
        <div className={styles.contentSection}>
          <div>{productData?.productTitle}</div>
          <div className={styles.itemLine}></div>
          <div>{productData?.priceString}</div>
          <div className={styles.itemLine}></div>
          <div>
            이벤트 여부:
            {/*  수정 : 이벤트 이쁘게 보여주기 */}
            <div>{productData?.productEvent}</div>
          </div>
        </div>
      </div>
      {storeId && (
        <div>
          <div>
            <button onClick={handleQuantityDown}>-</button>
            <input className={styles.priceInput} type="text" value={quantity} />
            <button onClick={handleQuantityUp}>+</button>
          </div>

          {GetUserAllInfo() ? (
            <button onClick={handleCartInsert}>장바구니 담기</button>
          ) : (
            <button disabled>장바구니 담기</button>
          )}
        </div>
      )}
      {productId && productData?.productTitle && (
        <ProductReview productTitle={productData?.productTitle} />
      )}

      <button onClick={handleTest}>테스트</button>
      <button onClick={handleTest2}>테스트2</button>
    </div>
  );
}
