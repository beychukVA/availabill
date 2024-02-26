/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { tableColumns } from "@/utils";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { Trans } from "@lingui/macro";
import { clsx } from "clsx";
import { ThreeDots } from "@/components/common/ThreeDots/ThreeDots";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/router";
import { DownloadTransactionIcon } from "../../Icons/DownloadTransactionIcon/DownloadTransactionIcon";
import styles from "../Table.module.scss";
import { RoundCloseIcon } from "../../Icons/RoundCloseIcon/RoundCloseIcon";

const TableRow = ({ item }: { item: any }) => {
  const token = useAppSelector((state) => state.user.token);
  const router = useRouter();
  const { query } = router;
  const currTransactionId = query.transactionId?.toString();
  const { billsTranslations } = useAppSelector((state) => state.translations);
  const [expanded, setExpanded] = useState(
    currTransactionId ? currTransactionId === item.id.toString() : false
  );
  const [pdfLoaded, setPdfLoaded] = useState(false);

  useEffect(() => {
    if (expanded && !pdfLoaded) {
      setPdfLoaded(true);
    }
  }, [expanded, pdfLoaded]);

  return (
    <>
      <tr role="row" className={styles.tr} data-testid="tableRow">
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{tableColumns[0].title}</Trans>
            </span>
            <span>{format(new Date(item.creationDate), "d. MMMM yyyy")}</span>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={styles.tdBlock}>
            <span className={styles.mobileHeader}>
              <Trans>{tableColumns[1].title}</Trans>
            </span>
            <div className={styles.imageBlock}>
              <span>{item.merchant.name}</span>
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
            <a
              href={`/api/pdf?id=${item.id}&token=${token}`}
              download={`${item.id}.pdf`}
            >
              <DownloadTransactionIcon />
            </a>
          </div>
        </td>
        <td role="cell" className={styles.td}>
          <div className={clsx(styles.tdBlock, styles.centered)}>
            <span className={styles.mobileHeader}>
              <Trans>{tableColumns[6].title}</Trans>
            </span>
            <div
              className={styles.actionBlock}
              onClick={() => setExpanded((prev) => !prev)}
            >
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
        <td colSpan={tableColumns.length} className={clsx(styles.smallTableTd)}>
          <Accordion expanded={expanded} square sx={{ boxShadow: "none" }}>
            <AccordionSummary hidden sx={{ display: "none" }} />
            <AccordionDetails sx={{ padding: 0, border: 0, boxShadow: "none" }}>
              <div className={styles.innerTable}>
                {pdfLoaded && (
                  <embed
                    src={`/api/pdf?id=${item.id}&token=${token}`}
                    type="application/pdf"
                    width="100%"
                    height="1000px"
                  />
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        </td>
      </tr>
    </>
  );
};

export default TableRow;
