// memberAuth==1(점주)일 때
import { Link } from "react-router-dom";
import styles from "../page_css/MyPage.module.css";

export default function StoreManager() {
  return (
    <div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain">개인정보관리</Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/myorder">나의주문내역</Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/myreview">내가작성한리뷰</Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/mycoupon">나의쿠폰조회</Link>
      </div>
      <hr style={{ width: "130px" }} />
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/manager-order-status">발주현황</Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/order-request">발주</Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/StoreOrderList">주문현황</Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/chart">매출 차트</Link>
      </div>
    </div>
  );
}
