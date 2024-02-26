/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  useMediaQuery,
} from "@mui/material";
import { Trans } from "@lingui/macro";
import clsx from "clsx";
import { Loading } from "@/components/Loading/Loading";
import { ChevronDownIcon } from "@/components/Icons/ChevronDownIcon/ChevronDownIcon";
import {
  INotificationList,
  useGetNotificationQuery,
} from "@/redux/User/Notifications/notifications-slice";
import { IInboxTableColumns } from "@/utility/types";
import { useAppSelector } from "@/redux/store";
import styles from "../Table.module.scss";

const TableRow = ({
  message,
  inboxTableColumns,
}: {
  message: INotificationList;
  inboxTableColumns: IInboxTableColumns[];
}) => {
  const matches = useMediaQuery("(min-width:1200px)");
  const { inboxTranslations } = useAppSelector((state) => state.translations);
  const [expanded, setExpanded] = useState(false);
  const notificationId = message.id || 1;

  const {
    data: notification,
    isLoading,
    isError,
  } = useGetNotificationQuery(notificationId, {
    skip: !expanded,
  });

  const messageDetails = useMemo(() => {
    if (expanded) {
      if (isLoading) {
        <div className={styles.spinnerTd}>
          <Loading className={styles.spinner} />
        </div>;
      }

      if (isError) {
        <div className={styles.spinnerTd}>
          <p>Something went wrong</p>
        </div>;
      }

      if (notification) {
        return (
          <div
            className={styles.accordionContent}
            style={{
              width: matches
                ? `calc(${inboxTableColumns[0].width}% + ${inboxTableColumns[1].width}%)`
                : "100%",
              paddingLeft: matches
                ? `calc(${inboxTableColumns[0].width}% + 12px)`
                : "12px",
            }}
          >
            <h5>{inboxTranslations?.message}</h5>
            <p>{notification.body}</p>
          </div>
        );
      }
    }

    return null;
  }, [expanded, inboxTranslations?.message, isError, isLoading, notification]);

  return (
    <>
      <tr role="row" className={styles.tr}>
        <td role="cell" className={styles.td}>
          <div
            className={clsx(styles.tdBlock, styles.centered)}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <span className={styles.mobileHeader}>
              <Trans>{inboxTableColumns[0].title}</Trans>
            </span>
            <div className={clsx(styles.chevron, expanded && styles.expanded)}>
              <ChevronDownIcon />
            </div>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{inboxTableColumns[1].title}</Trans>
            </span>
            <div className={styles.overflowEllipsis}>
              <span className={styles.bold}>{message.title}</span>
            </div>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{inboxTableColumns[2].title}</Trans>
            </span>
            <span className={styles.date}>
              {format(new Date(message.date), "dd.MM.yyyy")}
            </span>
          </div>
        </td>
      </tr>
      <tr className={styles.tr}>
        <td
          colSpan={inboxTableColumns.length}
          className={clsx(styles.smallTableTd, "isLoading" && styles.loadingTd)}
        >
          <Accordion expanded={expanded} square sx={{ boxShadow: "none" }}>
            <AccordionSummary hidden sx={{ display: "none" }} />
            <AccordionDetails sx={{ padding: 0, border: 0, boxShadow: "none" }}>
              {messageDetails}
            </AccordionDetails>
          </Accordion>
        </td>
      </tr>
    </>
  );
};

export default TableRow;
