import { useEffect, useState } from "react";
import styles from "../page_css/ManagerOrderStatus.module.css";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { sendAxiosGetRequest } from "../../utils/userUtils";

export default function ManagerOrderStatus() {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [orderData, setOrderData] = useState<ManagerOrderDataWithObj[]>([]);

  useEffect(() => {
    const storeUrl = `${import.meta.env.VITE_BACK_PORT}/order/show-my-orders`;
    sendAxiosGetRequest(storeUrl, loginToken, setLoginToken).then((res) => {
      console.log("데이터", res);
      setOrderData(res);
    });
  }, []);

  console.log("이이이", orderData);

  const orderList = orderData.map((ele, inx) => {
    return (
      <div className={styles.statusWrapper} key={inx}>
        <div>
          <div className={styles.productName}>{ele.product.productTitle}</div>
          <div>{ele.product.priceString}</div>
          <div>주문 수량 : {ele.managerOrderQuantity}</div>
        </div>
        <div>
          {ele.managerOrderStatus ? (
            <span className={styles.ok}>승인</span>
          ) : (
            <span className={styles.no}>대기</span>
          )}
        </div>
      </div>
    );
  });
  return (
    <div className={styles.statusContainer}>
      <h2 className={styles.title}>발주 내역</h2>
      {orderList}
    </div>
  );
}
