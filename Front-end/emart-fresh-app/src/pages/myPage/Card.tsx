/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode } from "react";
import styles from "../page_css/MyPageCommonCard.module.css";

interface CardProps {
  title?: string;
  style?: string;
  backgroundColor?: string | undefined;
  children: ReactNode;
}

function Card(props: CardProps) {
  const { title, children, backgroundColor } = props;

  return (
    <div className={styles.cardContainer}>
      {title && <h3>{title}</h3> && backgroundColor}
      {children}
    </div>
  );
}

export default Card;
