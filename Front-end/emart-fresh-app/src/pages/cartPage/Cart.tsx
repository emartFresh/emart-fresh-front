/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import styles from "../page_css/Cart.module.css";
import image from "../../assets/images/product013.png";
import axios from "axios";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { Checkbox } from "@mui/material";
import { sendAxiosRequest } from "../../utils/userUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import cartNull from "../../assets/images/cartNull.png";
import cartCalcNull from "../../assets/images/cartCalcNull.png";
import Payment from "../paymentPage/Payment";


interface responseData {
  data: CartData[];
}

// 수정 : 수량 변경 시  0이하/ 99이상 안됨.
// 수정 : 장바구니 item 개수 nav 
// unmount : 수량 저장

const Cart = () => {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [cartItemList, setCartItemList] = useState<CartData[]>([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentItems, setPaymentItems] = useState<CartData[]>([]);
  const [openPayment, setOpenPayment] = useState<boolean>(false);
  let payItemsInfo: CartData[] = [];

  useEffect(() => {
    sendAxiosRequest(
      "/cart/getCartInfo",
      "get",
      loginToken,
      setLoginToken
    ).then((response) => {
      console.log("response > ", response);
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
        const translateY = scrollY * 0.2;

        if (translateY + sidebarHeight < contentHeight) {
          cartCalculate.style.transform = `translateY(${translateY}px)`;
        }
      }
    });
    return () => {
      console.log("장바구니 업데이터 API");
      // 수정 : 컴포넌트가 언마운트될 때 이벤트 리스너 정리
      window.removeEventListener("scroll", () => {});
    };
  
  }, []);

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
    const newValue = value;
    const isValidInput = /^[1-9]\d*$/.test(newValue);


    // 수정 : 터짐
    if (newValue.length === 0) {
      // alert('수량을 입력해주세요. (임시 알림)');
      setCartItemList(
        cartItemList.map((item) => {
          if (item.cartProductId === cartProductId) {
            return { ...item, cartProductQuantity: parseInt('1') };
          }
        })
      )
    }

    if (isValidInput) {
      setCartItemList(
        cartItemList.map((item) => {
          if (item.cartProductId === cartProductId) {
            return { ...item, cartProductQuantity: parseInt(value) };
          } else {
            return item;
          }
        })
      );
    }
  };

  const handleCheckboxChange = (cartProductId: number) => {

    let selectedList = [];
   
    if (selectedItems.includes(cartProductId)) {
      selectedList = selectedItems.filter((item) => item !== cartProductId);
      
    } else {
      selectedList =[...selectedItems, cartProductId];
      
    }
    setSelectedItems(selectedList);
    settingPaymentItems(selectedList);
  };


  const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const cartProductIdList = cartItemList.map(
        (cartItem) => cartItem.cartProductId
      );
      setSelectedItems(cartProductIdList);
      settingPaymentItems(cartProductIdList);
    } else {
      setSelectedItems([]);
    }
  };

  const settingPaymentItems = (selectedList: number[]) => {
    if (selectedList.length > 0) {
      const newPaymentItems = selectedList.map((selectedItemId) => {
        const selectedItem = cartItemList.find(
          (item) => item.cartProductId === selectedItemId
        );
        return selectedItem;
      });
      setPaymentItems(newPaymentItems);      
    }
  }


  const deleteItem = (cartProductId: number) => {
    sendAxiosRequest(
      "/cart/removeProduct?cartProductId="+cartProductId,
      "delete",
      loginToken,
      setLoginToken,
      {cartProductId: cartProductId}
    )
    .then((res) => {
      setCartItemList(
        (prevList) => prevList.filter((item) => item.cartProductId !== cartProductId)
      )
    })
    .catch(console.error)
  }

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
        <input type='checkbox' id='allCheckBox' className={styles.allCheckBox} onChange={handleAllCheck} />
        <label htmlFor="allCheckBox" className={styles.allCheck}>전체 선택</label>
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
                  <FontAwesomeIcon icon={faXmark} className={styles.delItemMark} onClick={() => {deleteItem(item.cartProductId)}}/>
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
                      min="1"
                      step="1"
                      pattern="[1-9]\d*"
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
            <div className={styles.cartCalcNullWrap}>
              <img src={cartCalcNull} alt="" className={styles.cartCalcNull} />
            </div>
          )}

          {selectedItems.length > 0 && (
            <>
              <h4 className={styles.storeName}>센텀시티점</h4>
              {/* <h4>{storeName}<h4> */}
              {/* 수정 : 응답에 store name을 하나로 뭉쳐서 */}
              <div className={styles.payItemListInfo}>
                <p>제품명</p>
                <p>가격</p>
                <p>수량</p>
              </div>
              <ul className={styles.payItemListWrap}>
                {
                selectedItems.map((selectedItemId) => {
                  const selectedItem = cartItemList.find(
                    (item) => item.cartProductId === selectedItemId
                  );
                  totalPrice += selectedItem.priceNumber * selectedItem.cartProductQuantity; 
                  return (
                    <li key={selectedItemId} className={styles.payItemList}>
                      <p>{selectedItem.productTitle}</p>
                      <p>{selectedItem.priceNumber}원</p>
                      <p>{selectedItem.cartProductQuantity}개</p>
                      <FontAwesomeIcon icon={faXmark} className={styles.delPayItemList} onClick={() => handleCheckboxChange(selectedItem.cartProductId)}/>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          <div className={styles.payInfoWrap}>
            <p className={`${styles.extendedPrice} ${selectedItems.length === 0 && styles.hidden}`}>결제 금액 : {totalPrice} 원</p>
            <button
              className={styles.payBtn}
              disabled = {selectedItems.length === 0}
              onClick={() => setOpenPayment(true)}
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
      {openPayment && <Payment cartInfo={payItemsInfo = selectedItems.map((selectedItemId) => {
          const payItemInfo = cartItemList.find(
            (item) => item.cartProductId === selectedItemId
          );
          return (
            payItemInfo
          );
        })} />}
    </div>
  );
};

export default Cart;
