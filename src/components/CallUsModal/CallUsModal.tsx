import { IQATranslations } from "@/utility/types";
import React from "react";
import styles from "./CallUsModal.module.scss";

interface IProps {
  qaTranslations: IQATranslations | null;
  onClose: (isOpen: boolean) => void;
  isOpen: boolean;
}

export const CallUsModal: React.FC<IProps> = ({
  isOpen,
  onClose,
  qaTranslations,
}) => (
  <div className={styles.container}>
    <span className={styles.title}>{qaTranslations?.callUsModalTitle}</span>
    <div className={styles.content}>
      <div className={styles.row}>
        <span>{qaTranslations?.youCanContactUsBy}</span>
        <a
          className={styles.highlight}
          href={`tel:${qaTranslations?.phoneNumber}`}
        >
          {qaTranslations?.phoneNumber}
        </a>
      </div>
      <div className={styles.delimiter} />
      <div className={styles.row}>
        <span>{qaTranslations?.ourOpeningHours}</span>
        <div className={styles.hours}>
          <span className={styles.bold}>
            {qaTranslations?.hoursMondayToFriday}
          </span>
          <span className={styles.bold}>{qaTranslations?.hoursSaturday}</span>
        </div>
      </div>
      <div className={styles.row} style={{ marginTop: "24px" }}>
        {qaTranslations?.textNoteCallUsModal}
      </div>
    </div>
  </div>
);
