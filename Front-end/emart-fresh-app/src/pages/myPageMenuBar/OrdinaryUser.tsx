// memberAuth==0일 때, 나오는 컴포넌트
import { Link } from "react-router-dom";
import styles from "../page_css/MyPage.module.css";

export default function OrdinaryUser({
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
      <div className={styles.mypagemenubar} onClick={handleClick}>
        <Link to="/mypageMain/mypageApplyManager">점포점주신청</Link>
      </div>
    </div>
  );
}
