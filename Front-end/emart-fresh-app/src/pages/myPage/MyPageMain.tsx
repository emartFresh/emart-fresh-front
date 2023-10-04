import { Outlet } from "react-router-dom";
import MyPageMenuBar from "../myPageMenuBar/MyPageMenuBar";

export default function MyPageMain() {
  return (
    <div>
      <MyPageMenuBar />
      <Outlet />
    </div>
  );
}
