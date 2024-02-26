import React from "react";
import styles from "./Error.module.scss";

interface IProps {
  children: string;
}

export const Error: React.FC<IProps> = ({ children }) => (
  <div className={styles.error}>{children}</div>
);
