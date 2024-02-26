import React, { useMemo } from "react";
import { IUserTransactions } from "@/redux/User/Accounts/account-slice";
import { Trans } from "@lingui/macro";
import styles from "./Table.module.scss";
import TableRow from "./TableRow/TableRow";

export const TableComponent = ({
  year,
  data,
}: {
  year: string;
  data: any[];
}) => {
  const tableColumns = useMemo(
    () => [
      { title: year, width: 16 },
      { title: "", width: 60 },
      { title: "Zinsausweiskopie", width: 16 },
      { title: "Actions", width: 8 },
    ],
    [year]
  );

  return (
    <div className={styles.container}>
      <table role="table" className={styles.table}>
        <thead className={styles.thead}>
          <tr role="row" className={styles.tr}>
            {data.length ? (
              tableColumns.map(({ title, width }) => (
                <th
                  key={title}
                  style={{ width: `${width}%` }}
                  className={styles.th}
                >
                  {title !== "Actions" && <Trans>{title}</Trans>}
                </th>
              ))
            ) : (
              <th
                key={tableColumns[0].title}
                style={{ width: "100%" }}
                className={styles.th}
              >
                <Trans>{tableColumns[0].title}</Trans>
              </th>
            )}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data && data.length ? (
            data.map((item) => <TableRow key={item.id} item={item} />)
          ) : (
            <tr className={styles.tr}>
              <td className={styles.td}>
                Für Zinsausweise die Jahre {year} und früher betreffend sprechen
                Sie bitte unseren Kundenservice an.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
