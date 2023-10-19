/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import styles from "../page_css/Cart.module.css";
import image from "../../assets/images/product013.png";
import axios from "axios";
import { useRecoilState } from "recoil";
import { cartItemCount, loginState } from "../../atoms";
import { Checkbox } from "@mui/material";
import { sendAxiosRequest } from "../../utils/userUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleMinus, faMinus, faMinusCircle, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import cartNull from "../../assets/images/cartNull.png";
import cartCalcNull from "../../assets/images/cartCalcNull.png";
import Payment from "../paymentPage/Payment";
import { useNavigate } from "react-router-dom";
import { useIsLogin } from "../../utils/LoginUtils";
import { getTruncateString } from "../../utils/formatUtils";

interface responseData {
  data: CartData[];
}

const Cart = () => {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [cartCount, setCartCount] = useRecoilState<number>(cartItemCount);
  const [cartItemList, setCartItemList] = useState<CartData[]>([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentItems, setPaymentItems] = useState<CartData[]>([]);
  const [openPayment, setOpenPayment] = useState<boolean>(false);
  const [initCartItemList, setInitCartItemList] = useState<CartData[]>([]);
  const [updateCartItemList, setUpdateCartItemList] = useState<Array<object>>([]);
  const navigate = useNavigate();
  const isLogined = useIsLogin();

  const updateListRef = useRef(updateCartItemList);
  const loginTokenRef = useRef(loginToken);
  let totalPrice = 0;
  let payItemsInfo: CartData[] = [];


  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  useEffect(() => {

    if(isLogined){
      sendAxiosRequest(
        "/cart/getCartInfo",
        "get",
        loginToken,
        setLoginToken,
        setCartCount
      )
      .then((response) => {
        console.log("response > ", response);
        const res: CartData[] = JSON.parse(JSON.stringify(response));
        setCartItemList(res?.map(item => {
          return {...item, cartProductQuantityOfString: item.cartProductQuantity+""}
        }));
        setInitCartItemList(res);
        setCartCount(res.length);
      })
      .catch(console.error);
    }

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
      console.log("cart unmount ac >>> ",loginTokenRef.current);
        sendAxiosRequest(
        "/cart/updateCartProductQuantity",
        "post",
        loginTokenRef.current,
        setLoginToken,
        setCartCount,
        updateListRef.current
      )
        .then((res) => console.log(res))
        .catch(console.error);

      window.removeEventListener("scroll", () => {});
    };
  }, []);

  useEffect(() => {
    updateListRef.current = handleUpdateItemList();
  }, [cartItemList]);

  useEffect(() => {
    loginTokenRef.current = loginToken;
  }, [loginToken.refreshToken])

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  const handleUpdateItemList = (): Array<object> => {
    if (initCartItemList)
      return cartItemList
        .filter((cart) => {
          const initItem = initCartItemList.find(
            (item) => item.cartProductId === cart.cartProductId
          );
        // cartProductQuantityOfString이 null 또는 빈 문자열("")이면 1로 설정
        // const quantity = cart.cartProductQuantityOfString === null || cart.cartProductQuantityOfString === "" ? 1 : parseInt(cart.cartProductQuantityOfString);
          return initItem.cartProductQuantity !== parseInt(cart.cartProductQuantityOfString);
        })
        ?.map((updateItem) => {
          return {
            cartProductId: updateItem.cartProductId,
            cartProductQuantity: updateItem.cartProductQuantityOfString === "" || updateItem.cartProductQuantityOfString === null ? 1 : parseInt(updateItem.cartProductQuantityOfString),
          };
        });
  };

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  const handleQuantity = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    cartProductId: number
  ) => {
    const btn = e.target as HTMLButtonElement;
    const isMinusBtn = btn.id === "minusQuantity";

    setCartItemList(
      cartItemList.map((item) => {
        if (item.cartProductId === cartProductId) {
          return {
            ...item,
            cartProductQuantityOfString: 
              isMinusBtn
              ? parseInt(item.cartProductQuantityOfString) - 1 + ""
              : parseInt(item.cartProductQuantityOfString) + 1 + "",

            cartProductQuantity: 
            isMinusBtn 
            ? parseInt(item.cartProductQuantityOfString) - 1
            : parseInt(item.cartProductQuantityOfString) + 1,
          };
        } else {
          return item;
        }
      })
    );
  };

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  const handleInputQuantity = (value: string, cartProductId: number) => {
    setCartItemList((prevCartItemList) => {
      return prevCartItemList.map((item) => {
        if (item.cartProductId === cartProductId) {
          const newValue = value;
          const isValidInput = /^[1-9]\d*$/.test(newValue);
  
          if (newValue.length === 0) {
            return { ...item, cartProductQuantityOfString: "",};
          }
  
          if (isValidInput) {
            return { ...item, cartProductQuantityOfString: value, cartProductQuantity: parseInt(value)};
          }
        }
        return item;
      });
    });
  };

  const handleEmptyInput = (value: string, cartProductId: number) => {
    if (value === "") {
      setCartItemList((prevCartItemList) => {
        return prevCartItemList.map((item) => {
          if (item.cartProductId === cartProductId) {
            return { ...item, cartProductQuantityOfString: "1", cartProductQuantity: 1 };
          }
          return item;
        });
      });
    }
  };

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  const handleCheckboxChange = (cartProductId: number) => {
    let selectedList = [];
    if (selectedItems.includes(cartProductId)) {
      selectedList = selectedItems.filter((item) => item !== cartProductId);
    } else {
      selectedList = [...selectedItems, cartProductId];
    }
    setSelectedItems(selectedList);
    settingPaymentItems(selectedList);
  };

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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
  };

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  const handleDeleteItem = (cartProductId: number) => {
    sendAxiosRequest(
      "/cart/removeProduct?cartProductId=" + cartProductId,
      "delete",
      loginToken,
      setLoginToken,
      setCartCount
    )
      .then((res) => {
        setCartItemList((prevList) =>
          prevList.filter((item) => item.cartProductId !== cartProductId)
        );
        setCartCount(cartCount - 1);  
      })
      .catch(console.error);
  };

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  console.log(cartItemList[0]?.storeName);



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
        <input
          type="checkbox"
          id="allCheckBox"
          className={styles.allCheckBox}
          onChange={handleAllCheck}
        />
        <label htmlFor="allCheckBox" className={styles.allCheck}>
          전체 선택
        </label>
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
                  <FontAwesomeIcon
                    icon={faXmark}
                    className={styles.delItemMark}
                    onClick={() => {
                      handleDeleteItem(item.cartProductId);
                    }}
                  />
                  <img src={item.productImgUrl} alt="product Image" className={styles.productImage} />
                  <p className={styles.productTitle}>{getTruncateString(item.productTitle, 35)}</p>
                  <p className={styles.productPrice}>{item.priceNumber}원</p>
                  <p className={styles.quantityControl}>
                    <FontAwesomeIcon 
                      icon={faMinus}
                      id="minusQuantity"
                      className={styles.quantityBtn}
                      onClick={(e) => handleQuantity(e, item.cartProductId)}
                    />
                    <input
                      type="text"
                      value={item.cartProductQuantityOfString}
                      className={styles.quantityInput}
                      onChange={(e) =>
                        handleInputQuantity(e.target.value, item.cartProductId)
                      }
                      onBlur={
                        (e) => handleEmptyInput(e.target.value, item.cartProductId)
                      }
                      minLength={1}
                      maxLength={2}
                      step="1"
                      pattern="[1-9]\d*"
                    />
                    <FontAwesomeIcon 
                      icon={faPlus}
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

        {selectedItems.length === 0 && (
          <div className={styles.cartCalculate}>
            <div className={styles.cartCalcNullWrap}>
              <img src={cartCalcNull} alt="" className={styles.cartCalcNull} />
            </div>
          </div>
        )}

        {selectedItems.length > 0 && (
          <div className={styles.cartCalculate}>
            <h4 className={styles.storeName}>{cartItemList[0]?.storeName}</h4>
            <div className={styles.payItemListInfo}>
              <p>제품명</p>
              <p>가격</p>
              <p>수량</p>
            </div>
            <ul className={styles.payItemListWrap}>
              {selectedItems.map((selectedItemId) => {
                const selectedItem = cartItemList.find(
                  (item) => item.cartProductId === selectedItemId
                );
                if(selectedItem.cartProductQuantityOfString === ''){
                  totalPrice === 0;
                }else{
                  totalPrice +=
                    selectedItem.priceNumber * parseInt(selectedItem.cartProductQuantityOfString);
                }
                return (
                  <li key={selectedItemId} className={styles.payItemList}>
                    <p>{getTruncateString(selectedItem.productTitle, 12)}</p>
                    <p>{selectedItem.priceNumber}원</p>
                    <p>{selectedItem.cartProductQuantityOfString}개</p>
                    <FontAwesomeIcon
                      icon={faXmark}
                      className={styles.delPayItemList}
                      onClick={() =>
                        handleCheckboxChange(selectedItem.cartProductId)
                      }
                    />
                  </li>

                );
              })}
            </ul>
            <div className={styles.payInfoWrap}>
              <p className={styles.extendedPrice}>
                결제 금액 : {totalPrice} 원
              </p>
              <button
                className={styles.payBtn}
                onClick={() => setOpenPayment(true)}
              >
                결제하기
              </button>
            </div>
          </div>
        )}

        {openPayment && (
          <Payment
            setOpenPayment={setOpenPayment}
            cartInfo={
              (payItemsInfo = selectedItems.map((selectedItemId) => {
                const payItemInfo = cartItemList.find(
                  (item) => item.cartProductId === selectedItemId
                );
                return payItemInfo;
              }))
            }
          />
        )}
      </div>
    </div>
  );
};

export default Cart;
