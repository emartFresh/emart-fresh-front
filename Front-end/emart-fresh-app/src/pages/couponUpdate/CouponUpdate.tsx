import { useState, FormEvent, ChangeEvent } from "react";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import { sendAxiosPostRequest } from "../../utils/userUtils";
import styles from "./CouponUpdate.module.css";
import { toast } from "react-toastify";

// 쿠폰 정보
interface CouponData {
  couponId?: number;
  memberId?: string | MemberData;
  couponExpirationDate: string;
  couponType: null | 10 | 20 | 30;
  couponTitle: string;
  couponDel?: number;
}

const CouponUpdate = () => {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);

  const [formData, setFormData] = useState<CouponData>({
    couponTitle: "",
    couponType: null,
    couponExpirationDate: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "couponExpirationDate") {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      if (selectedDate < currentDate) {
        toast.error("쿠폰 종료 날짜는 현재 날짜 이후로 설정해야 합니다");
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
      toast.error("쿠폰 이름을 입력해주세요");
      return;
    } else if (formData.couponType === null) {
      toast.error("쿠폰 할인률을 입력해주세요");
      return;
    } else if (formData.couponExpirationDate.trim() === "") {
      toast.error("쿠폰종료 날짜를 입력해주세요");
      return;
    }

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
        console.log(res);

        if (res === "쿠폰생성 완료") {
          toast.success("쿠폰 등록이 완료 되었습니다!");
        } else {
          toast.error("쿠폰 등록이 되지 않았습니다!");
        }

        setFormData({
          couponTitle: "",
          couponType: null,
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
        <div className={styles.couponUpdateTitle}>쿠폰 이름 </div>
        <input
          type="text"
          name="couponTitle"
          value={formData.couponTitle}
          className={styles.couponUpdateInput}
          placeholder="쿠폰 이름을 등록하세요"
          onChange={handleInputChange}
        />

        <div className={styles.couponUpdateType}>쿠폰 할인률</div>
        <select
          name="couponType"
          value={formData.couponType}
          className={styles.couponUpdateInput}
          onChange={handleInputChange}
        >
          <option value={""} />
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
        <div className={styles.couponUpdateDate}>쿠폰 종료 날짜</div>
        <input
          type="date"
          name="couponExpirationDate"
          value={formData.couponExpirationDate}
          className={styles.couponUpdateInput}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleCouponUpdate}>쿠폰 생성</button>
    </div>
  );
};

export default CouponUpdate;
