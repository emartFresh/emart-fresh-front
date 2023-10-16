import styles from "../page_css/SearchStore.module.css";
import { Link } from "react-router-dom";

export default function StoreList({ storeData }: { storeData: StoreData[] }) {
  console.log("유효", storeData);

  const storeList = storeData?.map((item, inx) => {
    const url = `/storeproduct?storeid=${item.storeId}`;
    return (
      <Link to={url}>
        <div key={inx} className={styles.storeItemWrapper}>
          <div className={styles.storeitle}>{item.storeName}</div>
          <div className={styles.storeAddress}>{item.storeAddress}</div>
        </div>
      </Link>
    );
  });

  return (
    <>
      {storeList}
      {/* {storeData?.map((item, inx) => (
        <div key={inx} className={styles.storeItemWrapper}>
          <Link to="storeproduct?storeid=1" />
          <div className={styles.storeitle}>{item.storeName}</div>
          <div className={styles.storeAddress}>{item.storeAddress}</div>
        </div>
      ))} */}
    </>
  );
}
