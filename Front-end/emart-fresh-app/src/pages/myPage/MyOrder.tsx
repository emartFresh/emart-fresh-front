/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from "../page_css/MyOrder.module.css";
import { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import icon_warning from "../../assets/images/icon_warning.svg";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { sendAxiosGetRequest } from "../../utils/userUtils";
import { GetUserAllInfo } from "../../utils/LoginUtils";
import order from "../../assets/images/order.png";
import { Link } from "react-router-dom";

interface OrderedProductData {
  memberId: string | MemberData;
  productId: number | ProductData;
  storeId: number | StoreData;
  storeName: string;
  orderedDate: Date;
  productTitle: string;
  orderCode: string;
  priceNumber: number;
  orderedQuantity: number;
  totalAmount: number;
  myOrderedCount: number;
  productImgUrl: string;
  pickup: boolean;
}

export default function MyOrder() {
  console.log("주문내역페이지");
  const pageSize = 5;
  const [orderedProducts, setOrderedProducts] = useState<OrderedProductData[]>(
    []
  );
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const allMember = GetUserAllInfo();

  useEffect(() => {
    async function fetchOrders() {
      console.log("리프레쉬토큰", loginToken);
      const url = `${
        import.meta.env.VITE_BACK_PORT
      }/orderedproduct/orderedproduct-list`;

      try {
        const response = await sendAxiosGetRequest(
          url,
          loginToken,
          setLoginToken,
          {
            page: currentPage,
            size: pageSize,
          }
        );

        console.log("API Response:", response);
        const OrderedData = response.content;

        if (response.totalPages) {
          setTotalPages(response.totalPages);
        }

        if (OrderedData && OrderedData.length > 0) {
          console.log("Ordered Data:", OrderedData);
          setOrderedProducts(OrderedData);
        } else {
          // alert("주문내역이 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("주문내역 조회 중 오류가 발생했습니다.");
      }
    }

    fetchOrders();
  }, [currentPage, loginToken, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const pages: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(i + 1);
  }

  const handleClick = () => {
    alert("상세보기 페이지로 이동");
  };

  allMember.memberId;
  return (
    <div className={styles.orderMain}>
      <h3>
        <span className={styles.tossface}>😀</span>
        {allMember.memberId}님 반갑습니다.
        <span className={styles.tossface}>😀</span>
      </h3>
      {orderedProducts === undefined ||
      (orderedProducts && orderedProducts.length === 0) ? (
        <div style={{ alignItems: "center" }}>
          <img
            src={order}
            style={{
              width: "200px",
              marginBottom: "0.6rem",
            }}
          />
          <img
            src={icon_warning}
            style={{ width: "1.2rem", marginBottom: "1vw" }}
            alt="Warning Icon"
          />
          <span style={{ fontSize: "1.2rem" }}>주문하신 내역이 없습니다</span>
          <div>
            <Link to="/" className={styles.orderBtn}>
              상품보러가기
            </Link>
          </div>
        </div>
      ) : (
        orderedProducts.map((orderedProduct, index) => (
          <div key={index}>
            <h6 style={{ textAlign: "left", marginLeft: "310px" }}>
              {/* {orderedProduct.orderCode} */}
            </h6>
            <div className={styles.orderWrapper}>
              <div className={styles.orderContainer}>
                <div className={styles.orderText}>
                  {new Date(orderedProduct.orderedDate).toLocaleDateString()}
                </div>
                <div className={styles.ordernameText}>
                  {orderedProduct.productTitle}
                  {orderedProduct.orderedQuantity > 1 &&
                    ` 외 ${orderedProduct.orderedQuantity - 1}종`}
                  <div>{orderedProduct.totalAmount}원</div>
                </div>
                <div>{orderedProduct.storeName}</div>
                <div className={styles.orderText}>
                  <div>
                    {orderedProduct.pickup ? (
                      <div style={{ color: "gray" }}>픽업완료</div>
                    ) : (
                      <div style={{ color: "blue" }}>픽업대기중</div>
                    )}
                  </div>
                  <div>
                    <button
                      className={styles.orderDetailBtn}
                      onClick={handleClick}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
      <div className={styles.paginationList}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_event, value) => handlePageChange(value)}
        />
      </div>
    </div>
  );
}
