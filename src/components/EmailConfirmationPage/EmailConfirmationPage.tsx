import { useConfirmAdditionalEmailMutation } from "@/redux/User/Profile/profile-slice";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Error } from "../Error/Error";
import { Loading } from "../Loading/Loading";
import styles from "./EmailConfirmationPage.module.scss";

interface IProps {}

// https://availabill-dashboard.vercel.app/email-confirmation?code=9XNO1R8WTS2GQXAD

export const EmailConfirmationPage: React.FC<IProps> = ({}) => {
  const [confirmAdditionalEmail] = useConfirmAdditionalEmailMutation();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    setLoading(true);
    const handleConfirm = async () => {
      await confirmAdditionalEmail({ code: code?.toString()! })
        .unwrap()
        .then((res) => {
          setLoading(false);
          router.push("/profile");
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
        });
    };

    handleConfirm();
  }, []);

  return (
    <div className={styles.container}>
      {error ? (
        <div>
          <Error>Beim Verifizierungsprozess ist ein Fehler aufgetreten</Error>
        </div>
      ) : (
        <span>E-Mail-Bestätigung läuft...</span>
      )}
      {isLoading && <Loading className={styles.loader} />}
    </div>
  );
};
