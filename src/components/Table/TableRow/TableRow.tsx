/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  IUserTransactions,
  useGetTransactionsBasketQuery,
} from "@/redux/User/Accounts/account-slice";
import { format } from "date-fns";
import { InvoiceStatusColor, tableColumns, toFixedAmount } from "@/utils";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { Trans } from "@lingui/macro";
import clsx from "clsx";
import { ThreeDots } from "@/components/common/ThreeDots/ThreeDots";
import { useAppSelector } from "@/redux/store";
import { Loading } from "@/components/Loading/Loading";
import { ObjectToInvoiceModal } from "@/components/OnboardingSteps/Login/Modal/ObjectToInvoiceModal/ObjectToInvoiceModal";
import { ExtendPaymentPeriodModal } from "@/components/OnboardingSteps/Login/Modal/ExtendPaymentPeriodModal/ExtendPaymentPeriodModal";
import { useRouter } from "next/router";
import Circle from "../../common/Circle/Circle";
import { DownloadTransactionIcon } from "../../Icons/DownloadTransactionIcon/DownloadTransactionIcon";
import PaymentCardImage from "../../../assets/images/payment_card.png";
import styles from "../Table.module.scss";
import { RoundCloseIcon } from "../../Icons/RoundCloseIcon/RoundCloseIcon";

const TableRow = ({ transaction }: { transaction: IUserTransactions }) => {
  const token = useAppSelector((state) => state.user.token);
  const router = useRouter();
  const { query } = router;
  const currTransactionId = query.transactionId?.toString();
  const { billsTranslations } = useAppSelector((state) => state.translations);
  const [expanded, setExpanded] = useState(
    currTransactionId ? currTransactionId === transaction.id.toString() : false
  );

  const [invoiceTransactionId, setInvoiceTransactionId] = useState<
    number | null
  >(null);

  const [paymentPeriodTransactionId, setPaymentPeriodTransactionId] = useState<
    number | null
  >(null);

  const { data: transactionBasket, isLoading } = useGetTransactionsBasketQuery(
    {
      token,
      transactionId: transaction.id,
    },
    { skip: !expanded }
  );

  const objectToInvoice = (transactionId: number) => {
    setInvoiceTransactionId(transactionId);
  };

  const extendPaymentPeriod = (transactionId: number) => {
    setPaymentPeriodTransactionId(transactionId);
  };

  const getStatus = (value: string) => {
    const status = billsTranslations?.filterByAccountStatus.find(
      (item) => item.value === value
    );
    return status ? status.name : "";
  };

  const checkDate = (end: string) => {
    const currDate = new Date();
    const dueDate = new Date(end);
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = dueDate.getTime() - currDate.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    return diffInDays >= 5;
  };

  const statusActions = useMemo(() => {
    switch (transaction.status) {
      case "OPEN":
        return [true, checkDate(transaction.dueDate), true];
      case "PARTIAL":
        return [true, false, false];
      case "FULL":
        return [false, false, false];
      case "CANCELLED":
        return [false, false, false];
      case "OVERDUE":
        return [true, false, false];
      case "UNKNOWN":
        return [false, false, false];

      default:
        return [false, false, false];
    }
  }, [transaction.dueDate, transaction.status]);

  return (
    <>
      <tr
        role="row"
        className={styles.tr}
        data-testid="tableRow"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{tableColumns[0].title}</Trans>
            </span>
            <span>
              {format(new Date(transaction.creationDate), "dd.MM.yyyy")}
            </span>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{tableColumns[1].title}</Trans>
            </span>
            <div className={styles.imageBlock}>
              <Image
                className={styles.paymentCard}
                src={PaymentCardImage}
                alt="Payment card"
                width={30}
                height={20}
              />
              <span>{transaction.merchant.name}</span>
            </div>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{tableColumns[2].title}</Trans>
            </span>
            <span>CHF {toFixedAmount(transaction.amount)}</span>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{tableColumns[3].title}</Trans>
            </span>
            <span>{format(new Date(transaction.dueDate), "dd.MM.yyyy")}</span>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{tableColumns[4].title}</Trans>
            </span>
            <div className={styles.offenBlock}>
              <span data-testid="tableTransactionStatus">
                {getStatus(transaction.status)}
              </span>
              <Circle color={InvoiceStatusColor[transaction.status]} />
            </div>
          </div>
        </td>
        <td
          role="cell"
          className={styles.td}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{tableColumns[5].title}</Trans>
            </span>
            <div className={styles.right}>
              <a
                href={`/api/pdf?id=${transaction.id}&token=${token}`}
                download={`${transaction.id}.pdf`}
              >
                <DownloadTransactionIcon />
              </a>
            </div>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={clsx(styles.tdBlock, styles.centered)}>
            <span className={styles.mobileHeader}>
              <Trans>{tableColumns[6].title}</Trans>
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
          colSpan={tableColumns.length}
          className={clsx(styles.smallTableTd, isLoading && styles.loadingTd)}
        >
          <Accordion expanded={expanded} square sx={{ boxShadow: "none" }}>
            <AccordionSummary hidden sx={{ display: "none" }} />
            <AccordionDetails sx={{ padding: 0, border: 0, boxShadow: "none" }}>
              <table className={styles.innerTable}>
                <thead className={styles.thead}>
                  <tr role="row" className={styles.tr}>
                    <th style={{ width: `${tableColumns[0].width}%` }} />
                    <th style={{ width: `${tableColumns[1].width}%` }} />
                    <th
                      style={{
                        width: `${
                          tableColumns[2].width + tableColumns[3].width
                        }%`,
                      }}
                    />
                    <th
                      style={{
                        width: `${
                          tableColumns[4].width + tableColumns[5].width
                        }%`,
                      }}
                    />
                    <th style={{ width: `${tableColumns[6].width}%` }} />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {isLoading ? (
                      <td
                        colSpan={tableColumns.length}
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
                            <h5>{billsTranslations?.authorizationNumber}</h5>
                            <span>{transaction.transactionNo}</span>
                          </div>
                          <div
                            className={clsx(styles.textBlock, styles.wordBreak)}
                          >
                            <h5>{billsTranslations?.email}</h5>
                            <span>{transaction.merchant.email}</span>
                          </div>
                        </td>
                        <td className={styles.td}>
                          <div className={styles.inlineTextBlock}>
                            <h5>{billsTranslations?.purchaseFrom} </h5>
                            <span>
                              {format(
                                new Date(transaction.creationDate),
                                "d.MM.yyyy"
                              )}
                            </span>
                          </div>
                          {transactionBasket?.content.length && (
                            <>
                              <h5>{billsTranslations?.orderedItems}</h5>
                              {transactionBasket?.content.map((item) => (
                                <div
                                  key={item.id}
                                  className={styles.smallInnerTable}
                                >
                                  <div className={styles.overflowEllipsis}>
                                    {item.quantity} x
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
                              <div
                                className={clsx(
                                  styles.inlineTextBlock,
                                  styles.gesamtBlock
                                )}
                              >
                                <h5>{billsTranslations?.inTotal}</h5>
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
                          <h5>
                            05.02.2023 Zahlungsfrist um 15 Tage verlängert
                          </h5>
                        </td>
                        <td className={styles.td}>
                          <div
                            className={clsx(
                              styles.innerActions,
                              statusActions[0] ? "" : styles.disabled
                            )}
                          >
                            <span className={styles.normal}>
                              {billsTranslations?.showPaymentInfo}
                            </span>
                            <ThreeDots color="#848484" />
                          </div>
                          <div
                            onClick={() => extendPaymentPeriod(transaction.id)}
                            className={clsx(
                              styles.innerActions,
                              statusActions[1] ? "" : styles.disabled
                            )}
                          >
                            <span>
                              {billsTranslations?.extendPaymentPeriod}
                            </span>
                            <ThreeDots color="#848484" />
                          </div>
                          <div
                            onClick={() => objectToInvoice(transaction.id)}
                            className={clsx(
                              styles.innerActions,
                              statusActions[2] ? "" : styles.disabled
                            )}
                          >
                            <span>{billsTranslations?.objectToInvoice}</span>
                            <ThreeDots color="#848484" />
                          </div>
                        </td>
                        <td className={styles.td} />
                        {invoiceTransactionId && (
                          <ObjectToInvoiceModal
                            transactionId={invoiceTransactionId!}
                            setPortalActive={setInvoiceTransactionId}
                          />
                        )}
                        {paymentPeriodTransactionId && (
                          <ExtendPaymentPeriodModal
                            transactionId={paymentPeriodTransactionId!}
                            setPortalActive={setPaymentPeriodTransactionId}
                          />
                        )}
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
