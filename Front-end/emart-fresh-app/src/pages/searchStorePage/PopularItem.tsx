import { UseQueryResult } from "react-query";
import { OrderedCount, ReviewSummary } from "./MapDrawer";
import Rating from "@mui/material/Rating";
import styles from "../page_css/SearchStore.module.css";
export default function PopularItem({
  topReviewedProducts,
  topOrderedProducts,
  selectedProductOption,
  setSelectedProductName,
}: {
  topReviewedProducts: UseQueryResult<ReviewSummary[], unknown>;
  topOrderedProducts: UseQueryResult<OrderedCount[], unknown>;
  selectedProductOption: number;
  setSelectedProductName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleSelectProduct = (productTitle: string) => {
    setSelectedProductName(productTitle);
  };

  let showingData;
  if (selectedProductOption === 1) {
    showingData = topReviewedProducts?.data?.map((ele: ReviewSummary, inx) => {
      return (
        <div
          key={inx}
          className={styles.productItemWrapper}
          onClick={() => handleSelectProduct(ele.productTitle)}
        >
          <div className={styles.productTitle}>{ele.productTitle}</div>
          <Rating value={ele.avgReviewScore} readOnly />
        </div>
      );
    });
  } else if (selectedProductOption === 2) {
    showingData = topOrderedProducts?.data?.map((ele: OrderedCount, inx) => {
      return (
        <div key={inx} className={styles.productItemWrapper}>
          <div className={styles.productTitle}>{ele.productTitle}</div>
          <div className={styles.productOrderCount}>
            총 주문 횟수 {ele.orderedCount}
          </div>
        </div>
      );
    });
  }

  return <>{showingData}</>;
}
