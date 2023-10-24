import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useIsLogin } from "../../utils/LoginUtils";
import styles from "../page_css/MyPage.module.css";
import MyPageMenuBar from "../myPageMenuBar/MyPageMenuBar";
import ToggleMyPageMenubar from "../myPageMenuBar/ToggleMyPageMenubar";

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
      {isValidUserAuth && <ToggleMyPageMenubar />}
      {isValidUserAuth && <Outlet />}
    </div>
  );
}
