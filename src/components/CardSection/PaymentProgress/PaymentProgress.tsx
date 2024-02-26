import React from "react";
import clsx from "clsx";
import ProgressBar from "@ramonak/react-progress-bar";
import { toFixedAmount } from "@/utils";
import styles from "./PaymentProgress.module.scss";
import stylesPaymentCard from "../PaymentCard/PaymentCard.module.scss";

const PaymentProgress = ({
  className,
  amount,
  limit,
  amountLabel,
  limitLabel,
}: {
  amount: number;
  limit: number;
  amountLabel: string;
  limitLabel: string;
  className?: string;
}) => {
  if (!amount || !limit) {
    return null;
  }

  return (
    <div className={clsx(styles.paymentProgress, className)}>
      <div className={stylesPaymentCard.paymentCardRow}>
        <span className={styles.upper}>{toFixedAmount(amount)}</span>
        <span className={styles.upper}>{toFixedAmount(limit)}</span>
      </div>
      <div className={stylesPaymentCard.progressBar}>
        <ProgressBar
          baseBgColor="#F2F2F2"
          bgColor="#FF8000"
          isLabelVisible={false}
          height="4px"
          completed={(amount / limit) * 100}
        />
      </div>
      <div className={stylesPaymentCard.paymentCardRow}>
        <span className={styles.lower}>{`${amountLabel} CHF`}</span>
        <span className={styles.lower}>{`${limitLabel} CHF`}</span>
      </div>
    </div>
  );
};

export default PaymentProgress;
