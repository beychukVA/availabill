import { Button } from "@/components/common/Button/Button";
import { NeedMoreHelp } from "@/components/NeedMoreHelp/NeedMoreHelp";
import { ToastError } from "@/components/Toasts/ToastError/ToastError";
import { token } from "@/redux/Auth/auth-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useDeleteAccountMutation } from "@/redux/User/Profile/profile-slice";
import { t } from "@lingui/macro";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./DisableAccountConfirmation.module.scss";

interface IProps {
  contentImage: string;
}

// http://localhost:3000/disable-account?userId=5&code=W9BDDQXWOROAT78X

export const DisableAccountConfirmation: React.FC<IProps> = ({
  contentImage = "",
}) => {
  const { disableAccountConfirmation, qaTranslations } = useAppSelector(
    (state) => state.translations
  );
  const [deleteAccount] = useDeleteAccountMutation();
  const dispatch = useAppDispatch();
  const [isToastErrorOpen, setToastErrorOpen] = useState(false);
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });

  const router = useRouter();
  const { userId, code } = router.query;

  useEffect(() => {
    if (serverErrors._errors[0]) {
      setToastErrorOpen(true);
    }
  }, [serverErrors._errors]);

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setServerErrors({ _errors: [] });
    setToastErrorOpen(false);
  };

  const handleServerError = (error: string) => {
    setServerErrors({
      _errors: [error],
    });
  };

  const confirmDeactivation = async () => {
    await deleteAccount({
      userId: +userId?.toString()!,
      code: code?.toString()!,
    })
      .unwrap()
      .then((res) => {
        dispatch(token("", ""));
        router.push("/disable-account-success");
      })
      .catch((error) => {
        switch (error.status.toString()[0]) {
          case "4":
            handleServerError(
              t`Daten konnten nicht gesendet werden. versuchen Sie es nochmal.`
            );
            return;
          case "5":
            handleServerError(t`Serverfehler`);
            return;
          default:
            handleServerError(t`Ein Fehler ist aufgetreten`);
        }
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <div className={styles.sectionTitle}>
          <span className={styles.title}>
            {disableAccountConfirmation?.title}
          </span>
        </div>
        <div className={styles.sectionImg}>
          <img src={contentImage} alt="" className={styles.contentImg} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.description}>
          <ReactMarkdown>
            {disableAccountConfirmation?.description || ""}
          </ReactMarkdown>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            onClick={() => confirmDeactivation()}
            width="fit-content"
            mt={60}
          >
            {disableAccountConfirmation?.deactivationBtn}
          </Button>
        </div>
        <div className={styles.needHelp}>
          <NeedMoreHelp qaTranslations={qaTranslations} />
        </div>
      </div>
      <ToastError
        message={serverErrors._errors.join(", ")}
        duration={6000}
        open={isToastErrorOpen}
        handleClose={handleCloseToast}
      />
    </div>
  );
};
