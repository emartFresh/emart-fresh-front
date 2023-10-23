// memberAuth==1(점주)일 때
import { Link } from "react-router-dom";
import styles from "../page_css/MyPage.module.css";

export default function StoreManager({
  setOpenDrawer,
}: {
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleClick = () => {
    setOpenDrawer(false);
  };
  return (
    <div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain" onClick={handleClick}>
          개인정보관리
        </Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/myorder" onClick={handleClick}>
          나의주문내역
        </Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/myreview" onClick={handleClick}>
          내가작성한리뷰
        </Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/mycoupon" onClick={handleClick}>
          나의쿠폰조회
        </Link>
      </div>
      <hr style={{ width: "130px" }} />
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/manager-order-status" onClick={handleClick}>
          발주현황
        </Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/order-request" onClick={handleClick}>
          발주
        </Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/StoreOrderList" onClick={handleClick}>
          주문현황
        </Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/chart" onClick={handleClick}>
          매출 차트
        </Link>
      </div>
    </div>
  );
}
