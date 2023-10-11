import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

import Home from "./pages/homePage/Home";
import Show from "./pages/showPage/Show";

import MyPageMain from "./pages/myPage/MyPageMain";
import MyReview from "./pages/myPage/MyReview";
import MyCoupon from "./pages/myPage/MyCoupon";
import MyPage from "./pages/myPage/MyPage";
import MyOrder from "./pages/myPage/MyOrder";

import OrderRequest from "./pages/orderRequestPage/OrderRequest";
import OrderHandle from "./pages/orderHandlePage/OrderHandle";
import ShowAllProduct from "./pages/showAllProductPage/ShowAllProduct";
import ShowStoreProduct from "./pages/showStoreProductPage/ShowStoreProduct";
import Login from "./pages/loginPage/Login";
import Signup from "./pages/signupPage/Signup";
import Cart from "./pages/cartPage/Cart";
import { RecoilRoot } from "recoil";

import ProductDetail from "./pages/productDetailPage/ProductDetail";
import EventList from "./pages/eventPage/EventList";
import EventListDetail from "./pages/eventPage/EventListDetail";
import EventUpdate from "./pages/eventPage/EventUpdate";
import ApplyManager from "./pages/applyManger/ApplyManager";
import MakeStore from "./pages/makeStore/MakeStore";
import HandleApplyManager from "./pages/HandleApplyManager";
import StoreOrderList from "./pages/storeOrderList/StoreOrderList";
import NaverCallBack from "./pages/callBackPage/NaverCallBack";

const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Nav />
          <div className="mainContent">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:coupon" element={<Home />} />
              {/* 쿠폰받으러가기 추가사항 */}
              <Route path="/show" element={<Show />} />

              <Route path="/mypageMain" element={<MyPageMain />}>
                <Route index element={<MyPage />} />
                <Route path="/mypageMain/myorder" element={<MyOrder />} />
                <Route path="/mypageMain/myreview" element={<MyReview />} />
                <Route path="/mypageMain/mycoupon" element={<MyCoupon />} />
                <Route
                  path="/mypageMain/mypageApplyManager"
                  element={<ApplyManager />}
                />
                <Route
                  path="/mypageMain/HandleApplyManager"
                  element={<HandleApplyManager />}
                />

                <Route
                  path="/mypageMain/eventupdate"
                  element={<EventUpdate />}
                ></Route>
              </Route>
              <Route path="/eventlist" element={<EventList />}></Route>
              <Route
                path="/eventlistdetail/:eventId"
                element={<EventListDetail />}
              ></Route>

              <Route path="/order-request" element={<OrderRequest />}></Route>
              <Route
                path="/request-order-list"
                element={<OrderHandle />}
              ></Route>
              <Route
                path="/show-all-product"
                element={<ShowAllProduct />}
              ></Route>
              <Route
                path="/storeproduct"
                element={<ShowStoreProduct />}
              ></Route>
              <Route path="/login" element={<Login />} />
              <Route path="/naverCallBack" element={<NaverCallBack />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/order-request" element={<OrderRequest />} />
              <Route path="/request-order-list" element={<OrderHandle />} />
              <Route path="/show-all-product" element={<ShowAllProduct />} />
              <Route path="/storeproduct" element={<ShowStoreProduct />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/detail" element={<ProductDetail />} />
              <Route path="/makeStore" element={<MakeStore />} />
              <Route path="/storeOrderList" element={<StoreOrderList />} />

              {/* <Route path="/payment" element={<Payment />} /> */}
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
