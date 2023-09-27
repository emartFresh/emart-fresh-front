/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import styles from "../page_css/Cart.module.css";
import image from "../../assets/images/product013.png";
import axios, { AxiosError } from "axios";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { Checkbox } from "@mui/material";
import { useState } from "react";
import { sendAxiosRequest } from "../../utils/userUtils";
import cartNull from "../../assets/images/cartNull.png";
import cartCalcNull from "../../assets/images/cartCalcNull.png";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Payment from "../paymentPage/Payment";

interface responseData {
  data: CartData[];
}

/*


*/

// 수정 : 수량 변경 시  0이하/ 99이상 안됨.
// 전체 선택
// 총 금액 계산
// 쿠폰 적용
// cartCalculate : div내부 스크롤 -> overflow scroll
// unmount : 수량 저장
// 제품 삭제 기능

const Cart = () => {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [cartItemList, setCartItemList] = useState<CartData[]>([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [extendedPrice, setExtendedPrice] = useState<number>(0);
  const [openPayment, setOpenPayment] = useState<boolean>(false);

  const handleQuantity = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    cartProductId: number
  ) => {
    const btn = e.target as HTMLButtonElement;
    const isMinusBtn = btn.id === "minusQuantity";

    setCartItemList(
      cartItemList.map((item) => {
        if (item.cartProductId === cartProductId) {
          return {
            ...item,
            cartProductQuantity: isMinusBtn
              ? item.cartProductQuantity - 1
              : item.cartProductQuantity + 1,
          };
        } else {
          return item;
        }
      })
    );
  };

  const handleInputQuantity = (value: string, cartProductId: number) => {
    setCartItemList(
      cartItemList.map((item) => {
        if (item.cartProductId === cartProductId) {
          return { ...item, cartProductQuantity: parseInt(value) };
        } else {
          return item;
        }
      })
    );
  };

  const handleCheckboxChange = (cartProductId: number) => {
    if (selectedItems.includes(cartProductId)) {
      // 만약 selectedItems에 cartProductId가 포함된다면 (이미 선택되었다면)
      setSelectedItems(selectedItems.filter((item) => item !== cartProductId));
      // selectedItems에 item의 cartProductId와, checkbox에서 넘어온 cartProductId를 비교해서 같지 않은 item만 selectItems에 담는다.
      console.log(selectedItems);
    } else {
      setSelectedItems([...selectedItems, cartProductId]);
      // 이미 선택되어있는 항목이 아니라면, selectedItems에 담음
    }
  };

  const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const cartProductIdList = cartItemList.map(
        (cartItem) => cartItem.cartProductId
      );
      setSelectedItems(cartProductIdList);
    } else {
      setSelectedItems([]);
    }
  };

  useEffect(() => {
    sendAxiosRequest(
      "/cart/getCartInfo",
      "get",
      loginToken,
      setLoginToken
    ).then((response) => {
      console.log("response > ", response);
      // 수정
      const res: CartData[] = JSON.parse(JSON.stringify(response));
      setCartItemList(res);
    });

    window.addEventListener("scroll", () => {
      const cartCalculate = document.querySelector(
        ".cartCalculate"
      ) as HTMLElement | null;
      const content = document.querySelector(".content") as HTMLElement | null;

      if (cartCalculate && content) {
        const scrollY = window.scrollY;
        const contentHeight = content.clientHeight;
        const sidebarHeight = cartCalculate.clientHeight;

        // 움직임을 느리게 하기 위해 scrollY 값을 조절
        const translateY = scrollY * 0.2; // 조절 가능 비율

        if (translateY + sidebarHeight < contentHeight) {
          cartCalculate.style.transform = `translateY(${translateY}px)`;
        }
      }
    });
    return () => {
      console.log("장바구니 업데이터 API");
      // 컴포넌트가 언마운트될 때 이벤트 리스너 정리

      window.removeEventListener("scroll", () => {});
    };
  }, []);

  let totalPrice = 0;

  return (
    <div>
      <h3
        className={styles.title}
        onClick={() => {
          console.log(cartItemList);
        }}
      >
        장바구니
      </h3>
      <div
        className={
          cartItemList.length === 0 ? styles.hiddenWrap : styles.allCheckWrap
        }
      >
        <Checkbox className={styles.allCheckBox} onChange={handleAllCheck} />
        <p className={styles.allCheck}>전체 선택</p>
      </div>
      <div className={styles.cartContainer}>
        <div
          className={
            cartItemList.length === 0
              ? styles.cartNullWrap
              : styles.cartProducts
          }
        >
          {cartItemList.length === 0 ? (
            <img src={cartNull} alt="" className={styles.cartNull} />
          ) : (
            cartItemList.map((item) => {
              return (
                <div className={styles.cartProduct} key={item.cartProductId}>
                  <Checkbox
                    className={styles.orderCheck}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    checked={selectedItems.includes(item.cartProductId)}
                    onChange={() => handleCheckboxChange(item.cartProductId)}
                  />
                  <img src={image} alt="" />
                  <p>{item.productTitle}</p>
                  <p>{item.priceNumber}</p>
                  <p className={styles.quantityControl}>
                    <input
                      type="button"
                      value="-"
                      id="minusQuantity"
                      className={styles.quantityBtn}
                      onClick={(e) => handleQuantity(e, item.cartProductId)}
                    />
                    {/* <RemoveIcon/> */}
                    <input
                      type="text"
                      value={item.cartProductQuantity}
                      className={styles.quantityInput}
                      onChange={(e) =>
                        handleInputQuantity(e.target.value, item.cartProductId)
                      }
                      minLength={1}
                      maxLength={2}
                      max={99}
                      min={1}
                    />
                    <input
                      type="button"
                      value="+"
                      id="plusQuantity"
                      className={styles.quantityBtn}
                      onClick={(e) => handleQuantity(e, item.cartProductId)}
                    />
                    {/* <AddIcon/> */}
                  </p>
                </div>
              );
            })
          )}
        </div>
        <div className={styles.cartCalculate}>
          {selectedItems.length === 0 && (
            <div>
              <img src={cartCalcNull} alt="" className={styles.cartCalcNull} />
            </div>
          )}

          {selectedItems.length > 0 && (
            <>
              <h4 className={styles.storeName}>센텀시티점</h4>
              {/* <h4>{storeName}<h4> */}
              <ul>
                {selectedItems.map((selectedItemId) => {
                  const selectedItem = cartItemList.find(
                    (item) => item.cartProductId === selectedItemId
                  );
                  console.log("selectedItems>", selectedItems);
                  console.log("cartItemList> ", cartItemList);
                  console.log("NO ", selectedItemId);

                  console.log("selectedItem>", selectedItem);
                  totalPrice +=
                    selectedItem.priceNumber * selectedItem.cartProductQuantity;
                  return (
                    <li key={selectedItemId}>
                      {selectedItem.productTitle} / 가격:{" "}
                      {selectedItem.priceNumber} / 수량:{" "}
                      {selectedItem.cartProductQuantity}
                    </li>
                  );
                })}
              </ul>
              <div>
                총금액 : <p>{totalPrice}원</p>
              </div>
            </>
          )}
          <button
            className={styles.payBtn}
            onClick={() => setOpenPayment(true)}
          >
            결제하기
          </button>
        </div>
      </div>
      {openPayment && <Payment cartInfo={cartItemList} />}
    </div>
  );
};

export default Cart;
