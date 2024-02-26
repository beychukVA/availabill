import React from "react";
import { ChevronDownIcon } from "@/components/Icons/ChevronDownIcon/ChevronDownIcon";
import { Trans } from "@lingui/macro";
import styles from "./BillsHeading.module.scss";

const BillsHeading = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className={styles.addEmail}>
    <span className={styles.addEmailIcon}>{icon}</span>
    <div className={styles.addEmailHeading}>
      <span>
        <Trans>{title}</Trans>
      </span>
      <span className={styles.chevronIcon}>
        <ChevronDownIcon color="black" />
      </span>
    </div>
  </div>
);

export default BillsHeading;
