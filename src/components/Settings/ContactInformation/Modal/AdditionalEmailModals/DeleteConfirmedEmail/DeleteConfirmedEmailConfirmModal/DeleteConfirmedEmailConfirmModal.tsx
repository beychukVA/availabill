import { Button } from "@/components/common/Button/Button";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { IUserLogin } from "@/components/Settings/ContactInformation/ContactInformation";
import { useDeleteAdditionalEmailMutation } from "@/redux/User/Profile/profile-slice";
import { Trans, t } from "@lingui/macro";
import React from "react";
import clsx from "clsx";
import styles from "./DeleteConfirmedEmailConfirmModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  deleteEmail: string;
  user: ICurrentUser;
  values: IUserLogin;
  handleServerError: (error: string) => void;
  setDeleteEmail: (email: string) => void;
}

export const DeleteConfirmedEmailConfirmModal: React.FC<IProps> = ({
  onClose,
  deleteEmail,
  user,
  values,
  handleServerError,
  setDeleteEmail,
}) => {
  const [deleteAdditionalEmail] = useDeleteAdditionalEmailMutation();

  const handleConfirmDelete = async () => {
    await deleteAdditionalEmail({
      userId: user?.id,
      email: deleteEmail,
      password: values.password,
      type: "KAR",
    })
      .then((res) => {
        console.log("DELETE: ", res);
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
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Trans>Sind Sie sicher, dass Sie die E-Mail entfernen möchten?</Trans>
      </div>
      <div className={clsx(styles.description, styles.margin)}>
        <Trans>
          Bitte bestätigen Sie, dass “{deleteEmail}” entfernt werden soll.
        </Trans>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="white"
          width="fit-content"
          mt={40}
          mr={16}
          onClick={() => onClose(false)}
        >
          {t`Abbrechen`}
        </Button>
        <Button
          onClick={() => handleConfirmDelete()}
          width="fit-content"
          mt={40}
        >
          {t`Bestätigen`}
        </Button>
      </div>
    </div>
  );
};
