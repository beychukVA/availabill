import { Trans } from "@lingui/macro";
import React from "react";
import { useAppSelector } from "@/redux/store";
import styles from "./TwoFactorAuthentication.module.scss";

export const TwoFactorAuthentication = () => {
  const { profileTranslations } = useAppSelector((state) => state.translations);

  return (
    <div className={styles.container}>
      <div className={styles.title}>{profileTranslations?.twoFactorAuth}</div>
      <div className={styles.description}>
        <p className={styles.tfaParagraph}>
          {profileTranslations?.yourPortalAccessTxt}
        </p>
        <p className={styles.tfaParagraph}>{profileTranslations?.twoFAtxt_1}</p>
        <p className={styles.tfaParagraph}>{profileTranslations?.twoFAtxt_2}</p>
        <p className={styles.tfaParagraph}>{profileTranslations?.twoFAtxt_3}</p>
        <p className={styles.tfaParagraph}>{profileTranslations?.twoFAtxt_4}</p>
      </div>
    </div>
  );
};
