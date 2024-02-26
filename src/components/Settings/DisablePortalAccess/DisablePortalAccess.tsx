import { Button } from "@/components/common/Button/Button";
import { Modal } from "@/components/common/Modal/Modal";
import { RoundCloseIcon } from "@/components/Icons/RoundCloseIcon/RoundCloseIcon";
import { t, Trans } from "@lingui/macro";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { ToastError } from "@/components/Toasts/ToastError/ToastError";
import { useRequestDeactivationAccountMutation } from "@/redux/User/Profile/profile-slice";
import styles from "./DisablePortalAccess.module.scss";
import { DisablePortalCodeModal } from "./Modal/DisablePortalCodeModal/DisablePortalCodeModal";
import { SendedDisableCodeSuccessModal } from "./Modal/SendedDisableCodeSuccessModal/SendedDisableCodeSuccessModal";

interface IProps {
  user: ICurrentUser;
}

export const DisablePortalAccess: React.FC<IProps> = ({ user }) => {
  const [requestDeactivationAccount] = useRequestDeactivationAccountMutation();
  const { profileTranslations } = useAppSelector((state) => state.translations);
  const [
    isSendedDisableCodeSuccessModalOpen,
    setSendedDisableCodeSuccessModalOpen,
  ] = useState(false);
  const [isDisablePortalCodeModalOpen, setDisablePortalCodeModalOpen] =
    useState(false);
  const [isToastErrorOpen, setToastErrorOpen] = useState(false);
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });

  useEffect(() => {
    if (serverErrors._errors[0]) {
      setToastErrorOpen(true);
    }
  }, [serverErrors._errors]);

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setServerErrors({ _errors: [] });
    setToastErrorOpen(false);
  };

  const handleServerError = (error: string) => {
    setServerErrors({
      _errors: [error],
    });
  };

  const handleDisablePortal = async () => {
    await requestDeactivationAccount({
      userId: user?.id,
    })
      .unwrap()
      .then((res) => {
        setSendedDisableCodeSuccessModalOpen(true);
        console.log("sent successfully: ", res);
      })
      .catch((error) => {
        switch (error.status.toString()[0]) {
          case "4":
            handleServerError(
              t`Daten konnten nicht gesendet werden. versuchen Sie es nochmal.`
            );
            return;
          case "5":
            handleServerError(t`Serverfehler`);
            return;
          default:
            handleServerError(t`Ein Fehler ist aufgetreten`);
        }
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {profileTranslations?.deactivatePortal}
      </div>
      <div className={styles.description}>
        {profileTranslations?.deactivatePortalExplained}
        <br />
        <br />
        <br />
        {profileTranslations?.deactivatePortalTxt}
      </div>
      <Button
        mt={0}
        mb={0}
        ml={0}
        mr={0}
        pt={14}
        pb={14}
        width="fit-content"
        icon={<RoundCloseIcon />}
        onClick={handleDisablePortal}
      >
        {profileTranslations?.deactivatePortalBtn}
      </Button>
      <Modal
        isModalOpen={isSendedDisableCodeSuccessModalOpen}
        onClose={setSendedDisableCodeSuccessModalOpen}
      >
        <SendedDisableCodeSuccessModal
          onClose={setSendedDisableCodeSuccessModalOpen}
        />
      </Modal>
      <Modal
        isModalOpen={isDisablePortalCodeModalOpen}
        onClose={setDisablePortalCodeModalOpen}
      >
        <DisablePortalCodeModal onClose={setDisablePortalCodeModalOpen} />
      </Modal>
      <ToastError
        message={serverErrors._errors.join(", ")}
        duration={6000}
        open={isToastErrorOpen}
        handleClose={handleCloseToast}
      />
    </div>
  );
};
