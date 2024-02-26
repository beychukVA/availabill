import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import React, { useEffect } from "react";
import clsx from "clsx";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import styles from "./ForgotPasswordCodeModal.module.scss";

interface IProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  openResetForm?: (isOpen: boolean) => void;
}

export const ForgotPasswordCodeModal: React.FC<IProps> = ({
  isOpen,
  onClose,
  openResetForm = () => {},
}) => {
  const enterPressed = useKeyPress(PressedKey.ENTER);

  const handleClose = () => {
    openResetForm(true);
    onClose(false);
  };

  useEffect(() => {
    if (isOpen && enterPressed) {
      handleClose();
    }
  }, [enterPressed]);

  return (
    <div className={styles.container}>
      <span className={styles.title}>
        <Trans>Passwort anfordern</Trans>
      </span>
      <p className={clsx(styles.description, styles.margin)}>
        <Trans>Wir haben Ihnen einen Code an die von Ihnen angegebene</Trans>
        <br />
        <Trans>E-Mail-Adresse gesendet. Bitte überprüfen Sie Ihre Post.</Trans>
      </p>
      <div className={styles.buttonContainer}>
        <Button onClick={handleClose} width="fit-content" mt={40}>
          {t`schliessen`}
        </Button>
      </div>
    </div>
  );
};
