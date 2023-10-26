import axios from "axios";
import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";

import styles from "../page_css/ProductDetail.module.css";
import { convertDateToShortForm } from "../../utils/dateUtils";

interface ProductReviewProps {
  productTitle: string;
}

export default function ProductReview({ productTitle }: ProductReviewProps) {
  const [select, setSelect] = useState<number>(0);
  const [reviewData, setReviewData] = useState<ReviewData[]>();
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACK_PORT
        }/review/product-review?productTitle=${productTitle}&select=${select}`
      )
      .then((res) => {
        if (res.data) {
          setReviewData(res.data);
        }
      });
  }, [select]);

  const Reviews = reviewData?.map((review) => {
    return (
      <div key={review.reviewId} className={styles.reviewContainer}>
        <button className={styles.reviewDelBtn}>리뷰삭제</button>
        <div className={styles.reviewMemberName}>{String(review.memberId)}</div>
        <div className={styles.starWrapper}>
          <Rating
            name="simple-controlled"
            value={review.reviewScore}
            readOnly
          />
          <span>{convertDateToShortForm(String(review.reviewDate))}</span>
        </div>
        <div className={styles.contentWrapper}>{review.reviewContent}</div>
      </div>
    );
  });

  const tempReview = (
    <div className={styles.reviewContainer}>
      <div className={styles.contentWrapper}>작성된 리뷰가 없습니다.</div>
    </div>
  );

  const handleSelect = (e) => {
    setSelect(e.target.value);
  };

  return (
    <div className={styles.reviewContentContainer}>
      <div className={styles.reviewNumber}>
        <span>리뷰 개수 {reviewData?.length}개 </span>
        <select
          className={styles.selectOrder}
          name=""
          id=""
          onChange={handleSelect}
        >
          <option value="0">최신순</option>
          <option value="1">평점 높은순</option>
          <option value="2">평점 낮은순</option>
        </select>
      </div>
      {Reviews?.length >= 1 ? Reviews : tempReview}
    </div>
  );
}
