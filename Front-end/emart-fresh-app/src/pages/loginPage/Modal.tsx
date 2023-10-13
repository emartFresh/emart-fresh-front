// import React from "react";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Modal.module.css'

interface ModalProps{
  closeModal: () => void;
  children:JSX.Element;
}
const Modal = ({ closeModal, children }:ModalProps): JSX.Element => {
  const handleModalClose = () => {
    closeModal();
  };

  return (
    <div className={styles.Modal} onClick={handleModalClose}>
      <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
        <button id={styles.modalCloseBtn} onClick={handleModalClose}>
          <FontAwesomeIcon icon={faXmark}/>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
