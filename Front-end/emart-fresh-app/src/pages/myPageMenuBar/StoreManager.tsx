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
        <Link to="/order-request">발주 보내는 페이지</Link>
      </div>
    </div>
  );
}
