import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../modules/index.ts";
import { composeWithDevTools } from "redux-devtools-extension";
import { ToastContainer } from "react-toastify";

const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ToastContainer 
      position="top-center"
      autoClose={3000}
      hideProgressBar={true}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      limit={2}
    />
    <App />
  </Provider>
);


  // toast 예시입니다! 여기는 그대로 두시고 필요한 옵션은 사용하실 때 예시를 보고 추가해주세요!

  {/* <ToastContainer
  position="top-center"
  autoClose={5000}
  hideProgressBar={false}
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
  limit={2}
  icon="✅"
  toastStyle={{
    // color: "#f9bb00"
  }}
/> */}


  // // 성공 알람 ( 초록색 창 )
  // const success = () => toast.success("Success!");
  // // 실패 알람 ( 빨간색 창 )
  // const error = () => toast.error("Error!");
  // // 경고 알람 ( 노란색 창 )
  // const warning = () => toast.warning("Warnning!");
  // // 정보 알람
  // const info = () => toast.info("Info...");