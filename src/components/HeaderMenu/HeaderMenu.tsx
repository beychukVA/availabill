import Link from "next/link";
import { Trans } from "@lingui/macro";
import React from "react";
import { useMediaQuery } from "@mui/material";
import { useAppSelector } from "@/redux/store";
import styles from "./HeaderMenu.module.scss";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

export const HeaderMenu: React.FC = () => {
  const matches600 = useMediaQuery("(max-width:600px)");
  const { onboardingTranslations } = useAppSelector(
    (state) => state.translations
  );

  return (
    <div className={styles.container}>
      {!matches600 && (
        <Link style={{ marginRight: 35 }} className={styles.link} href="/">
          <Trans>{onboardingTranslations?.withMyAvailabill}</Trans>
        </Link>
      )}
      <Link style={{ marginRight: 49 }} className={styles.link} href="/">
        <Trans>FAQ</Trans>
      </Link>
      <LanguageSwitcher />
    </div>
  );
};
