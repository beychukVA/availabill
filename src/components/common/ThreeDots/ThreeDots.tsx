import clsx from "clsx";
import React from "react";
import styles from "./ThreeDots.module.scss";

export const ThreeDots = ({
  className,
  color = "#222222",
}: {
  className?: string;
  color?: string;
}) => (
  <div className={clsx(styles.dotsBlock, className)}>
    <span className={styles.dot} style={{ background: color }} />
    <span className={styles.dot} style={{ background: color }} />
    <span className={styles.dot} style={{ background: color }} />
  </div>
);
