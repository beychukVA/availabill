import { Button } from "@/components/common/Button/Button";
import { t, Trans } from "@lingui/macro";
import React from "react";
import { useAppSelector } from "@/redux/store";
import clsx from "clsx";
import styles from "./SendedDisableCodeSuccessModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
}

export const SendedDisableCodeSuccessModal: React.FC<IProps> = ({
  onClose,
}) => {
  const { profileTranslations } = useAppSelector((state) => state.translations);

  return (
    <div className={styles.container}>
      <span className={styles.title}>
        {profileTranslations?.confirmDeactivation}
      </span>
      <p className={clsx(styles.description, styles.margin)}>
        {profileTranslations?.confirmDeactivationTxt}
      </p>
      <div className={styles.buttonContainer}>
        <Button
          onClick={() => {
            onClose(false);
          }}
          width="fit-content"
          mt={40}
        >
          {profileTranslations?.closeButton}
        </Button>
      </div>
    </div>
  );
};
