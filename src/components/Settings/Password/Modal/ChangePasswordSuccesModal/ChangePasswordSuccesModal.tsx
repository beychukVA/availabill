import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import React from "react";
import clsx from "clsx";
import styles from "./ChangePasswordSuccesModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
}

export const ChangePasswordSuccesModal: React.FC<IProps> = ({ onClose }) => (
  <div className={styles.container}>
    <span className={styles.title}>
      <Trans>Glückwunsch!</Trans>
    </span>
    <p className={clsx(styles.description, styles.margin)}>
      <Trans>Sie haben erfolgreich ein neues Passwort festgelegt</Trans>
    </p>
    <div className={styles.buttonContainer}>
      <Button onClick={() => onClose(false)} width="fit-content" mt={40}>
        {t`schliessen`}
      </Button>
    </div>
  </div>
);
