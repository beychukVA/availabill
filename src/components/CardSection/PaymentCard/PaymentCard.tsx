import Card from "@/components/common/Card/Card";
import Image from "next/image";
import React from "react";
import { Trans, t } from "@lingui/macro";

import clsx from "clsx";
import { toFixedAmount } from "@/utils";
import { useAppSelector } from "@/redux/store";
import { RoundPlusIcon } from "@/components/Icons/RoundPlusIcon/RoundPlusIcon";
import styles from "./PaymentCard.module.scss";
import PaymentCardImage from "../../../assets/images/payment_card.png";
import { VerifiedCard } from "../../Icons/VerifiedCard/VerifiedCard";

const PaymentCard = ({ cardTotalAmount }: { cardTotalAmount: number }) => {
  const { dashboardTranslations } = useAppSelector(
    (state) => state.translations
  );

  return (
    <Card
      className={clsx(
        styles.card,
        cardTotalAmount === 0 &&
          clsx(styles.centerAmount, styles.paddingRightZero)
      )}
    >
      {cardTotalAmount ? (
        <>
          <div className={clsx(styles.paymentCardRow, styles.bottomGap15)}>
            <Image
              className={styles.paymentCard}
              src={PaymentCardImage}
              alt={t`Payment card`}
              width={30}
              height={20}
            />
            <div className={styles.verifiedCard}>
              <VerifiedCard />
            </div>
          </div>
          <div className={clsx(styles.paymentCardRow, styles.bottomGap8)}>
            <span className={styles.text}>{dashboardTranslations?.amount}</span>
            <div className={styles.overflowEllipsis}>
              <span className={clsx(styles.amount, styles.currency)}>CHF</span>
              <span
                data-testid="paymentCardTotalAmount"
                className={clsx(styles.amount, styles.number)}
              >
                {toFixedAmount(cardTotalAmount)}
              </span>
            </div>
          </div>
          <div className={styles.paymentCardRow}>
            <span className={styles.text}>
              {dashboardTranslations?.lastTransactionAt}
            </span>{" "}
            <span className={styles.date}>3.01.2023</span>
          </div>
        </>
      ) : (
        <Card className={styles.cardsBlockCard}>
          <div>
            <Image
              className={styles.paymentCard}
              src={PaymentCardImage}
              alt={t`Payment card`}
              width={58}
              height={36}
            />
            <h5>
              <Trans>MediaMarkt CLUB Shopping Card</Trans>
            </h5>
            <span className={styles.note}>
              <Trans>Mit dem Portal verbinden.</Trans>
            </span>
          </div>
          <div className={styles.plusBlock}>
            <RoundPlusIcon />
          </div>
        </Card>
      )}
    </Card>
  );
};

export default PaymentCard;
