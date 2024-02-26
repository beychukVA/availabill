import { Button } from "@/components/common/Button/Button";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { useDeletePhoneNumberMutation } from "@/redux/User/Profile/profile-slice";
import { Trans, t } from "@lingui/macro";
import React from "react";
import clsx from "clsx";
import { IUserLogin } from "../../../ContactInformation";
import styles from "./PhoneNumberConfirmDelete.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  handleServerError: (error: string) => void;
  user: ICurrentUser;
  values: IUserLogin;
  updateUI: () => void;
}

export const PhoneNumberConfirmDelete: React.FC<IProps> = ({
  onClose,
  handleServerError,
  user,
  values,
  updateUI,
}) => {
  const [deletePhoneNumber] = useDeletePhoneNumberMutation();

  const handleNext = async () => {
    await deletePhoneNumber({
      userId: user.id,
      password: values.password,
    })
      .unwrap()
      .then((res) => {
        updateUI();
        onClose(false);
      })
      .catch((error) => {
        switch (error.status.toString()[0]) {
          case "4":
            handleServerError(t`Telefonnummer konnte nicht gelöscht werden.`);
            onClose(false);
            return;
          case "5":
            handleServerError(t`Serverfehler`);
            onClose(false);
            return;
          default:
            handleServerError(t`Ein Fehler ist aufgetreten`);
            onClose(false);
        }
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Trans>Löschen der Mobilnummer bestätigen</Trans>
      </div>
      <div className={clsx(styles.description, styles.margin)}>
        <Trans>
          Wenn Sie die Mobilnummer löschen und keine neue Mobilnummer
          hinzufügen, ist das Login zum Portal nur mit Ihrer primären E-Mail
          möglich.
          <br />
          <br />
          Sind Sie sicher, dass Sie die Mobilnummer entfernen möchten?
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
          {t`Abrechen`}
        </Button>
        <Button onClick={() => handleNext()} width="fit-content" mt={40}>
          {t`WEITER`}
        </Button>
      </div>
    </div>
  );
};
