import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useConfirmNewPhoneNumberMutation } from "@/redux/User/Profile/profile-slice";
import { Trans, t } from "@lingui/macro";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { z } from "zod";
import { useAppSelector } from "@/redux/store";
import { IUserLogin } from "../../../ContactInformation";
import styles from "./NewPhoneNumberCodeModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  user: ICurrentUser;
  updateUI: () => void;
  handleServerError: (error: string) => void;
  values: IUserLogin;
  setValues: (prop: string, value: string) => void;
  openResendCodeSucces: (isOpen: boolean) => void;
  showSuccessModal: (isOpen: boolean) => void;
  setOneTimeCodeReference: Dispatch<SetStateAction<string>>;
  setPasswordType: Dispatch<SetStateAction<string>>;
  refetchOneTimeCode: any;
}

const codeSchema = z
  .string()
  .max(6, t`Maximal zulässige Zeichenanzahl (6)`)
  .regex(/[\dA-Z]{6}/, { message: t`Ungültiger Code` });

export const NewPhoneNumberCodeModal: React.FC<IProps> = ({
  onClose,
  user,
  updateUI,
  handleServerError,
  values,
  setValues,
  openResendCodeSucces,
  showSuccessModal,
  setOneTimeCodeReference,
  refetchOneTimeCode,
  setPasswordType,
}) => {
  const { profileTranslations } = useAppSelector((state) => state.translations);
  const [confirmNewPhoneNumber] = useConfirmNewPhoneNumberMutation();
  const [errors, setErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const enterPressed = useKeyPress(PressedKey.ENTER);

  useEffect(() => {
    setOneTimeCodeReference(values.phoneNumber);
    setPasswordType("PHONE_NUMBER_CONFIRMATION");

    return () => {
      setPasswordType("");
      setOneTimeCodeReference("");
    };
  }, [setOneTimeCodeReference, setPasswordType, values.phoneNumber]);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setValues(prop, event.target.value);
    };

  const handleNext = async () => {
    const validationCode = codeSchema.safeParse(
      values.newPhoneConfirmationCode
    );
    if (!validationCode.success) {
      const codeErros = validationCode.error.format();
      setErrors(codeErros);
    } else {
      setErrors({ _errors: [] });
      await confirmNewPhoneNumber({
        userId: user?.id,
        code: values.newPhoneConfirmationCode,
      })
        .unwrap()
        .then(() => {
          showSuccessModal(true);
          setValues("phoneNumber", "");
          updateUI();
          onClose(false);
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              handleServerError(t`Falscher Code. Versuchen Sie es erneut`);
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

  useEffect(() => {
    if (enterPressed) {
      handleNext();
    }
  }, [enterPressed]);

  const handleResendCode = async () => {
    if (values.token) {
      await refetchOneTimeCode()
        .unwrap()
        .then(() => {})
        .catch((error: any) => {
          switch (error.status.toString()[0]) {
            case "4":
              handleServerError(
                t`Daten konnten nicht gesendet werden. versuchen Sie es nochmal`
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
    <div className={styles.container}>
      <div className={styles.title}>
        {profileTranslations?.phoneModalConfirmNumber}
      </div>
      <div className={styles.margin}>
        <div className={styles.description}>
          <Trans>
            Bitte geben Sie den Code ein, den wir Ihnen {values.phoneNumber}{" "}
            gesendet haben.
          </Trans>
        </div>
        <Input
          mt={48}
          label={t`Code eingeben`}
          type="code"
          placeholder="-- -- -- --"
          textError={errors._errors.join(", ")}
          value={values.newPhoneConfirmationCode}
          anchor="newPhoneConfirmationCode"
          onChange={handleChange}
        />
        <span className={styles.retry}>
          {profileTranslations?.didNotReceiveCode} <br />
          <TransparentButton
            color="secondary"
            mt={4}
            onClick={handleResendCode}
          >
            {t`Code erneut senden`}
          </TransparentButton>
        </span>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="white"
          width="fit-content"
          mt={40}
          mr={16}
          onClick={() => onClose(false)}
        >
          {t`Abrechen`}
        </Button>
        <Button onClick={() => handleNext()} width="fit-content" mt={40}>
          {t`WEITER`}
        </Button>
      </div>
    </div>
  );
};
