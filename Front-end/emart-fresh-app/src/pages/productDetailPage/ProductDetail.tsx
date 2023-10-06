import axios from "axios";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { GetUserAllInfo, IsLogin } from "../../utils/LoginUtils";
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
  console.log("로그인 함 ", IsLogin());

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

  function Price() {
    const originalPrice: number = Number(productData?.priceString);
    if (productData?.productEvent != null || productData?.productEvent !== 0) {
      const discountRate: number = productData?.productEvent;
      const discountedPrice =
        originalPrice - (originalPrice * discountRate) / 100;
      return (
        <div className={styles.priceContainer}>
          <div>
            <span className={styles.discountedPrice}>{originalPrice}</span>
            <span>{discountRate}%</span>
          </div>
          <div className={styles.productPrice}>{discountedPrice}</div>
        </div>
      );
    }
    return <div>{originalPrice}</div>;
  }

  return (
    <div className={styles.productDetailContainer}>
      <div className={styles.itemContainer}>
        <img
          className={styles.itemImage}
          src={productData?.productImgUrl}
          alt="no image"
        />
        <div className={styles.contentSection}>
          <div className={styles.productTitle}>{productData?.productTitle}</div>
          <div className={styles.itemLine}></div>
          {Price()}
          <div className={styles.itemLine}></div>
        </div>
      </div>
      {storeId && (
        <div className={styles.cartWrapper}>
          <div className={styles.buttonWrapper}>
            <button className={styles.downBtn} onClick={handleQuantityDown}>
              -
            </button>
            <input className={styles.qttInput} type="text" value={quantity} />
            <button className={styles.upBtn} onClick={handleQuantityUp}>
              +
            </button>
          </div>

          {GetUserAllInfo() ? (
            <button className={styles.toCartBtn} onClick={handleCartInsert}>
              장바구니 담기
            </button>
          ) : (
            <button className={styles.toCartBtn} disabled>
              장바구니 담기
            </button>
          )}
        </div>
      )}
      {productId && productData?.productTitle && (
        <ProductReview productTitle={productData?.productTitle} />
      )}
    </div>
  );
}
