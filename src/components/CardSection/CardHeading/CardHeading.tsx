import clsx from "clsx";
import React from "react";
import styles from "./CardHeading.module.scss";

type CardHeadingProps = React.PropsWithChildren & {
  heading: string;
  className?: string;
};

const CardHeading = ({ children, heading, className }: CardHeadingProps) => (
  <div className={clsx(styles.container, className)}>
    {children}
    <h5 className={styles.heading}>{heading}</h5>
  </div>
);

export default CardHeading;
