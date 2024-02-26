import React, { ReactNode } from "react";
import styles from "./SectionTitle.module.scss";

interface IProps {
  children: string | ReactNode;
  maxWidth?: string;
}

export const SectionTitle: React.FC<IProps> = ({
  children,
  maxWidth = "unset",
}) => (
  <span style={{ maxWidth }} className={styles.title}>
    {children}
  </span>
);
