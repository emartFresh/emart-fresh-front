/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from "../page_css/MyOrder.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import icon_warning from "../../assets/images/icon_warning.svg";

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
  isPickup: boolean;
}

export default function MyOrder() {
  console.log("주문내역페이지");

  const pageSize = 5;
  const [memberId, setMemberId] = useState("user123");
  const [orderedProducts, setOrderedProducts] = useState<OrderedProductData[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACK_PORT}/orderedproduct/orderedproduct-list`,
          null,
          {
            params: {
              memberId: memberId,
              page: currentPage,
              size: pageSize,
            },
          }
        );

        const productsData = response.data.content;

        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        }
        if (productsData && productsData.length > 0) {
          setOrderedProducts(productsData);
        } else {
          alert("주문내역이 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching orderedProducts:", error);
        alert("주문내역 조회 중 오류가 발생했습니다.");
      }
    }

    fetchOrders();
  }, [memberId, currentPage]);

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

  return (
    <div className={styles.orderMain}>
      <h3>
        <span className={styles.tossface}>😀</span>
        {memberId}님 반갑습니다.
      </h3>
      {orderedProducts === undefined ||
      (orderedProducts && orderedProducts.length === 0) ? (
        <div style={{ alignItems: "center" }}>
          <img
            src={icon_warning}
            style={{ width: "1.2rem", marginBottom: "1vw" }}
            alt="Warning Icon"
          />
          <span style={{ fontSize: "1.2rem" }}>주문하신 내역이 없습니다</span>
        </div>
      ) : (
        orderedProducts.map((orderedProduct, index) => (
          <div key={index}>
            <h6 style={{ textAlign: "left", marginLeft: "310px" }}>
              {orderedProduct.orderCode}
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
                    {orderedProduct.isPickup ? (
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
