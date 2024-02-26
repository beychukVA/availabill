import Card from "@/components/common/Card/Card";
import Circle from "@/components/common/Circle/Circle";
import { toFixedAmount } from "@/utils";
import clsx from "clsx";
import React from "react";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import { IUserTransactionsResponse } from "@/redux/User/Accounts/account-slice";
import { Trans } from "@lingui/macro";
import styles from "./TransactionCard.module.scss";

type ICard = {
  status: string;
  noOfTransactions: number;
  amount?: number;
  openTransactions?: IUserTransactionsResponse;
};

const TransactionCard = ({
  status,
  amount = 0,
  noOfTransactions,
  openTransactions,
}: ICard) => {
  const { dashboardTranslations } = useAppSelector(
    (state) => state.translations
  );

  return (
    <Card className={clsx(noOfTransactions === 0 && styles.alignNoData)}>
      <div className={styles.transactionCard}>
        {noOfTransactions > 0 ? (
          <>
            <Link
              className={styles.transactionCard}
              href={{
                pathname: "/bills",
                query: {
                  transactionId: openTransactions?.content
                    ? openTransactions?.content[0]?.id
                    : undefined,
                },
              }}
            >
              <div className={styles.info}>
                <Circle />
                {noOfTransactions} {status}
              </div>
              <div>
                <span className={clsx(styles.amount, styles.currency)}>
                  CHF
                </span>
                <span className={clsx(styles.amount, styles.number)}>
                  {toFixedAmount(amount)}
                </span>
              </div>
            </Link>
          </>
        ) : (
          <div className={styles.noTransactionText}>
            {dashboardTranslations?.noOverdueTxt_1} <Trans>{status}</Trans>{" "}
            {dashboardTranslations?.noOverdueTxt_2}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TransactionCard;
