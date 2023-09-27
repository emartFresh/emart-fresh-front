import { useState } from "react";

import ChangePW from "./ChangePW";
import CommonModal from "./CommonModal";
import styles from "../page_css/MyPage.module.css";

export default function CommonModalBasic() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button className={styles.passwordBtn} onClick={openModal}>
        비밀번호 변경
      </button>
      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <ChangePW onClose={closeModal} />
      </CommonModal>
    </div>
  );
}
