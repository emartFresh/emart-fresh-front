import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import MyPageMenuBar from "../myPageMenuBar/MyPageMenuBar";

import { useNavigate } from "react-router-dom";
import { useIsLogin } from "../../utils/LoginUtils";

export default function MyPageMain() {
  const isValidUserAuth = useIsLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidUserAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      {isValidUserAuth && <MyPageMenuBar />}
      {isValidUserAuth && <Outlet />}
    </div>
  );
}
