/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../page_css/MyReview.module.css";
import icon_warning from "../../assets/images/icon_warning.svg";
import Pagination from "@mui/material/Pagination";

import ReviewCard from "./ReviewCard";
import { Rating } from "@mui/material";

// 리뷰 정보
interface ReviewData {
  reviewId?: number; // 리뷰의 프라이머리 키 (auto_increment)
  memberId: string | MemberData; // 멤버 아이디 (외래 키)
  productTitle: string; // 제품 이름
  reviewContent: string; // 리뷰 내용
  reviewDate: Date; // 리뷰 작성 날짜
  reviewScore: 1 | 2 | 3 | 4 | 5; // 평점
  productImgUrl: string | undefined;
}

export default function MyReview() {
  console.log("마이리뷰페이지");
  const pageSize = 5;
  const [memberId, setMemberId] = useState("user123");
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // 나의 주문 내역 리스트
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACK_PORT}/review/review-list`,
          null,
          {
            params: {
              memberId: memberId,
              page: currentPage,
              size: pageSize,
            },
          }
        );
        console.log("API Response:", response.data);
        const ReviewData = response.data.content;

        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        }

        if (ReviewData && ReviewData.length > 0) {
          console.log("Review Data:", ReviewData);
          setReviews(ReviewData);
        } else {
          alert("리뷰내역이 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        alert("리뷰 조회 중 오류가 발생했습니다.");
      }
    }

    fetchReviews();
  }, [memberId, currentPage]);
  // 나의 주문 내역 삭제
  async function deleteReview(reviewId: number | undefined) {
    try {
      const response = await axios.post(
        "http://localhost:8080/review/review-delete",
        null,
        {
          params: {
            reviewId: reviewId,
          },
        }
      );
      console.log("API Response:", response.data);
      const ReviewDeleteData = response.data;

      if (response.data === "삭제") {
        console.log("Review Data:", ReviewDeleteData);
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.reviewId !== reviewId)
        );
        alert("삭제!");
      } else {
        alert("삭제실패.");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const pages: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(i + 1);
  }

  console.log("페이지 배열 > " + pages);

  return (
    <div className={styles.reviewMain}>
      <h3>
        <span className={styles.tossface}>😀</span>
        {memberId}님 반갑습니다.
      </h3>
      <div>
        <ReviewCard />
      </div>
      {reviews === undefined || (reviews && reviews.length === 0) ? (
        <div style={{ alignItems: "center" }}>
          <img
            src={icon_warning}
            style={{ width: "1.2rem", marginBottom: "1vw" }}
          />
          <span style={{ fontSize: "1.2rem" }}>작성한 리뷰가 없습니다</span>
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.reviewId}>
            <h6 style={{ textAlign: "left", marginLeft: "310px" }}></h6>
            <Rating
              name={`rating-${review.reviewId}`}
              value={review.reviewScore}
              readOnly
            />
            <div className={styles.reviewWrapper}>
              <div className={styles.reviewContentContainer}>
                <div className={styles.imageContainer}>
                  <img
                    src={review.productImgUrl}
                    className={styles.image}
                    alt="상품"
                  />
                </div>

                <div className={styles.reviewText}>
                  {review.productTitle.split("&")[0]}
                  <br />
                  {review.productTitle.split("&")[1]}
                </div>
                <div className={styles.reviewText}>{review.reviewContent}</div>
                <div className={styles.reviewText}>
                  {new Date(review.reviewDate).toLocaleDateString()}
                </div>
                <div>
                  <button
                    className={styles.reviewDetailBtn}
                    onClick={(e) => deleteReview(review.reviewId)}
                  >
                    삭제
                  </button>
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
          onChange={(event, value) => handlePageChange(value)}
        />
      </div>
    </div>
  );
}
