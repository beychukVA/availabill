import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import React from "react";
import clsx from "clsx";
import { useAppSelector } from "@/redux/store";
import styles from "./PasswordInfoModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
}

export const PasswordInfoModal: React.FC<IProps> = ({ onClose }) => {
  const { profileTranslations } = useAppSelector((state) => state.translations);

  return (
    <div className={styles.container}>
      <span className={styles.title}>
        <Trans>{profileTranslations?.passwordInfoTitle}</Trans>
      </span>
      <p className={clsx(styles.description, styles.margin)}>
        <Trans>{profileTranslations?.passwordInfoDescription}</Trans>
      </p>
      <div className={styles.buttonContainer}>
        <Button onClick={() => onClose(false)} width="fit-content" mt={40}>
          {t`schliessen`}
        </Button>
      </div>
    </div>
  );
};
