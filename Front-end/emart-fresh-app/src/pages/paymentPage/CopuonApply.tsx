import { useState, useEffect } from "react";
import { sendAxiosGetRequest } from "../../utils/userUtils";
import { useRecoilState } from "recoil";
import { loginState } from "../../atoms";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import styles from "../page_css/Payment.module.css";
import { Coupon } from "./Payment";

interface DopayProp {
  appliedCoupon: Coupon;

  setAppliedCoupon: React.Dispatch<React.SetStateAction<Coupon>>;
}

export default function CopuonApply({
  setAppliedCoupon,
  appliedCoupon,
}: DopayProp) {
  const [loginToken, setLoginToken] = useRecoilState<JwtToken>(loginState);
  const [couponList, setCouponList] = useState<Coupon[]>();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const url = `${import.meta.env.VITE_BACK_PORT}/coupon/coupon-list`;
    const couponList = sendAxiosGetRequest(url, loginToken, setLoginToken, {
      page: 1,
      size: 100,
    });

    couponList.then((res) => {
      console.log("쿠퐁 리스트", res.content);
      setCouponList(res.content);
    });
  }, []);

  const couponItems =
    couponList &&
    couponList.map((item) => {
      return (
        <div key={item.couponId} className={styles.couponItemContainer}>
          <div>{item.couponTitle}</div>
          <button
            className={styles.couponSelectBtn}
            onClick={() => {
              setAppliedCoupon(item);
              handleClose();
            }}
          >
            선택
          </button>
        </div>
      );
    });

  return (
    <div className={styles.couponContainer}>
      {/* <button>적용</button> */}
      <div className={styles.inputWrapper}>
        <div>할인쿠폰</div>
        <div className={styles.couponinputWrapper}>
          <input
            className={styles.couponInput}
            type="text"
            placeholder="쿠폰을 선택해주세요."
            onClick={handleOpen}
            readOnly
            value={appliedCoupon && appliedCoupon.couponTitle}
          />
          <button
            className={styles.couponDelBtn}
            onClick={() =>
              setAppliedCoupon({
                couponExpirationDate: "",
                couponId: null,
                couponTitle: "",
                couponType: 0,
                memberId: "",
              })
            }
          >
            취소
          </button>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <div className={styles.couponScrollWrapper}>{couponItems}</div>
          <Button onClick={handleClose}>닫기</Button>
        </Box>
      </Modal>
    </div>
  );
}
