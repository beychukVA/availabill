import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import React from "react";
import styles from "./ResendEmailCodeModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
}

export const ResendEmailCodeModal: React.FC<IProps> = ({ onClose }) => (
  <div className={styles.container}>
    <span className={styles.title}>
      <Trans>Bestätigungscode</Trans>
    </span>
    <p className={styles.description}>
      <Trans>Wir haben Ihnen einen Bestätigungscode gesendet.</Trans> <br />
      <Trans>Bitte überprüfen Sie Ihre E-Mail-Adresse.</Trans>
    </p>
    <div className={styles.buttonContainer}>
      <Button onClick={() => onClose(false)} width="fit-content" mt={40}>
        {t`schliessen`}
      </Button>
    </div>
  </div>
);
