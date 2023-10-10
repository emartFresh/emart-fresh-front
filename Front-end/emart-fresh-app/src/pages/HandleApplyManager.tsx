import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import styles from "./page_css/HandleApplyManager.module.css";
import { convertDateToShortForm } from "../utils/dateUtils";
import { useIsSameAuthNum } from "../utils/LoginUtils";
export default function HandleApplyManager() {
  const navigate = useNavigate();

  const [applyManagetList, setApplyManagetList] =
    useState<ApplyManagerData[]>();
  const isValidUserAuth = useIsSameAuthNum(2);

  useEffect(() => {
    if (!isValidUserAuth) {
      navigate("/home");
    }
  }, [isValidUserAuth]);

  useEffect(() => {
    const url = `${import.meta.env.VITE_BACK_PORT}/applymanager/apply-showList`;
    axios.get(url, { params: { page: 1, size: 50 } }).then((res) => {
      setApplyManagetList(res.data.content);
      console.log("컨텐츠", res.data.content);
    });
  }, []);

  return (
    <div className={styles.applyManagerContainer}>
      {applyManagetList?.map((ele, inx) => {
        return (
          <Link
            key={inx}
            to={"/makeStore"}
            state={{ memberId: ele.memberId, certImg: ele.certifImgUrl }}
          >
            <div className={styles.applyManagerWrapper} key={inx}>
              <div className={styles.imgWrapper}>
                <img
                  className={styles.certfImg}
                  src={ele.certifImgUrl}
                  alt=""
                />
              </div>
              <section className={styles.applyfSection}>
                <span className={styles.contentName}>
                  {String(ele.memberId)}
                </span>
                <span className={styles.contentDate}>
                  {convertDateToShortForm(String(ele.applyDate))}
                </span>
              </section>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
