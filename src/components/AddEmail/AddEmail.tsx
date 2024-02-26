import React from "react";
import { AddEmailIcon } from "@/components/Icons/AddEmailIcon/AddEmailIcon";
import { useAppSelector } from "@/redux/store";
import styles from "./AddEmail.module.scss";
import BillsHeading from "../BillsHeading/BillsHeading";

const AddEmail = ({
  openAddEmailModal,
}: {
  openAddEmailModal: (isOpen: boolean) => void;
}) => {
  const { billsTranslations } = useAppSelector((state) => state.translations);

  return (
    <div className={styles.addEmailWrapper}>
      <div
        className={styles.addEmailButton}
        onClick={() => openAddEmailModal(true)}
      >
        <BillsHeading
          icon={<AddEmailIcon />}
          title={billsTranslations?.addEmailAddress!}
        />
      </div>
      <div className={styles.addEmailDescWrapper}>
        <span className={styles.addEmailDescHeading}>
          {billsTranslations?.cantFindAllInvoices}
        </span>
        <p className={styles.addEmailDesc}>
          {billsTranslations?.perhapsMultiEmails}
        </p>
        <p className={styles.addEmailCTA}>
          {billsTranslations?.addEmailAddresses}
        </p>
      </div>
    </div>
  );
};

export default AddEmail;
