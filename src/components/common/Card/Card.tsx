import clsx from "clsx";
import React from "react";
import styles from "./Card.module.scss";

const Card = ({
  children,
  className,
}: React.PropsWithChildren & { className?: string }) => (
  <div className={clsx(styles.card, className)}>{children}</div>
);

export default Card;
