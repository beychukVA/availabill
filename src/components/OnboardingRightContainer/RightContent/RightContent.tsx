import React from "react";
import { useAppSelector } from "@/redux/store";
import styles from "./RightContent.module.scss";

export const RightContent: React.FC = () => {
  const { onboardingTranslations } = useAppSelector(
    (state) => state.translations
  );
  return (
    <div className={styles.content}>
      <span className={styles.orangeSubTitle}>
        {onboardingTranslations?.greeting}
      </span>
      <span className={styles.contentTitle}>
        {onboardingTranslations?.heading_1}
      </span>
      <div className={styles.delimiter} />
      <span className={styles.contentSubtitle}>
        {onboardingTranslations?.newHere}
      </span>
      <span className={styles.contentDescription}>
        {onboardingTranslations?.registerCTATxt}
      </span>
    </div>
  );
};
