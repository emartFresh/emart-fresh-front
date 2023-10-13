import { Link, useLocation } from "react-router-dom"; //npm i react-router-dom

interface ShowProductProps {
  productDatas: ProductData[];
}
import styles from "../../page_css/ShowProduct.module.css";
import { getTruncateString } from "../../../utils/formatUtils";

export default function ShowProduct({ productDatas }: ShowProductProps) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const storeId = queryParams.get("storeid");

  const Datas = productDatas.map((product: ProductData, index: number) => {
    const idLink = `/product/detail?product-id=${product.productId}&store-id=${storeId}`;
    return (
      <section key={index} className={styles.productWrapper}>
        <div className={styles.productImgWrapper}>
          <img
            className={styles.productImg}
            src={product.productImgUrl}
            alt="no img"
          />
        </div>
        <span className={styles.itemLine}></span>
        <div className={styles.titleWrapper}>
          {/* 수정 : 실제 데이터로 이동 */}
          <Link to="/show-all-product">
            {" "}
            {getTruncateString(product.productTitle, 16)}
          </Link>
        </div>
        <div className={styles.priceInfo}>{product.priceString}</div>
        <Link to={idLink}>상품상세</Link>
      </section>
    );
  });

  return <section className={styles.showItemSection}>{Datas}</section>;
}
