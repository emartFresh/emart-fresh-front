/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import CommonModal from "./CommonModal";
import ModifyEmail from "./ModifyEmail";
import styles from "../page_css/MyPage.module.css";
interface ModifyEmailProps {
  ischange: boolean;
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CommonModalBasicEmail({
  ischange,
  setIsChange,
}: ModifyEmailProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button className={styles.emailChangeBtn} onClick={openModal}>
        이메일 수정
      </button>
      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <ModifyEmail
          ischange={ischange}
          setIsChange={setIsChange}
          onClose={closeModal}
        />
      </CommonModal>
    </div>
  );
}
