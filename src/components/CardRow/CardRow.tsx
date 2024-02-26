import clsx from "clsx";
import React from "react";
import styles from "./CardRow.module.scss";

const CardRow = ({
  children,
  className,
}: React.PropsWithChildren & { className?: string }) => (
  <div className={styles.container}>
    <div className={clsx(styles.cardRow, className)}>{children}</div>
  </div>
);

export default CardRow;
