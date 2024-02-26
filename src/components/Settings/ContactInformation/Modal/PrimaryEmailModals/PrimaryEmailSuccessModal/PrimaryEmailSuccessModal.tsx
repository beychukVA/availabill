import React from "react";
import { Trans, t } from "@lingui/macro";
import { Button } from "@/components/common/Button/Button";
import clsx from "clsx";
import styles from "./PrimaryEmailSuccessModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
}

export const PrimaryEmailSuccessModal: React.FC<IProps> = ({ onClose }) => (
  <div className={styles.container}>
    <span className={styles.title}>
      <Trans>Glückwunsch!</Trans>
    </span>
    <p className={clsx(styles.description, styles.margin)}>
      <Trans>“E-Mail-Adresse” ist jetzt Ihre primäre E-Mail.</Trans>
    </p>
    <div className={styles.buttonContainer}>
      <Button onClick={() => onClose(false)} width="fit-content" mt={40}>
        {t`schliessen`}
      </Button>
    </div>
  </div>
);
