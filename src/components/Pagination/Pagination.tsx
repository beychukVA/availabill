import React, { Dispatch, SetStateAction } from "react";
import MUIPagination from "@mui/material/Pagination";
import clsx from "clsx";
import styles from "./Pagination.module.scss";

export const Pagination = ({
  count,
  page,
  className,
  handleChange,
  showAllTxt,
  showMoreTxt,
}: {
  count: number;
  page: number;
  className: string;
  showAllTxt?: string;
  showMoreTxt?: string;
  handleChange: Dispatch<SetStateAction<number>>;
}) => (
  <div className={styles.paginationBlock}>
    <div className={clsx(styles.container, className)}>
      <MUIPagination
        count={count}
        classes={{ ul: styles.ul }}
        variant="outlined"
        page={page}
        onChange={(_, page) => handleChange(page - 1)}
        shape="rounded"
        hideNextButton
        hidePrevButton
      />
      {showMoreTxt && (
        <div className={styles.button} onClick={() => handleChange(page + 1)}>
          {showMoreTxt}
        </div>
      )}
      {showAllTxt && <div className={styles.button}>{showAllTxt}</div>}
    </div>
  </div>
);
