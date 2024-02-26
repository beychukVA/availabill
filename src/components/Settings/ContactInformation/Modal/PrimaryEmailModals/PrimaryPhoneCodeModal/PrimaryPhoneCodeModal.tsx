import React, { useEffect, useState } from "react";
import { Trans, t } from "@lingui/macro";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { Input } from "@/components/common/Input/Input";
import { z } from "zod";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import {
  useConfirmLoginMutation,
  useOneTimePasswordMutation,
} from "@/redux/Auth/auth-slice";
import { Button } from "@/components/common/Button/Button";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { token } from "@/redux/Auth/auth-actions";
import { useChangePrimaryEmailMutation } from "@/redux/User/Profile/profile-slice";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { IUserLogin } from "../../../ContactInformation";
import styles from "./PrimaryPhoneCodeModal.module.scss";

const codeSchema = z
  .string()
  .max(6, t`Maximal zulässige Zeichenanzahl (6)`)
  .regex(/[\dA-Z]{6}/, { message: t`Ungültiger Code` });

interface IProps {
  primaryEmail: string;
  onClose: (isOpen: boolean) => void;
  isOpen: boolean;
  user: ICurrentUser | undefined;
  updateUI: () => void;
  handleServerError: (error: string) => void;
  values: IUserLogin;
  setValues: (prop: string, value: string) => void;
  openResendCodeSucces: (isOpen: boolean) => void;
  showSuccessModal: (isOpen: boolean) => void;
  showConfirmCodeModal: (isOpen: boolean) => void;
}

export const PrimaryPhoneCodeModal: React.FC<IProps> = ({
  primaryEmail,
  onClose,
  isOpen,
  user,
  updateUI,
  handleServerError,
  values,
  setValues,
  openResendCodeSucces,
  showSuccessModal,
  showConfirmCodeModal,
}) => {
  const { profileTranslations } = useAppSelector((state) => state.translations);
  const [
    oneTimePassword,
    { isError: isOneTimePasswordError, error: oneTimePasswordError },
  ] = useOneTimePasswordMutation();
  const [confirmLogin, { isError, error }] = useConfirmLoginMutation();
  const [
    changePrimaryEmail,
    { isError: isChangePrimaryEmailError, error: changePrimaryEmailError },
  ] = useChangePrimaryEmailMutation();
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const enterPressed = useKeyPress(PressedKey.ENTER);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setValues(prop, event.target.value);
    };

  const handleNext = async () => {
    const validationCode = codeSchema.safeParse(values.emailCode);
    if (!validationCode.success) {
      const codeErros = validationCode.error.format();
      setErrors(codeErros);
    } else {
      setErrors({ _errors: [] });
      await confirmLogin({
        access_token: values.token,
        code: values.emailCode,
      })
        .unwrap()
        .then(async (res) => {
          if (res.access_token) {
            dispatch(token(res.access_token, res.expires_at));
            await changePrimaryEmail({
              userId: user?.id,
              email: primaryEmail,
            })
              .unwrap()
              .then((res) => {
                showConfirmCodeModal(true);
                onClose(false);
              })
              .catch((error) => {
                switch (error.status.toString()[0]) {
                  case "4":
                    handleServerError(
                      t`Primäre E-Mail-Adresse konnte nicht zugewiesen werden`
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
    if (enterPressed && isOpen) {
      handleNext();
    }
  }, [enterPressed]);

  const handleResendCode = async () => {
    if (values.token) {
      await oneTimePassword({
        reference: values.token,
        passwordType: "LOGIN",
      })
        .unwrap()
        .then((res) => {
          openResendCodeSucces(true);
        })
        .catch((error) => {
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
        <Trans>Geben Sie den SMS Code</Trans>
      </div>
      <div className={styles.margin}>
        <div className={styles.description}>
          <Trans>
            Bitte geben Sie den Code ein, den wir Ihnen an Ihre Mobilnummer
            gesendet haben.
          </Trans>
        </div>
        <Input
          mt={48}
          label={t`Code eingeben`}
          type="code"
          placeholder="-- -- -- --"
          textError={errors._errors.join(", ")}
          value={values.emailCode}
          anchor="emailCode"
          onChange={handleChange}
        />
        <span className={styles.retry}>
          {profileTranslations?.didNotReceiveCode}
          <br />
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
