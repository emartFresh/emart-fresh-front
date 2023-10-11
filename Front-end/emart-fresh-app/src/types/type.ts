/* eslint-disable @typescript-eslint/no-unused-vars */

export {};
declare global {
  // 회원 정보
  interface MemberData {
    memberId: string; // 회원 아이디 (로그인용)
    memberPw: string; // 회원 비밀번호
    newPw?: string; // 비밀번호 재설정 (선택적 필드)
    memberName: string; // 사용자 이름
    memberEmail: string; // 사용자 메일
    memberAuth: 0 | 1 | 2; // 사용자 구분 (0: 일반유저, 1: 점주, 2: 웹 관리자)
    memberWarning: number; // 경고 횟수
    memberDel: boolean; // 회원 탈퇴 여부
  }

  interface Params {
    [key: string]: string | number;
  }

  // 수정
  interface responseData {
    [key: string]: string | number | boolean | undefined;
  }

  // 제품 정보
  interface ProductData {
    productId: number; // 제품 아이디
    priceNumber: number; // 가격 (숫자)
    priceString: string; // 가격 (문자열)
    productTitle: string; // 제품 제목
    productExpirationDate: Date; // 제품 유효기간
    productType: number; // 제품 종류
    productImgUrl: string; // 제품 이미지 URL
    productEvent: number; // 제품 이벤트
    createdAt: Date; // 생성 날짜
    productTimeSale: boolean; // 제품 타임세일
  }

  // 주문된 상품 정보
  interface OrderedProductData {
    memberId: string | MemberData; // 멤버 아이디 (외래 키)
    productId: number | ProductData; // 제품 아이디 (외래 키)
    storeId: number | StoreData; // 가게 아이디 (외래 키)
    orderedNumber: number; // 주문 번호
    orderedQuantity: number; // 수량
    isPickup: boolean; // 픽업 여부
    orderedDel: boolean; // 삭제 여부
    orderedDate: Date; // 주문 날짜
  }

  // 점주 신청 정보
  interface ApplyManagerData {
    memberId: string | MemberData; // 멤버 아이디 (외래 키)
    isApplied: boolean; // 승인 여부
    applyDate: Date; // 요청 일자
    certifImgUrl: string;
  }

  // 장바구니 정보
  interface CartData {
    cartId?: number; // 장바구니 아이디 (프라이머리 키)
    productId?: number;
    cartProductQuantity: number;
    cartProductQuantityOfString?: string;
    priceNumber: number;
    productTitle: string;
    cartProductId: number; // 제품 아이디 (외래 키)
    storeId: number; // 가게 아이디 (외래 키)
    productTimeSale: number;
    // cartProductId: number | ProductData; // 제품 아이디 (외래 키)
    // storeId: number | StoreData; // 가게 아이디 (외래 키)
  }

  // 발주 정보
  interface ManagerOrderData {
    productId: number | ProductData; // 제품 아이디 (외래 키)
    storeId?: number | StoreData; // 가게 아이디 (외래 키)
    managerOrderNum?: number; // 발주 번호
    managerOrderStatus: boolean; // 상태 (false: 대기, true: 처리 완료)
    managerOrderQuantity: number; // 수량
    managerOrderDate: Date; // 발주 날짜
  }

  // 리뷰 정보
  interface ReviewData {
    reviewId?: number; // 리뷰의 프라이머리 키 (auto_increment)
    memberId: string | MemberData; // 멤버 아이디 (외래 키)
    productTitle: string; // 제품 이름
    reviewContent: string; // 리뷰 내용
    reviewDate: Date; // 리뷰 작성 날짜
    reviewScore: 1 | 2 | 3 | 4 | 5; // 평점
  }

  // 쿠폰 정보
  interface CouponData {
    couponId?: number; // 쿠폰의 프라이머리 키 (auto_increment)
    memberId: string | MemberData; // 멤버 아이디 (외래 키)
    couponExpirationDate: string; // 쿠폰 기한
    couponType: 10 | 20 | 30; // 쿠폰 종류 (1: 10%, 2: 20%, 3: 30%)
    couponTitle?: string;
    couponDel?: number;
  }

  interface ExtendedCoupon extends CouponData {
    existing: boolean;
  }

  // 가게 정보
  interface StoreData {
    storeId?: number; // 가게 아이디
    memberId: number | MemberData; // 멤버 아이디
    address: string; // 주소
  }

  // 가게 상품 정보
  interface StoreProductData {
    productId: number | ProductData; // 제품 아이디 (외래 키)
    storeId: number | StoreData; // 가게 아이디 (외래 키)
    storeProductStock: number; // 가게 상품 재고
    storeProductStatus: boolean; // 가게 상품 취급 분류 (true: 취급)
  }

  // 검색 정보
  interface SearchData {
    searchDate: Date; // 검색 날짜
    searchContent: string; // 검색어
  }

  // 이벤트 정보
  interface EventData {
    eventId?: number; // 이벤트 아이디 (프라이머리 키)
    eventTitle: string; // 이벤트 제목
    eventBannerImage: string; // 배너 이미지
    eventDetailImage: string; // 디테일 이미지
    eventStartDate: Date; // 시작 날짜
    eventEndDate: Date; // 종료 날짜
  }

  interface JwtToken {
    accessToken: string;
    refreshToken: string;
  }
}
