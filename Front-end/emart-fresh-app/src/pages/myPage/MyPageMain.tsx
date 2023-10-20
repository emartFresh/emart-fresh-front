import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MyPageMenuBar from "../myPageMenuBar/MyPageMenuBar";
import { useIsLogin } from "../../utils/LoginUtils";
import styles from "../page_css/MyPage.module.css";

export default function MyPageMain() {
  const isValidUserAuth = useIsLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidUserAuth) {
      navigate("/login");
    }
  }, []);
  return (
    <div className={styles.myPageContainer}>
      {isValidUserAuth && <MyPageMenuBar />}
      {isValidUserAuth && <Outlet />}
    </div>
  );
}
