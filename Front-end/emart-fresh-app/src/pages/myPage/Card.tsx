/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode } from "react";

interface CardProps {
  title?: string;
  style?: string;
  backgroundColor?: string | undefined;
  children: ReactNode;
}

function Card(props: CardProps) {
  const { title, children, backgroundColor } = props;

  return (
    <div>
      {title && <h3>{title}</h3> && backgroundColor}
      {children}
    </div>
  );
}

export default Card;
