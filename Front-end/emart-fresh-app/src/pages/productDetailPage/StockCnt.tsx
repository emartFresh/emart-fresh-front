import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../page_css/ProductDetail.module.css";

export default function StockCnt({
  storeId,
  productTitle,
}: {
  storeId: string;
  productTitle: string;
}) {
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    const url = `${
      import.meta.env.VITE_BACK_PORT
    }/store/get-store-stock?storeId=${storeId}&productTitle=${productTitle}`;

    if (storeId !== undefined && storeId !== null) {
      axios.get(url).then((res) => {
        setStock(res.data);
      });
    }
  }, [productTitle, storeId]);

  return <div className={styles.stock}>남은 재고: {stock}</div>;
}
