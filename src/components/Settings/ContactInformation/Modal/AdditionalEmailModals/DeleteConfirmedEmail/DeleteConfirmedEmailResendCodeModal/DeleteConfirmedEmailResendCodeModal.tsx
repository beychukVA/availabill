import { Button } from "@/components/common/Button/Button";
import { t, Trans } from "@lingui/macro";
import React from "react";
import clsx from "clsx";
import styles from "./DeleteConfirmedEmailResendCodeModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  openCodeModal?: (isOpen: boolean) => void;
}

export const DeleteConfirmedEmailResendCodeModal: React.FC<IProps> = ({
  onClose,
  openCodeModal = () => {},
}) => {
  const handleClose = () => {
    openCodeModal(true);
    onClose(false);
  };

  return (
    <div className={styles.container}>
      <span className={styles.title}>
        <Trans>Passwort anfordern</Trans>
      </span>
      <p className={clsx(styles.description, styles.margin)}>
        <Trans>Wir haben Ihnen erneut einen Bestätigungscode gesendet.</Trans>
      </p>
      <div className={styles.buttonContainer}>
        <Button onClick={handleClose} width="fit-content" mt={40}>
          {t`schliessen`}
        </Button>
      </div>
    </div>
  );
};
