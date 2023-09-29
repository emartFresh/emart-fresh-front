//  memberAuth==2(관리자)일 때
import { Link } from "react-router-dom";
import styles from "../page_css/MyPage.module.css";

export default function MemberAuthAdmin() {
  return (
    <div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain">개인정보관리</Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/request-order-list">발주승인 페이지</Link>
      </div>
      <div className={styles.mypagemenubar}>
        {/* <EventIcon /> */}
        <Link to="/mypageMain/EventRegi">이벤트 생성</Link>
      </div>
    </div>
  );
}
