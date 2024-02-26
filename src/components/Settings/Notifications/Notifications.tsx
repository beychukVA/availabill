import {
  CheckBox,
  CheckboxValues,
} from "@/components/common/CheckBox/CheckBox";
import { t, Trans } from "@lingui/macro";
import { useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { useAppSelector } from "@/redux/store";
import styles from "./Notifications.module.scss";

interface IProps {}

export const Notifications: React.FC<IProps> = ({}) => {
  const { profileTranslations } = useAppSelector((state) => state.translations);
  const matches = useMediaQuery("(min-width:1200px)");
  const [values, setValues] = useState({
    newsletterEmail: "no" as CheckboxValues,
    newsletterSms: "no" as CheckboxValues,
    depositEmail: "no" as CheckboxValues,
    depositSms: "no" as CheckboxValues,
  });

  console.log("values: ", values);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        [prop]: event.target.value === "yes" ? "no" : "yes",
      });
    };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{profileTranslations?.notifications}</div>
      <div className={styles.description}>
        {profileTranslations?.receivedRegardlessTxt}
        <br />
        <br />
        {profileTranslations?.importantAdminEmails}
      </div>
      <div className={styles.menuItem}>
        <div className={styles.item}>
          <div className={styles.itemName}>
            {profileTranslations?.newsletter}
          </div>
          <div className={styles.itemDescription}>
            {profileTranslations?.newsletterTxt}
          </div>
        </div>
        <div className={styles.ckeckBoxes}>
          <CheckBox
            ml={matches ? 48 : 0}
            label={profileTranslations?.email!}
            labelPosition="top"
            value={values.newsletterEmail}
            onChange={handleChange}
            anchor="newsletterEmail"
          />
          <CheckBox
            ml={96}
            label={profileTranslations?.sms!}
            labelPosition="top"
            value={values.newsletterSms}
            onChange={handleChange}
            anchor="newsletterSms"
          />
        </div>
      </div>
      <div
        className={styles.menuItem}
        style={{ marginTop: matches ? 27 : 54, marginBottom: matches ? 0 : 30 }}
      >
        <div className={styles.item}>
          <div className={styles.itemName}>
            {profileTranslations?.depositInfo}
          </div>
          <div className={styles.itemDescription}>
            {profileTranslations?.depositInfoTxt}
          </div>
        </div>
        <div className={styles.ckeckBoxes}>
          <CheckBox
            ml={matches ? 48 : 0}
            label={profileTranslations?.email!}
            labelPosition="top"
            value={values.depositEmail}
            onChange={handleChange}
            anchor="depositEmail"
          />
          <CheckBox
            ml={96}
            label={profileTranslations?.sms!}
            labelPosition="top"
            value={values.depositSms}
            onChange={handleChange}
            anchor="depositSms"
          />
        </div>
      </div>
    </div>
  );
};
