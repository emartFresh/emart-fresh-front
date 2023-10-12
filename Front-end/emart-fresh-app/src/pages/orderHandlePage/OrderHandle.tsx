import axios from "axios";
import { toast } from "react-toastify";
import styles from "../page_css/OrderHandle.module.css";
import { useState, useEffect } from "react";
import { useIsSameAuthNum } from "../../utils/LoginUtils";
import { useNavigate } from "react-router-dom";

interface ManagerOrderObjData extends ManagerOrderData {
  store: StoreData;
  product: ProductData;
}
export default function OrderHandle() {
  const [dateValue, setDateVale] = useState<string>();
  const [orderDatas, setOrderDatas] = useState<ManagerOrderObjData[]>();
  const [groupedOrderDatas, setGroupedOrderDatas] = useState([]);
  const [applyOrderNumbers, setApprayOrderNumbers] = useState<number[]>([]);
  const [applyBtnCliked, setApplyBtnCliked] = useState<boolean>(false);
  const isValidUserAuth = useIsSameAuthNum(2);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidUserAuth) {
      navigate("/home");
    }
  }, [isValidUserAuth]);
  const handleCheckClick = (e) => {
    const clickedOrderNum = Number(e.target.name);
    const hasOrderId = applyOrderNumbers.includes(clickedOrderNum);

    if (hasOrderId) {
      const newArr = applyOrderNumbers.filter(
        (orderNum) => orderNum !== clickedOrderNum
      );
      setApprayOrderNumbers(newArr);
    } else {
      setApprayOrderNumbers([...applyOrderNumbers, clickedOrderNum]);
    }
  };

  const isChecked = (orderNum: number): boolean => {
    console.log("이거ㅓ", orderNum);
    console.log("이거222", applyOrderNumbers.includes(orderNum));

    return applyOrderNumbers.includes(orderNum);
  };

  const handleSubmitDate = () => {
    axios
      .get(`${import.meta.env.VITE_BACK_PORT}/admin/order-by-date`, {
        params: { date: dateValue },
      })
      .then((res) => {
        setOrderDatas(res?.data);
      });
  };

  useEffect(() => {
    if (applyBtnCliked) {
      handleSubmitDate();
      setApplyBtnCliked(false);
      setApprayOrderNumbers([]);
    }
  }, [applyBtnCliked]);

  console.log("ㅇ", applyOrderNumbers);

  useEffect(() => {
    const datas: any = orderDatas;
    const result = datas?.reduce((acc, curr) => {
      const storeId = curr.store?.storeId;
      if (storeId !== undefined) {
        if (!acc[storeId]) {
          acc[storeId] = [];
        }
        acc[storeId].push(curr);
      }
      return acc;
    }, {});

    const resultArray: any = [];
    for (const objKey in result) {
      resultArray.push(result[objKey]);
    }
    setGroupedOrderDatas(resultArray);
  }, [orderDatas]);

  const handleDoOrder = () => {
    const orderNum = applyOrderNumbers;
    if (applyOrderNumbers.length === 0) {
      toast.error("선택된 물품이 없습니다!", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACK_PORT}/admin/handle-order`, orderNum)
      .then((res) => {
        setApplyBtnCliked(true);
        toast.success("발주 처리 완료!", {
          position: "top-center",
          autoClose: 1500,
          icon: "✅",
        });
      });
  };

  const innerListEle = (innerData: ManagerOrderObjData[]): JSX.Element[] => {
    return innerData.map((oneData: ManagerOrderObjData, index: number) => {
      return (
        <div className={styles.innerListSection} key={index}>
          <div style={{ textAlign: "center" }}>
            <img
              className={styles.orderImg}
              src="{oneData.product.productImgUrl}"
            />
          </div>
          <span>{oneData.product.productTitle}</span>
          <span>{oneData.managerOrderQuantity}</span>
          <div style={{ textAlign: "center" }}>
            <input
              name={String(oneData.managerOrderNum)}
              type="checkbox"
              checked={isChecked(oneData.managerOrderNum)}
              className={styles.innerCheckBox}
              onClick={handleCheckClick}
            />
          </div>
        </div>
      );
    });
  };

  const orderListEle: JSX.Element[] | undefined = groupedOrderDatas?.map(
    (order: ManagerOrderObjData[], index: number) => {
      return (
        <details key={index} className={styles.orderListSection}>
          <summary>
            <div>
              <span>점포 등록 번호 : {order[0]?.store?.storeId}</span>
            </div>
          </summary>
          <div className={styles.innerListSection}>
            <span>사진</span>
            <span>상품명</span>
            <span>발주량</span>
            <span>승인 처리</span>
          </div>
          {innerListEle(order)}
        </details>
      );
    }
  );

  return (
    <div className={styles.orderHandleContainer}>
      <div>
        <input type="date" onChange={(e) => setDateVale(e.target.value)} />
        <button className={styles.veriBtn} onClick={handleSubmitDate}>
          발주 확인
        </button>
      </div>
      <div>
        <span>{applyOrderNumbers.length}개 선택</span>
        <button className={styles.confirmBtn} onClick={handleDoOrder}>
          발주 승인
        </button>
      </div>
      <div className={styles.orderListWrapper}>{orderListEle}</div>
    </div>
  );
}
