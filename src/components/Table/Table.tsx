import React, { useMemo } from "react";
import { IUserTransactions } from "@/redux/User/Accounts/account-slice";
import { Trans } from "@lingui/macro";
import { useAppSelector } from "@/redux/store";
import styles from "./Table.module.scss";
import TableRow from "./TableRow/TableRow";

export const TableComponent = ({
  userTransactions,
}: {
  userTransactions: IUserTransactions[];
}) => {
  const { billsTranslations } = useAppSelector((state) => state.translations);

  const tableColumns = useMemo(
    () => [
      { title: billsTranslations?.date, width: 15 },
      { title: billsTranslations?.dealer, width: 20 },
      { title: billsTranslations?.amount, width: 15 },
      { title: billsTranslations?.dueOn, width: 15 },
      { title: billsTranslations?.invoiceStatus, width: 15 },
      { title: billsTranslations?.invoiceCopy, width: 12 },
      { title: "Actions", width: 8 },
    ],
    [
      billsTranslations?.amount,
      billsTranslations?.date,
      billsTranslations?.dealer,
      billsTranslations?.dueOn,
      billsTranslations?.invoiceCopy,
      billsTranslations?.invoiceStatus,
    ]
  );

  return (
    <div className={styles.container}>
      <table role="table" className={styles.table}>
        <thead className={styles.thead}>
          <tr role="row" className={styles.tr}>
            {tableColumns.map(({ title, width }) => (
              <th
                key={title}
                style={{ width: `${width}%` }}
                className={styles.th}
              >
                {title !== "Actions" && <Trans>{title}</Trans>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {userTransactions.map((transaction) => (
            <TableRow key={transaction.id} transaction={transaction} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
