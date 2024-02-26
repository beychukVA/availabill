import React from "react";
import { Trans, t } from "@lingui/macro";
import { Button } from "@/components/common/Button/Button";
import clsx from "clsx";
import styles from "./PrimaryResendCodeModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  openCodeModal?: () => void;
}

export const PrimaryResendCodeModal: React.FC<IProps> = ({
  onClose,
  openCodeModal = () => {},
}) => {
  const handleClose = () => {
    openCodeModal();
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
