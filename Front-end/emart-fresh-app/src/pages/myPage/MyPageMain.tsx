import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useIsLogin } from "../../utils/LoginUtils";
import { toast } from "react-toastify";
import styles from "../page_css/MyPage.module.css";
import MyPageMenuBar from "../myPageMenuBar/MyPageMenuBar";
import ToggleMyPageMenubar from "../myPageMenuBar/ToggleMyPageMenubar";

export default function MyPageMain() {
  const isValidUserAuth = useIsLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidUserAuth) {
      toast.error("로그인이 필요한 서비스입니다");
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
