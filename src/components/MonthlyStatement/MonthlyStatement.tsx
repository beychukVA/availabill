import React from "react";
import { AddNewCardIcon } from "@/components/Icons/AddNewCardIcon/AddNewCardIcon";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import BillsHeading from "../BillsHeading/BillsHeading";
import styles from "./MonthlyStatement.module.scss";

const MonthlyStatement = () => {
  const { billsTranslations } = useAppSelector((state) => state.translations);

  const AddNewCardLink = {
    pathname: "/cards",
    query: { scrollTo: "AddNewCardSection" },
  };

  return (
    <div className={styles.monthlyStatement}>
      <Link style={{ color: "#222222" }} href={AddNewCardLink}>
        <BillsHeading
          icon={<AddNewCardIcon />}
          title={billsTranslations?.addCard!}
        />
      </Link>
      <p className={styles.statementMain}>
        {billsTranslations?.mediaMarktMonthlyStats}
      </p>
      <p className={styles.statementSub}>
        <span>{billsTranslations?.registerMediaMarktCard_1}</span>
        <Link href={AddNewCardLink}>
          <span className={styles.statementHighlight}>
            {" "}
            {billsTranslations?.addCard}{" "}
          </span>
        </Link>
        <span>{billsTranslations?.registerMediaMarktCard_2}</span>
      </p>
    </div>
  );
};

export default MonthlyStatement;
