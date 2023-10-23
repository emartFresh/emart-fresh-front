//  memberAuth==2(관리자)일 때
import { Link } from "react-router-dom";
import styles from "../page_css/MyPage.module.css";

export default function Administrator({
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
        <Link to="/mypageMain/HandleApplyManager" onClick={handleClick}>
          점주 신청 승인
        </Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/request-order-list" onClick={handleClick}>
          발주승인 페이지
        </Link>
      </div>
      <div className={styles.mypagemenubar}>
        {/* <EventIcon /> */}
        <Link to="/mypageMain/eventupdate" onClick={handleClick}>
          이벤트 생성
        </Link>
      </div>
      <div className={styles.mypagemenubar}>
        <Link to="/mypageMain/couponupdate" onClick={handleClick}>
          쿠폰 생성
        </Link>
      </div>
    </div>
  );
}
