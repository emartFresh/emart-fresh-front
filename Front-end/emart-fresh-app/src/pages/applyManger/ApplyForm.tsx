import { useEffect, useState } from "react";
import { GetUserAllInfo } from "../../utils/LoginUtils";
import styles from "../page_css/ApplyManager.module.css";
import axios from "axios";
import { convertDateToShortForm } from "../../utils/dateUtils";

interface ApplyData {
  applied: boolean;
  applyDate: string;
  applyManagerCount: number;
  certifImgUrl: string;
  memberId: string;
}

export default function ApplyForm({ showModal }: { showModal: boolean }) {
  const userInfo = GetUserAllInfo();
  const [applyData, setApplyData] = useState<ApplyData>();

  useEffect(() => {
    console.log(
      "유알엘",
      `${import.meta.env.VITE_BACK_PORT}/applymanager/myApply?memberId=${
        userInfo.memberId
      }`
    );
    axios
      .get(
        `${import.meta.env.VITE_BACK_PORT}/applymanager/myApply?memberId=${
          userInfo.memberId
        }`
      )
      .then((res) => {
        console.log("데이터ㅓ", res.data);
        setApplyData(res.data);
      });
  }, [showModal]);

  return (
    <div className={styles.applyManagerWrapper}>
      <div className={styles.nameWrapper}>
        <span className={styles.userName}>{userInfo.memberName}</span>님의 점주
        신청 현황
      </div>
      <table className={styles.applyManagerTable}>
        <tbody>
          <tr>
            <th>상태</th>
            <td className={styles.applyStatus}>
              {applyData?.applied ? "승인" : "대기중"}
            </td>
          </tr>
          <tr>
            <th>신청일</th>
            <td>{convertDateToShortForm(applyData?.applyDate)}</td>
          </tr>
          <tr>
            <th>사업자 등록증</th>
            <td>
              <img
                className={styles.certifImg}
                src={applyData?.certifImgUrl}
                alt=""
                onClick={() => window.open(applyData?.certifImgUrl)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
