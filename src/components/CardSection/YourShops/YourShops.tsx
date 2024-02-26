import React from "react";
import { useAppSelector } from "@/redux/store";
import styles from "./YourShops.module.scss";

export const YourShops: React.FC = () => {
  const { dashboardTranslations } = useAppSelector(
    (state) => state.translations
  );

  return (
    <div className={styles.yourShops}>
      <div className={styles.title}>{dashboardTranslations?.yourDealers}</div>
    </div>
  );
};
