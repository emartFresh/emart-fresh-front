import { useState, FormEvent, ChangeEvent } from "react";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { sendAxiosPostRequest } from "../../utils/userUtils";
import styles from "./CouponUpdate.module.css";
// import styles from "./abc.module.css";

// 쿠폰 정보
interface CouponData {
  couponId?: number;
  memberId?: string | MemberData;
  couponExpirationDate: string;
  couponType: 10 | 20 | 30;
  couponTitle?: string;
  couponDel?: number;
}

const CouponUpdate = () => {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);

  const [formData, setFormData] = useState<CouponData>({
    couponTitle: "",
    couponType: 10,
    couponExpirationDate: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "couponExpirationDate") {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      if (selectedDate < currentDate) {
        setFormData((formData) => ({
          ...formData,
          [name]: currentDate.toISOString().split("T")[0],
        }));
        return;
      }
    }
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  // 폼제출
  const handleCouponUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.couponTitle.trim() === "") {
      alert("쿠폰 이름을 입력해주세요");
      console.log("쿠폰이름.", formData.couponTitle);
      return;
    } else if (![10, 20, 30].includes(formData.couponType)) {
      alert("10,20,30 중에 입력하세요");
      console.log("10,20,30 중에 입력하세요", formData.couponType);
      return;
    }
    // if (![10, 20, 30].includes(formData.couponType)) {
    //   // Handle the case where couponType is not a valid value, for example, by showing an error message.
    //   alert("10,20,30 중에 입력하세요");
    //   console.log("10,20,30 중에 입력해", formData.couponType);
    //   return;
    // }
    // // Check if couponType is not provided
    // if (!formData.couponType) {
    //   alert("쿠폰 할인률을 입력해주세요");
    //   return;
    // }

    const data = {
      couponTitle: formData.couponTitle,
      couponType: formData.couponType,
      couponExpirationDate: formData.couponExpirationDate,
    };

    const url = `${import.meta.env.VITE_BACK_PORT}/coupon/coupon-create`;

    sendAxiosPostRequest(url, loginToken, setLoginToken, data)
      .then((res) => {
        console.log("쿠폰생성: " + res);

        console.log("쿠폰 생성에 성공했엉");
        console.log("쿠폰 이름", formData.couponTitle);
        console.log("쿠폰 타입", formData.couponType);
        console.log(res.status);
        // response.status === 200
        // if (res.status === 200) {
        //   console.log("쿠폰 생성에 성공했엉");
        // } else {
        //   console.error("쿠폰 생성에 실패하였어");
        // }

        setFormData({
          couponTitle: "",
          couponType: 10,
          couponExpirationDate: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className={styles.couponUpdateMain}>
      <div className={styles.couponUpdateContainer}>
        <div className={styles.couponUpdateTitle}>
          쿠폰 이름
          <input
            type="text"
            name="couponTitle"
            value={formData.couponTitle}
            className={styles.couponUpdateInput}
            placeholder="쿠폰 이름을 등록하세요"
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.couponUpdateTitle}>
          쿠폰 할인률
          <input
            type="text"
            name="couponType"
            value={formData.couponType}
            className={styles.couponUpdateInput}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.couponDate}>
          쿠폰 종료 날짜
          <input
            type="date"
            name="couponExpirationDate"
            value={formData.couponExpirationDate}
            className={styles.couponUpdateInput}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <button onClick={handleCouponUpdate}>쿠폰 생성</button>
    </div>
  );
};

export default CouponUpdate;
