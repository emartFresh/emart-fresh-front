import { useState, useEffect } from "react";
import { TextareaAutosize, Rating } from "@mui/material";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

import { loginState } from "../../atoms";
import { sendAxiosPostRequest } from "../../utils/userUtils";

import styles from "../page_css/MyOrder.module.css";

export default function OrderReview({
  orderedPpId,
  review,
  setShowModal,
}: {
  orderedPpId: number;
  review: any;
  setShowModal: nay;
}) {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [reviewText, setReviewText] = useState<string[]>([]);
  const [newReviewScore, setNewReviewScore] = useState<number>(5); // 초기 평점 값을 설정합니다.

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleRatingChange = (event, newValue) => {
    setNewReviewScore(newValue);
  };

  console.log(newReviewScore);
  const createReview = () => {
    const url = `${import.meta.env.VITE_BACK_PORT}/review/add`;

    const reviewData = {
      review: {
        reviewContent: reviewText,
        reviewScore: newReviewScore, //수정 : 별점 기능 추가
      },
      orderedProductProductId: orderedPpId,
    };

    console.log("넘기는 값", reviewData);

    sendAxiosPostRequest(url, loginToken, setLoginToken, reviewData).then(
      (res) => {
        toast.success("댓글 쓰기 완료!", {
          position: "top-center",
          autoClose: 1500,
          icon: "✅",
        });
        setShowModal(false);
      }
    );
  };

  let reviewComponent = <></>;

  console.log("리뷰", review);
  console.log("리뷰컨텐츠 ", review?.reviewContent);

  if (review !== null) {
    reviewComponent = (
      <>
        <Rating value={review.reviewScore} readOnly />
        <div className={styles.contentWrapper}>{review?.reviewContent}</div>
      </>
    );
  } else {
    reviewComponent = (
      <>
        <Rating value={newReviewScore} onChange={handleRatingChange} min={1} />
        <TextareaAutosize
          aria-label="텍스트 입력"
          minRows={3} // 최소 행 수를 설정합니다.
          maxRows={50} // 최대 행 수를 설정합니다.
          placeholder="내용을 입력하세요..."
          value={reviewText}
          onChange={handleReviewChange}
          style={{
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
          }}
        />
        <button onClick={createReview} className={styles.reviewBtn}>
          리뷰 작성
        </button>
      </>
    );
  }

  return <div className={styles.reviewContainer}>{reviewComponent}</div>;
}
