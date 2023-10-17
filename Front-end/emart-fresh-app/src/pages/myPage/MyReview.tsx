/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../page_css/MyReview.module.css";
import icon_warning from "../../assets/images/icon_warning.svg";
import Pagination from "@mui/material/Pagination";
import { Rating } from "@mui/material";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { sendAxiosGetRequest } from "../../utils/userUtils";
import { GetUserAllInfo } from "../../utils/LoginUtils";
import review from "../../assets/images/review.png";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const allMember = GetUserAllInfo();
  // 나의 리뷰 리스트
  useEffect(() => {
    async function fetchReviews() {
      console.log("리프레쉬토큰", loginToken);
      const url = `${import.meta.env.VITE_BACK_PORT}/review/review-list`;

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
        const ReviewData = response.content;

        if (response.totalPages) {
          setTotalPages(response.totalPages);
        }

        if (ReviewData && ReviewData.length > 0) {
          console.log("Review Data:", ReviewData);
          setReviews(ReviewData);
        } else {
          // alert("리뷰내역이 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        alert("리뷰 조회 중 오류가 발생했습니다.");
      }
    }

    fetchReviews();
  }, [currentPage, loginToken]);

  // 나의 리뷰 삭제
  async function deleteReview(reviewId: number | undefined) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_PORT}/review/review-delete`,
        null,
        {
          params: {
            reviewId: reviewId,
          },
        }
      );
      console.log("API Response:", response.data);
      const ReviewDeleteData = response.data;

      if (response.status === 200) {
        console.log("Review Data:", ReviewDeleteData);
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.reviewId !== reviewId)
        );
        toast.success("삭제되었습니다");
      } else {
        toast.error("삭제되지 않았습니다.");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const pages: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(i + 1);
  }

  return (
    <div className={styles.reviewMain}>
      <h3>
        <span className={styles.tossface}>😀</span>&nbsp;&nbsp;
        {allMember.memberId}님 반갑습니다.&nbsp;&nbsp;
        <span className={styles.tossface}>😀</span>
      </h3>

      {reviews === undefined || (reviews && reviews.length === 0) ? (
        <div style={{ alignItems: "center" }}>
          <img
            src={review}
            style={{ width: "200px", marginBottom: "0.6rem" }}
          />
          <img
            src={icon_warning}
            style={{ width: "1.2rem", marginBottom: "1vw" }}
          />
          <span style={{ fontSize: "1.2rem" }}>작성한 리뷰가 없습니다</span>
          <div>
            <Link to="/" className={styles.reviewBtn}>
              상품보러가기
            </Link>
          </div>
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.reviewId} className={styles.reviewWrapper}>
            <div className={styles.dateAndImg}>
              <div className={styles.reviewDate}>
                {new Date(review.reviewDate).toLocaleDateString()}
              </div>
              <div className={styles.imageContainer}>
                <img
                  src={review.productImgUrl}
                  className={styles.image}
                  alt="상품"
                />
              </div>
            </div>
            <div className={styles.reviewContainer}>
              <div className={styles.reviewRating}>
                <Rating
                  name={`rating-${review.reviewId}`}
                  value={review.reviewScore}
                  readOnly
                />
                <div>
                  <button
                    className={styles.reviewDetailBtn}
                    onClick={(e) => deleteReview(review.reviewId)}
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div className={styles.reviewText}>{review.productTitle}</div>
              <div className={styles.reviewContent}>{review.reviewContent}</div>
            </div>
          </div>
        ))
      )}

      <div className={styles.paginationList}>
        {reviews && reviews.length > 0 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_event, value) => handlePageChange(value)}
          />
        )}
      </div>
    </div>
  );
}
