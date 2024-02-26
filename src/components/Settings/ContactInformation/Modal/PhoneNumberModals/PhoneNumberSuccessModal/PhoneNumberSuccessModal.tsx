import { Button } from "@/components/common/Button/Button";
import { t, Trans } from "@lingui/macro";
import clsx from "clsx";
import React from "react";
import styles from "./PhoneNumberSuccessModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
}

export const PhoneNumberSuccessModal: React.FC<IProps> = ({ onClose }) => (
  <div className={styles.container}>
    <span className={styles.title}>
      <Trans>Glückwunsch!</Trans>
    </span>
    <p className={clsx(styles.description, styles.margin)}>
      <Trans>
        &quot;Telefonnummer&quot; ist jetzt Ihre primäre Telefonnummer.
      </Trans>
    </p>
    <div className={styles.buttonContainer}>
      <Button onClick={() => onClose(false)} width="fit-content" mt={40}>
        {t`schliessen`}
      </Button>
    </div>
  </div>
);
