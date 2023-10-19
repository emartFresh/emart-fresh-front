import styles from "../page_css/ProductDetail.module.css";

export default function ProductType({ productType }: { productType: number }) {
  console.log("뱃지 넘버", productType);

  const borderColor = {
    borderColor:
      productType === 1
        ? "#DC143C"
        : productType === 2
        ? "#FFA500"
        : productType === 3
        ? "#FFD700"
        : productType === 4
        ? "#8DB600"
        : productType === 5
        ? "#81D8D0"
        : productType === 6
        ? "#000080"
        : productType === 7
        ? "#9966CC"
        : "black",
  };

  const bageName =
    productType === 1
      ? "도시락"
      : productType === 2
      ? "김밥"
      : productType === 3
      ? "햄버거"
      : productType === 4
      ? "주먹밥"
      : productType === 5
      ? "샌드위치"
      : productType === 6
      ? "즉석식"
      : productType === 7
      ? "조리면"
      : "분류없음";
  return (
    <div style={borderColor} className={styles.badge}>
      {bageName}
    </div>
  );
}
