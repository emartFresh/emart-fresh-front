// memberAuth==0일 때, 나오는 컴포넌트
import { Link } from "react-router-dom";
import styles from "../page_css/MyPage.module.css";

export default function OrdinaryUser() {
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
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/mypageApplyManager">점포점주신청</Link>
      </div>
    </div>
  );
}
