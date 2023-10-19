import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { cartItemCount, loginState } from "../../atoms";
import { GetUserAllInfo, IsLogin } from "../../utils/LoginUtils";
import {
  sendAxiosGetRequest,
  sendAxiosPostRequest,
} from "../../utils/userUtils";
import { toast } from "react-toastify";
import { Modal, Box } from "@mui/material";

import styles from "../page_css/ProductDetail.module.css";
import ProductReview from "./ProductReview";
import { formatCurrency } from "../../utils/formatUtils";
import StockCnt from "./StockCnt";
import ProductType from "./ProductType";
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cartCount, setCartCount] = useRecoilState<number>(cartItemCount);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("product-id");
  const storeId: string | null = queryParams.get("store-id");

  const isLogIn = IsLogin();

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACK_PORT
        }/product/product-detail?productId=${productId}`
      )
      .then((res) => {
        console.log("fsd", res.data);
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

  const updateMyCart = () => {
    const url = `${import.meta.env.VITE_BACK_PORT}/cart/myCartInfoCount`;
    sendAxiosGetRequest(url, loginToken, setLoginToken).then((res) => {
      setCartCount(res);
    });
  };

  const handleCartInsert = () => {
    const data: AddToCartDto = {
      storeId: Number(storeId),
      productName: productData.productTitle,
      requestQuantity: quantity,
    };

    if (isLogIn) {
      const url = `${import.meta.env.VITE_BACK_PORT}/cart/checkCart`;
      sendAxiosPostRequest(url, loginToken, setLoginToken, data)
        .then((res) => {
          console.log("응답 완료", res);
          if (res === "error:out of stock") {
            toast.error("물품의 재고가 모자랍니다.", {
              position: "top-center",
              autoClose: 1500,
            });
            return;
          }
          toast.success("물건을 장바구니에 담았습니다.", {
            position: "top-center",
            autoClose: 1500,
            icon: "✅",
          });
          updateMyCart();
        })
        .catch((e) => {
          console.log("응답 실패", e);

          if (e.response.status === 400) {
            setShowModal(true);
          }
        });
    } else {
      toast.warning("로그인을 해주세요!", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  const setNewCart_n_insert = () => {
    const data: AddToCartDto = {
      storeId: Number(storeId),
      productName: productData.productTitle,
      requestQuantity: quantity,
    };

    console.log("데이터22", data);
    const url = `${import.meta.env.VITE_BACK_PORT}/cart/changeCart/yes`;

    sendAxiosPostRequest(url, loginToken, setLoginToken, data).then((res) => {
      toast.success("물건을 장바구니에 담았습니다.", {
        position: "top-center",
        autoClose: 1500,
        icon: "✅",
      });
    });
  };

  function Price() {
    const originalPrice: number = Number(productData?.priceNumber);
    if (productData?.productEvent !== 0) {
      const discountRate: number = productData?.productEvent;
      const discountedPrice =
        originalPrice - (originalPrice * discountRate) / 100;
      return (
        <div className={styles.priceContainer}>
          <div>
            <span className={styles.discountedPrice}>
              {formatCurrency(originalPrice)}원
            </span>
            <span>{discountRate}%</span>
          </div>
          <div className={styles.productPrice}>
            {formatCurrency(discountedPrice)}원
          </div>
        </div>
      );
    }

    return (
      <div className={styles.productPrice}>
        {formatCurrency(originalPrice)}원
      </div>
    );
  }

  return (
    <div className={styles.productDetailContainer}>
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
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            pt: 2,
            pl: 2,
            pr: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 320,
          }}
        >
          <div className={styles.detailModalContainer}>
            <div className={styles.detailModalTitle}>
              장바구니에는 같은 가게의 메뉴만 담을 수 있습니다.
            </div>
            <div className={styles.oneLine}></div>
            <div className={styles.detailModalInfo}>
              선택한 메뉴를 장바구니에 담을 경우 이전에 담은 메뉴들은
              장바구니에서 삭제됩니다.
            </div>
            <div className={styles.btnWrapper}>
              <button
                className={styles.cancleBtn}
                onClick={() => {
                  setShowModal(!showModal);
                }}
              >
                취소
              </button>
              <button
                className={styles.cofirmBtn}
                onClick={() => {
                  setShowModal(!showModal);
                  setNewCart_n_insert();
                }}
              >
                담기
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      <div className={styles.itemContainer}>
        <img
          className={styles.itemImage}
          src={productData?.productImgUrl}
          alt="no image"
        />
        <div className={styles.contentSection}>
          <ProductType productType={productData?.productType} />

          <div className={styles.productTitle}>{productData?.productTitle}</div>
          <div className={styles.itemLine}></div>
          {Price()}
          <div className={styles.itemLine}></div>
          {storeId && (
            <StockCnt
              storeId={storeId}
              productTitle={productData?.productTitle}
            />
          )}
        </div>
      </div>
      {storeId && (
        <div className={styles.cartWrapper}>
          <div className={styles.buttonWrapper}>
            <button className={styles.downBtn} onClick={handleQuantityDown}>
              -
            </button>
            <input
              onChange={(e) => {
                setQuantity(Number(e.target.value));
              }}
              className={styles.qttInput}
              type="text"
              value={quantity}
            />
            <button className={styles.upBtn} onClick={handleQuantityUp}>
              +
            </button>
          </div>

          {GetUserAllInfo() ? (
            <button className={styles.toCartBtn} onClick={handleCartInsert}>
              장바구니 담기
            </button>
          ) : (
            <button
              className={styles.toCartBtnNotLogin}
              onClick={handleCartInsert}
            >
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
