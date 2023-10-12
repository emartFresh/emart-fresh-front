// memberAuth==1(점주)일 때
import { Link } from "react-router-dom";
import styles from "../page_css/MyPage.module.css";

export default function StoreManager() {
  return (
    <div>
      <div className={styles.mypagemenubar}>
        <Link to="/">상품등록</Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/manager-order-status">발주현황확인</Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/order-request">발주</Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/">매출현황</Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/StoreOrderList">주문현황</Link>
      </div>
    </div>
  );
}
