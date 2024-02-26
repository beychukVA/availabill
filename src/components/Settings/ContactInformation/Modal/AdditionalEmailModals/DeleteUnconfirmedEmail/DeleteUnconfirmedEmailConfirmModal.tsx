import { Button } from "@/components/common/Button/Button";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { useDeleteAdditionalEmailMutation } from "@/redux/User/Profile/profile-slice";
import { Trans, t } from "@lingui/macro";
import React from "react";
import clsx from "clsx";
import styles from "./DeleteUnconfirmedEmailConfirmModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  handleServerError: (error: string) => void;
  deleteEmail: string;
  setDeleteEmail: (email: string) => void;
  user: ICurrentUser;
}

export const DeleteUnconfirmedEmailConfirmModal: React.FC<IProps> = ({
  onClose,
  deleteEmail,
  setDeleteEmail,
  handleServerError,
  user,
}) => {
  const [deleteAdditionalEmail] = useDeleteAdditionalEmailMutation();
  const handleDeleteEmail = async () => {
    if (deleteEmail) {
      await deleteAdditionalEmail({
        userId: user?.id,
        email: deleteEmail,
        type: "KAR",
      })
        .then((res) => {
          setDeleteEmail("");
          onClose(false);
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              handleServerError(
                t`E-Mail-Adresse konnte nicht gelöscht werden. Versuchen Sie es erneut.`
              );
              return;
            case "5":
              handleServerError(t`Serverfehler`);
              return;
            default:
              handleServerError(t`Ein Fehler ist aufgetreten`);
          }
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Trans>Sie möchten die E-Mail entfernen</Trans>
      </div>
      <div className={clsx(styles.description, styles.margin)}>
        <Trans>
          {`Bitte bestätigen Sie, dass die “${deleteEmail}” entfernt werden
          soll.`}
        </Trans>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="white"
          width="fit-content"
          mt={40}
          mr={16}
          onClick={() => {
            setDeleteEmail("");
            onClose(false);
          }}
        >
          {t`Abrechen`}
        </Button>
        <Button onClick={() => handleDeleteEmail()} width="fit-content" mt={40}>
          {t`Weiter`}
        </Button>
      </div>
    </div>
  );
};
