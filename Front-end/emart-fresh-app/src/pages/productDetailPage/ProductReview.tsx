import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../page_css/ProductDetail.module.css";

interface ProductReviewProps {
  productTitle: string;
}

export default function ProductReview({ productTitle }: ProductReviewProps) {
  const [select, setSelect] = useState<number>(0);
  const [reviewData, setReviewData] = useState<ReviewData[]>();
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACK_PORT}/review/product-review?productTitle=${productTitle}&select=${select}`
      )
      .then((res) => {
        console.log("잉", res.data);
        if (res.data) {
          setReviewData(res.data);
        }
      });
  }, [select]);

  const Reviews = reviewData?.map((review) => {
    const ReviewScore = (score: number) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        if (i <= score) {
          stars.push(
            <span key={i} className={styles.starFilled}>
              ★
            </span>
          );
        } else {
          stars.push(
            <span key={i} className={styles.starEmpty}>
              ☆
            </span>
          );
        }
      }
      return stars;
    };
    return (
      <div key={review.reviewId} className={styles.reviewContainer}>
        <button className={styles.reviewDelBtn}>리뷰삭제</button>
        <div className={styles.reviewMemberName}>{String(review.memberId)}</div>
        <div className={styles.starWrapper}>
          {ReviewScore(review.reviewScore)}
          <span>{String(review.reviewDate)}</span>
        </div>
        <div className={styles.contentWrapper}>{review.reviewContent}</div>
      </div>
    );
  });

  const handleSelect = (e) => {
    setSelect(e.target.value);
  };

  return (
    <div className={styles.reviewContentContainer}>
      <section>
        <button value={0} onClick={handleSelect}>
          최신순
        </button>
        <button value={1} onClick={handleSelect}>
          평점 높은순
        </button>
        <button value={2} onClick={handleSelect}>
          평점 낮은순
        </button>
      </section>
      {Reviews}
    </div>
  );
}
