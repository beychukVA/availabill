import React, { useMemo } from "react";
import { Trans } from "@lingui/macro";
import { INotificationList } from "@/redux/User/Notifications/notifications-slice";
import { IInboxTableColumns } from "@/utility/types";
import { useAppSelector } from "@/redux/store";
import styles from "./Table.module.scss";
import TableRow from "./TableRow/TableRow";

export const InboxTableComponent = ({
  inboxData,
}: {
  inboxData: INotificationList[];
}) => {
  const { inboxTranslations } = useAppSelector((state) => state.translations);
  const inboxTableColumns: IInboxTableColumns[] = useMemo(
    () => [
      { title: "Actions", width: 5 },
      { title: inboxTranslations?.title, width: 75 },
      { title: inboxTranslations?.date, width: 20 },
    ],
    [inboxTranslations?.date, inboxTranslations?.title]
  );

  return (
    <div className={styles.container}>
      <table role="table" className={styles.table}>
        <thead className={styles.thead}>
          <tr role="row" className={styles.tr}>
            {inboxTableColumns.map(({ title, width }) => (
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
          {inboxData.map((message) => (
            <TableRow
              key={message.id}
              message={message}
              inboxTableColumns={inboxTableColumns}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
