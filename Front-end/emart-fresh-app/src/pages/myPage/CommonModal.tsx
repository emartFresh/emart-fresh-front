import { ReactNode } from "react";
import styles from "../page_css/CommonModal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function CommonModal({ isOpen, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modaloverlay}>
      <div className={styles.modal}>{children}</div>
    </div>
  );
}
