import { useAppDispatch, useAppSelector } from "@/redux/store";
import { toggleSidebar } from "@/redux/UI/ui-slice";
import clsx from "clsx";
import React from "react";
import styles from "./SidebarToggle.module.scss";

const SidebarToggle = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((store) => store.ui);

  return (
    <div
      onClick={() => {
        dispatch(toggleSidebar());
      }}
      className={clsx(
        styles.menu,
        styles.menuBackTwo,
        sidebarOpen && styles.open
      )}
    >
      <div className={styles.menuIcon}>
        <div className={clsx(styles.menuLine, styles.menuLineOne)} />
        <div className={clsx(styles.menuLine, styles.menuLineTwo)} />
        <div className={clsx(styles.menuLine, styles.menuLineThree)} />
      </div>
    </div>
  );
};

export default SidebarToggle;
