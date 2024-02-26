import Link from "next/link";
import { Trans, t } from "@lingui/macro";
import React from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useAppSelector } from "@/redux/store";
import { HelpIcon } from "../Icons/HelpIcon/HelpIcon";
import styles from "./OnboardingFooter.module.scss";

export const OnboardingFooter: React.FC = () => {
  const { pathname } = useRouter();
  const { onboardingTranslations } = useAppSelector(
    (state) => state.translations
  );

  return (
    <div className={styles.footer}>
      <div className={styles.help}>
        <HelpIcon />
        <div className={styles.contact}>
          <span className={styles.contactTitle}>
            <Trans>{onboardingTranslations?.haveQuestion}</Trans>
          </span>
          <Link href="tel:+41584332200" className={styles.contactNumber}>
            +41 58 433 22 00
          </Link>
        </div>
      </div>
      <div className={styles.copyright}>
        <span className={styles.company}>
          <Link
            className={clsx(
              styles.link,
              pathname === "/impressum" && styles.active
            )}
            href="/impressum"
          >{t`${onboardingTranslations?.impressum}`}</Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link className={styles.link} href="/">{t`AGB`}</Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link
            className={clsx(
              styles.link,
              pathname === "/datenschutz" && styles.active
            )}
            href="/datenschutz"
          >{t`${onboardingTranslations?.datenshutz}`}</Link>
        </span>
        <span className={styles.copyrightText}>
          <Trans>{onboardingTranslations?.copyRight}</Trans>
        </span>
      </div>
    </div>
  );
};
