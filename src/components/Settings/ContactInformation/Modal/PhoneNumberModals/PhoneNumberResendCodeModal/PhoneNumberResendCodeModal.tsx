import { Button } from "@/components/common/Button/Button";
import { t, Trans } from "@lingui/macro";
import clsx from "clsx";
import React from "react";
import styles from "./PhoneNumberResendCodeModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  openCodeModal?: (isOpen: boolean) => void;
}

export const PhoneNumberResendCodeModal: React.FC<IProps> = ({
  onClose,
  openCodeModal = (isOpen: boolean) => {},
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
