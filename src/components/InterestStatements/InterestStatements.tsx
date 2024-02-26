import React from "react";
import { ChartIcon } from "@/components/Icons/ChartIcon/ChartIcon";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import BillsHeading from "../BillsHeading/BillsHeading";
import styles from "./InterestStatements.module.scss";

const InterestStatements = () => {
  const { billsTranslations } = useAppSelector((state) => state.translations);

  return (
    <div className={styles.interestStatements}>
      <Link style={{ color: "#222222" }} href="/tax">
        <BillsHeading
          icon={<ChartIcon />}
          title={billsTranslations?.interestStatements!}
        />
      </Link>
      <p className={styles.interestText}>
        {billsTranslations?.interestStatementsInfo}
      </p>
    </div>
  );
};

export default InterestStatements;
