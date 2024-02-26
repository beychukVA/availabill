import React from "react";
import { Trans, t } from "@lingui/macro";
import Image from "next/image";
import clsx from "clsx";
import { format } from "date-fns";
import { useAppSelector } from "@/redux/store";
import styles from "./CardBillInfo.module.scss";
import ManorLogo from "../../../assets/images/manor-logo.png";

const CardBillInfo = ({
  className,
  date,
  amount,
}: {
  className: string;
  date?: string;
  amount?: number;
}) => {
  const { dashboardTranslations } = useAppSelector(
    (state) => state.translations
  );

  return (
    <div className={className}>
      {date ? (
        <>
          <div className={clsx(styles.text, styles.heading)}>
            {dashboardTranslations?.lastPurchase}
          </div>
          <Image
            className={styles.logo}
            src={ManorLogo}
            alt={t`Manor logo`}
            height={20}
          />
          <div className={clsx(styles.text, styles.date)}>
            {dashboardTranslations?.purchaseFrom}{" "}
            <span className={styles.highlightedText}>
              {format(new Date(date), "d.MM.yyyy")}
            </span>
          </div>
          <div className={styles.text}>
            {dashboardTranslations?.amount}{" "}
            <span className={styles.highlightedText}>
              CHF {amount?.toFixed(0)}
            </span>
          </div>
        </>
      ) : (
        <div>
          <Trans>Keine Transaktionen zum Anzeigen</Trans>
        </div>
      )}
    </div>
  );
};

export default CardBillInfo;
