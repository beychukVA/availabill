import clsx from "clsx";
import React from "react";
import styles from "./CardSection.module.scss";

const CardSection = ({
  children,
  className,
}: React.PropsWithChildren & { className?: string }) => (
  <div className={styles.container}>
    <div className={clsx(styles.cardSection, className)}>{children}</div>
  </div>
);

export default CardSection;
