/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from "../page_css/MyOrder.module.css";
import { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import icon_warning from "../../assets/images/icon_warning.svg";
import { constSelector, useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { sendAxiosGetRequest } from "../../utils/userUtils";
import { GetUserAllInfo } from "../../utils/LoginUtils";
import order from "../../assets/images/order.png";
import { Link } from "react-router-dom";
import { Modal, Box, TextareaAutosize } from "@mui/material";
import axios from "axios";
import OrderReview from "./OrderReview";

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
  //진성
  orderedProductId?: number;
}

//진성
interface DetailData {
  productId: number;
  productImgUrl: string;
  orderedQuantity: number;
  price: number;
  productName: string;
  review: any;
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

  //진성
  const [showModal, setShowModal] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<DetailData[]>([]);
  const [resetReview, setResetReview] = useState<number>(0);
  //
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

        console.log("데이터터터", OrderedData);
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

  //진성
  const handleDetail = (orderedProductId: number) => {
    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/orderedproduct/getProductDetails?orderedProductId=${orderedProductId}`;
    axios.get(url).then((res) => {
      setDetailData(res.data);
      setShowModal(true);
    });
  };

  allMember.memberId;
  return (
    <div className={styles.orderMain}>
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
            p: 2,
            top: "50%",
            left: "50%",
            maxHeight: "500px",
            overflowY: "auto",
            transform: "translate(-50%, -50%)",
          }}
        >
          {" "}
          <div className={styles.btnWrapper}>
            <button
              className={styles.cancleBtn}
              onClick={() => {
                setShowModal(!showModal);
              }}
            >
              ✖
            </button>
          </div>
          <div className={styles.detailContainer}>
            {detailData.map((item, inx) => {
              console.log("하나 데이터", item);
              return (
                <div className={styles.detailWrapper} key={inx}>
                  <span>
                    <img
                      className={styles.detailImg}
                      src={item.productImgUrl}
                      alt=""
                    />
                  </span>
                  <span className={styles.detailName}>{item.productName}</span>
                  <span className={styles.detailPrice}>{item.price}원</span>
                  <OrderReview
                    setShowModal={setShowModal}
                    orderedPpId={item.productId}
                    review={item.review}
                  ></OrderReview>
                </div>
              );
            })}
          </div>
        </Box>
      </Modal>
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
                    {orderedProduct.pickup ? (
                      <div style={{ color: "gray" }}>픽업완료</div>
                    ) : (
                      <div style={{ color: "blue" }}>픽업대기중</div>
                    )}
                  </div>
                  <div>
                    <button
                      className={styles.orderDetailBtn}
                      onClick={() =>
                        handleDetail(orderedProduct?.orderedProductId)
                      }
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
