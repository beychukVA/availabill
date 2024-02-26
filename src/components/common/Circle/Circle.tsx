import React from "react";
import styles from "./Circle.module.scss";

const Circle = ({ color = "#f39200" }: { color?: string }) => (
  <span className={styles.circle} style={{ backgroundColor: color }} />
);

export default Circle;
