import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

import Home from "./pages/homePage/Home";

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
import HandleApplyManager from "./pages/handleApplyManager/HandleApplyManager";
import StoreOrderList from "./pages/storeOrderList/StoreOrderList";
import NaverCallBack from "./pages/callBackPage/NaverCallBack";

import CouponUpdate from "./pages/couponUpdate/CouponUpdate";

import ManagerOrderStatus from "./pages/managerOrderStatus/ManagerOrderStatus";
import SearchStore from "./pages/searchStorePage/SearchStorePage";

import Chart from "./pages/salesChart/Chart";

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
              <Route path="/search-store" element={<SearchStore />} />

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
                <Route
                  path="/mypageMain/couponupdate"
                  element={<CouponUpdate />}
                ></Route>
                <Route
                  path="/mypageMain/request-order-list"
                  element={<OrderHandle />}
                ></Route>
                <Route
                  path="/mypageMain/manager-order-status"
                  element={<ManagerOrderStatus />}
                />
                <Route
                  path="/mypageMain/order-request"
                  element={<OrderRequest />}
                />
                <Route
                  path="/mypageMain/storeOrderList"
                  element={<StoreOrderList />}
                />
                <Route path="/mypageMain/chart" element={<Chart />} />
              </Route>

              <Route path="/eventlist" element={<EventList />}></Route>
              <Route
                path="/eventlistdetail/:eventId"
                element={<EventListDetail />}
              ></Route>

              <Route path="/order-request" element={<OrderRequest />}></Route>

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
              <Route path="/chart" element={<Chart />} />
              <Route path="/request-order-list" element={<OrderHandle />} />
              <Route path="/show-all-product" element={<ShowAllProduct />} />
              <Route path="/storeproduct" element={<ShowStoreProduct />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/detail" element={<ProductDetail />} />
              <Route path="/makeStore" element={<MakeStore />} />

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
