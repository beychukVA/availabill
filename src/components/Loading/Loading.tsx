import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import clsx from "clsx";
import styles from "./Loading.module.scss";

interface IProps {
  className?: string;
}

export const Loading: React.FC<IProps> = ({ className }) => (
  <div className={clsx(styles.container, className)}>
    <CircularProgress sx={{ color: "#ff8000" }} />
  </div>
);
