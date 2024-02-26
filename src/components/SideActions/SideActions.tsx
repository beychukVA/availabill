import React from "react";
import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import { LetterIcon } from "../Icons/LetterIcon/LetterIcon";
import { QuestionMarkIcon } from "../Icons/QuestionMarkIcon/QuestionMarkIcon";
import styles from "./SideActions.module.scss";

export const SideActions = () => {
  const token = useAppSelector((state) => state.user.token);
  const { data: user } = useGetCurrentUserQuery(token);

  // if (!user) {
  //   return null;
  // }

  return (
    <div className={styles.actions}>
      <Link href="/qa" className={styles.icon}>
        <QuestionMarkIcon />
      </Link>
      <Link href="/contact-us" className={styles.icon}>
        <LetterIcon />
      </Link>
    </div>
  );
};
