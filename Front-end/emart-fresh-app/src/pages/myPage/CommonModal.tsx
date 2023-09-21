import { ReactNode } from "react";
import styles from "../page_css/CommonModal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function CommonModal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modaloverlay}>
      <div className={styles.modal}>
        <button className={styles.modalclose} onClick={onClose}></button>
        {children}
      </div>
    </div>
  );
}
