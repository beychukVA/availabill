import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import { Trans, t } from "@lingui/macro";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import clsx from "clsx";
import styles from "./AddEmailConfirmationModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  handleServerError: (error: string) => void;
  showEditEmailModal: (isOpen: boolean) => void;
  setCurrAdditionEmail: (email: string) => void;
  updateUI: () => void;
  currAdditionEmail: string;
  isEditCurrEmail: boolean;
  setEditCurrEmail: (isEdit: boolean) => void;
  setOneTimeCodeReference: Dispatch<SetStateAction<string>>;
  refetchOneTimeCode: any;
}

export const AddEmailConfirmationModal: React.FC<IProps> = ({
  onClose,
  handleServerError,
  showEditEmailModal,
  setCurrAdditionEmail,
  updateUI,
  currAdditionEmail,
  isEditCurrEmail,
  setEditCurrEmail,
  setOneTimeCodeReference,
  refetchOneTimeCode,
}) => {
  const { profileTranslations } = useAppSelector((state) => state.translations);
  const [values, setValues] = useState({
    code: "",
  });

  useEffect(() => {
    setOneTimeCodeReference(currAdditionEmail);

    return () => {
      setOneTimeCodeReference("");
    };
  }, [currAdditionEmail, setOneTimeCodeReference]);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleBack = () => {
    showEditEmailModal(true);
    updateUI();
    onClose(false);
  };

  const handleClose = () => {
    setCurrAdditionEmail("");
    updateUI();

    if (isEditCurrEmail) {
      setEditCurrEmail(false);
    }

    setValues({ code: "" });
    onClose(false);
  };

  const handleResendCode = async () => {
    if (currAdditionEmail) {
      await refetchOneTimeCode()
        .unwrap()
        .then((res: any) => {
          console.log("code sent successfully: ", res);
          // setForgotPasswordCodeModalOpen(true);
        })
        .catch((error: any) => {
          switch (error.status.toString()[0]) {
            case "4":
              handleServerError(
                t`Bestätigungscode konnte nicht gesendet werden. Versuchen Sie es nochmal.`
              );
              return;
            case "5":
              handleServerError(t`Serverfehler`);
              return;
            default:
              handleServerError(t`Ein Fehler ist aufgetreten`);
          }
        });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          {profileTranslations?.confirmYourEmail}
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}
        >
          <span className={clsx(styles.description, styles.margin)}>
            {profileTranslations?.confirmYourEmailSubtitle1} “
            {currAdditionEmail}”{" "}
            {profileTranslations?.confirmYourEmailSubtitle2}
          </span>
          <TransparentButton mt={4} color="secondary" onClick={handleBack}>
            {profileTranslations?.confirmYourEmailChangeBtn}
          </TransparentButton>
        </div>
        <span className={clsx(styles.description, styles.margin)}>
          {profileTranslations?.confirmYourEmailDesc1}
        </span>
        <br />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className={clsx(styles.description, styles.margin)}>
            {profileTranslations?.confirmYourEmailDesc2}
          </span>
          <TransparentButton
            mt={4}
            color="secondary"
            onClick={handleResendCode}
          >
            {profileTranslations?.confirmYourEmailResendBtn}
          </TransparentButton>
        </div>
        <div className={styles.buttonContainer}>
          <div data-testid="addNewEmailButtonClose">
            <Button onClick={() => handleClose()} width="fit-content" mt={40}>
              {profileTranslations?.confirmYourEmailCloseBtn}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
