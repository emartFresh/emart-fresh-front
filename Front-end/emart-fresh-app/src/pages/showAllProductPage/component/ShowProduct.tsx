/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from "react-router-dom"; //npm i react-router-dom

interface ShowProductProps {
  productDatas: ProductData[];
  setSelectedItem: React.Dispatch<React.SetStateAction<string[]>>;
  selectedItem: string[];
}
import styles from "../../page_css/ShowProduct.module.css";
import { getTruncateString } from "../../../utils/formatUtils";

export default function ShowProduct({
  productDatas,
  setSelectedItem,
  selectedItem,
}: ShowProductProps) {
  const handleItemClick = (e) => {
    if (selectedItem.includes(e.target.name)) {
      const updatedSelectedItems = selectedItem.filter(
        (item) => item !== e.target.name
      );
      setSelectedItem(updatedSelectedItems);
    } else {
      selectedItem.push(e.target.name);
      setSelectedItem([...selectedItem]);
    }
  };
  console.log("프로덕트 데이터", productDatas);

  const Datas = productDatas?.map((product: ProductData, index: number) => {
    const idLink = `/product/detail?product-id=${product.productId}`;
    return (
      <>
        <section key={index} className={styles.productWrapper}>
          {product.productEvent === 1 ? (
            <span className={styles.badgeOnePlus}>1+1</span>
          ) : (
            <></>
          )}
          {product.productEvent === 2 ? (
            <span className={styles.badgeTwoPlus}>2+1</span>
          ) : (
            <></>
          )}
          {product.productEvent === 3 ? (
            <span className={styles.badgeThreePlus}>2+2</span>
          ) : (
            <></>
          )}
          <div className={styles.productImgWrapper}>
            <img
              className={styles.productImg}
              src={product.productImgUrl}
              alt="no img"
            />
          </div>
          <span className={styles.itemLine}></span>
          <div className={styles.titleWrapper}>
            <button
              className={styles.defaultBtn}
              name={product.productTitle}
              onClick={(e) => {
                handleItemClick(e);
              }}
            >
              {getTruncateString(product.productTitle, 16)}
            </button>
          </div>
          <div className={styles.priceInfo}>{product.priceString}</div>
          <Link to={idLink}>상품상세</Link>
        </section>
      </>
    );
  });

  return <section className={styles.showItemSection}>{Datas}</section>;
}
