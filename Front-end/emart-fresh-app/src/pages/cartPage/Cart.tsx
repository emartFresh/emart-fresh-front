/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react'
import styles from '../page_css/Cart.module.css'
import image from '../../assets/images/product013.png'
import axios, { AxiosError } from 'axios';
import { useRecoilState } from 'recoil';
import { loginState } from '../../atoms';
import { Checkbox } from '@mui/material';
import { useState } from 'react';
import { sendAxiosRequest } from '../../utils/userUtils';

interface responseData {
  data: CartData[];
}

const Cart = () => {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [cartItemList, setCartItemList] = useState<CartData[]>([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleQuantity = (e: React.MouseEvent<HTMLInputElement, MouseEvent>, cartProductId:number) => {
    const btn = e.target as HTMLButtonElement;
    const isMinusBtn = btn.id==='minusQuantity';

    setCartItemList(
      cartItemList.map((item) => {
        if (item.cartProductId === cartProductId) {
          return { ...item, cartProductQuantity: isMinusBtn ? item.cartProductQuantity - 1 : item.cartProductQuantity + 1 }
        } else {
          return item
        }
      })
    )
  }

  const handleInputQuantity = (value:string, cartProductId:number) => {
    cartItemList.map((item) => {
      if (item.cartProductId === cartProductId) {
        return { ...item, cartProductQuantity: parseInt(value)}
      } else {
        return item
      }
    })
  }

  const handleCheckboxChange = (cartProductId:number) => {
    if (selectedItems.includes(cartProductId)) { // 만약 selectedItems에 cartProductId가 포함된다면 (이미 선택되었다면)
      setSelectedItems(selectedItems.filter((item) => item !== cartProductId)); 
      // selectedItems에 item의 cartProductId와, checkbox에서 넘어온 cartProductId를 비교해서 같지 않은 item만 selectItems에 담는다.
    } else {
      setSelectedItems([...selectedItems, cartProductId]);
      // 이미 선택되어있는 항목이 아니라면, selectedItems에 담음
    }
  };

  useEffect(() => {
    sendAxiosRequest('/cart/getCartInfo', 'get', loginToken, setLoginToken)
    .then((response) => {
      console.log('response > ', response);
      // 수정 
      const res: CartData[] = JSON.parse(
        JSON.stringify(response)
      );
      setCartItemList(res);
    })


    window.addEventListener('scroll', () => {
      const cartCalculate = document.querySelector('.cartCalculate') as HTMLElement | null;
      const content = document.querySelector('.content') as HTMLElement | null;

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
    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
      window.removeEventListener('scroll', () => {});
    };
  })
  }, []);


  return (
    <div>
      <h3 className={styles.title} onClick={()=>{console.log(cartItemList)}}>장바구니</h3>
      <div className={styles.test}>
        <Checkbox className={styles.allCheckBox}/>
        <p className={styles.allCheck}>전체 선택</p>
      </div>
      <div className={styles.cartContainer}>
        <div className={styles.cartProducts}>          
          {
            cartItemList.map((item) => {
              return(
                <div className={styles.cartProduct} key={item.cartProductId}>
                  <Checkbox
                    className={styles.orderCheck}
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                    checked={selectedItems.includes(item.cartProductId)}
                    onChange={() => handleCheckboxChange(item.cartProductId)}
                  />
                  <img src={image} alt="" />
                  <p>{item.productTitle}</p>
                  <p>{item.priceNumber}</p>
                  <p className={styles.quantityControl}>
                    <input type="button" value='-' id='minusQuantity' onClick={(e) => handleQuantity(e, item.cartProductId)}/>
                    <input type="text" value={item.cartProductQuantity} className={styles.quantity} onChange={(e) => handleInputQuantity(e.target.value, item.cartProductId)}/>
                    {/* 수정 : input 입력값으로도 변경될 수 있게 할건지 */}
                    <input type="button" value='+' id='plusQuantity'  onClick={(e) => handleQuantity(e, item.cartProductId)}/>
                    {/* <input type="button" value='확인'/> */}
                  </p>
               </div>
              )
            })
          }

        </div>
        <div className={styles.cartCalculate}>
          {
            selectedItems.length === 0 && (
              <div>
                <p>결제할 물품이 없습니다.</p>
              </div>
            )
          }
          
          {
            selectedItems.length > 0 && (
            <>
              <h4 className={styles.storeName}>센텀시티점</h4>
              {/* <h4>{storeName}<h4> */}
              <ul>
                {selectedItems.map((selectedItemId) => {
                  const selectedItem = cartItemList.find((item) => item.cartProductId === selectedItemId);
                  return (
                    <li key={selectedItemId}>
                      {selectedItem.productTitle} - 수량: {selectedItem.cartProductQuantity} - 가격: {selectedItem.priceNumber}
                    </li>
                  );
                })}
              </ul>
            </>
            )
          }
          <button className={styles.payBtn}>결제하기</button>
        </div>

      </div>
    </div>
  )
}

export default Cart