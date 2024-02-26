import React from "react";
import { Trans } from "@lingui/macro";
import { accordionTableColumns } from "@/utils";
import { IUserLatestTransactions } from "@/redux/User/Accounts/account-slice";
import styles from "./Table.module.scss";
import TableRow from "../TableRow/TableRow";

export const CardTable = ({ data }: { data: IUserLatestTransactions[] }) => (
  <div className={styles.container}>
    <table role="table" className={styles.table}>
      <thead className={styles.thead}>
        <tr role="row" className={styles.tr}>
          {accordionTableColumns.map(({ title, width }) => (
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
        {data.map((item) => (
          <TableRow key={item.id} item={item} />
        ))}
      </tbody>
    </table>
  </div>
);
