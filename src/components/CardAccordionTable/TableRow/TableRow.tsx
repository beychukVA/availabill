/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { accordionTableColumns, hideCardNumber, toFixedAmount } from "@/utils";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { Trans } from "@lingui/macro";
import clsx from "clsx";
import { Loading } from "@/components/Loading/Loading";
import { ChevronDownIcon } from "@/components/Icons/ChevronDownIcon/ChevronDownIcon";
import {
  INotificationList,
  useGetNotificationQuery,
} from "@/redux/User/Notifications/notifications-slice";
import { RoundCloseIcon } from "@/components/Icons/RoundCloseIcon/RoundCloseIcon";
import { ThreeDots } from "@/components/common/ThreeDots/ThreeDots";
import {
  IUserLatestTransactions,
  useGetTransactionsBasketQuery,
} from "@/redux/User/Accounts/account-slice";
import { WarningIcon } from "@/components/Icons/WarningIcon/WarningIcon";
import { useAppSelector } from "@/redux/store";
import styles from "../Table/Table.module.scss";

const TableRow = ({ item }: { item: IUserLatestTransactions }) => {
  const token = useAppSelector((state) => state.user.token);
  const [expanded, setExpanded] = useState(false);

  const { data: transactionBasket, isLoading } = useGetTransactionsBasketQuery(
    {
      token,
      transactionId: item.id,
    },
    { skip: !expanded }
  );

  return (
    <>
      <tr role="row" className={styles.tr}>
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{accordionTableColumns[0].title}</Trans>
            </span>
            <span>{format(new Date(item.creationDate), "dd.MM.yyyy")}</span>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={clsx(styles.tdBlock, styles.centered)}>
            <span className={styles.mobileHeader}>
              <Trans>{accordionTableColumns[1].title}</Trans>
            </span>
            <span>{item.store}</span>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{accordionTableColumns[2].title}</Trans>
            </span>
            <div className={styles.overflowEllipsis}>
              <span>CHF {toFixedAmount(item.amount)}</span>
            </div>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{accordionTableColumns[3].title}</Trans>
            </span>
            <div className={styles.overflowEllipsis}>
              <span>{hideCardNumber(item.token.token)}</span>
            </div>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div
            className={clsx(styles.tdBlock, styles.centered)}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <span className={styles.mobileHeader}>
              <Trans>{accordionTableColumns[4].title}</Trans>
            </span>
            <div className={styles.actionBlock}>
              {expanded ? (
                <div className={styles.closeBlock}>
                  <RoundCloseIcon color="#222222" />
                </div>
              ) : (
                <ThreeDots color="#848484" />
              )}
            </div>
          </div>
        </td>
      </tr>
      <tr className={styles.tr}>
        <td
          colSpan={accordionTableColumns.length}
          className={clsx(styles.smallTableTd, isLoading && styles.loadingTd)}
        >
          <Accordion expanded={expanded} square sx={{ boxShadow: "none" }}>
            <AccordionSummary hidden sx={{ display: "none" }} />
            <AccordionDetails sx={{ padding: 0, border: 0, boxShadow: "none" }}>
              <table className={styles.innerTable}>
                <thead className={styles.thead}>
                  <tr role="row" className={styles.tr}>
                    <th
                      style={{
                        width: `${accordionTableColumns[0].width - 10}%`,
                      }}
                    />
                    <th
                      style={{
                        width: `${accordionTableColumns[1].width + 5}%`,
                      }}
                    />
                    <th
                      style={{
                        width: `${accordionTableColumns[2].width + 5}%`,
                      }}
                    />
                    <th
                      style={{
                        width: `${accordionTableColumns[3].width}%`,
                      }}
                    />
                    <th
                      style={{ width: `${accordionTableColumns[4].width}%` }}
                    />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {isLoading ? (
                      <td
                        colSpan={accordionTableColumns.length}
                        className={styles.spinnerTd}
                      >
                        <Loading className={styles.spinner} />
                      </td>
                    ) : (
                      <>
                        <td className={styles.td} />
                        <td className={styles.td}>
                          <div
                            className={clsx(styles.textBlock, styles.wordBreak)}
                          >
                            <h5>Rechnungs-/Autorisierungsnummer</h5>
                            <span>{item.transactionNo}</span>
                          </div>
                        </td>
                        <td
                          className={clsx(styles.td, styles.transactionBasket)}
                        >
                          <div className={styles.inlineTextBlock}>
                            <h5>Einkauf vom: </h5>
                            <span>
                              {format(new Date(item.creationDate), "d.MM.yyyy")}
                            </span>
                          </div>
                          {transactionBasket?.content.length && (
                            <>
                              <div>
                                <h5>Artikel: </h5>
                                {transactionBasket?.content.map((item) => (
                                  <div
                                    key={item.id}
                                    className={styles.smallInnerTable}
                                  >
                                    <div className={styles.overflowEllipsis}>
                                      {item.quantity}x
                                    </div>
                                    <div className={styles.overflowEllipsis}>
                                      {item.article}
                                    </div>
                                    <div
                                      className={styles.overflowEllipsis}
                                    >{`CHF ${toFixedAmount(
                                      item.singleAmount
                                    )}`}</div>
                                  </div>
                                ))}
                              </div>
                              <div
                                className={clsx(
                                  styles.inlineTextBlock,
                                  styles.gesamtBlock
                                )}
                              >
                                <h5>Gesamtsumme: </h5>
                                <span>
                                  {`CHF ${toFixedAmount(
                                    transactionBasket.content.reduce(
                                      (acc: number, cur) => acc + cur.amount,
                                      0
                                    )
                                  )}`}
                                </span>
                              </div>
                            </>
                          )}
                        </td>
                        <td className={styles.td}>
                          <div className={styles.textIconBlock}>
                            <span>Transaktion beanstanden</span>
                            <WarningIcon />
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </AccordionDetails>
          </Accordion>
        </td>
      </tr>
    </>
  );
};

export default TableRow;
