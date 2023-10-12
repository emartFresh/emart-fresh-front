import { Outlet } from "react-router-dom";
import MyPageMenuBar from "../myPageMenuBar/MyPageMenuBar";
// import styles from "./sideMunuBar.module.css";

export default function MyPageMain() {
  return (
    <div>
      <MyPageMenuBar />
      <Outlet />
    </div>
  );
}
