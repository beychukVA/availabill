import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import { Input } from "@/components/common/Input/Input";
import { useSetNewPasswordMutation } from "@/redux/Auth/auth-slice";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Error } from "@/components/Error/Error";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useAppSelector } from "@/redux/store";
import styles from "./ForgotPasswordFormModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  resendEmail: string;
  isOpen: boolean;
}

const resetFormSchema = z.object({
  code: z
    .string()
    .max(16, t`Zulässige Zeichenanzahl (16)`)
    .regex(/[\dA-Z]{8}/, { message: t`Ungültiger Code` }),
  password: z
    .string()
    .min(8, t`Erlaubte Mindestanzahl an Zeichen (8)`)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}/, {
      message: t`Das Passwort muss mindestens ein Sonderzeichen und einen Großbuchstaben enthalten`,
    }),
});

export const ForgotPasswordFormModal: React.FC<IProps> = ({
  onClose,
  resendEmail,
  isOpen,
}) => {
  const { onboardingTranslations } = useAppSelector(
    (state) => state.translations
  );
  const [
    setNewPassword,
    { isError: isOneTimePasswordError, error: oneTimePasswordError },
  ] = useSetNewPasswordMutation();
  const [values, setValues] = useState({
    code: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    z.ZodFormattedError<
      {
        code: string;
        password: string;
      },
      string
    >
  >({ _errors: [] });
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });

  const enterPressed = useKeyPress(PressedKey.ENTER);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleNext = async () => {
    const validationForm = resetFormSchema.safeParse({
      code: values.code,
      password: values.password,
    });
    if (!validationForm.success) {
      const codeErros = validationForm.error.format();
      setErrors(codeErros);
    } else {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      await setNewPassword({
        code: values.code,
        password: values.password,
      })
        .unwrap()
        .then((res) => {
          setErrors({ _errors: [] });
          setServerErrors({ _errors: [] });
          onClose(false);
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              setServerErrors({
                _errors: [
                  t`Daten konnten nicht gesendet werden. versuchen Sie es nochmal`,
                ],
              });
              return;
            case "5":
              setServerErrors({ _errors: [t`Serverfehler`] });
              return;
            default:
              setServerErrors({ _errors: [t`Ein Fehler ist aufgetreten`] });
          }
        });
    }
  };

  useEffect(() => {
    if (isOpen && enterPressed) {
      handleNext();
    }
  }, [enterPressed]);

  return (
    <div className={styles.container}>
      <span className={styles.title}>
        {onboardingTranslations?.forgotPasswordFormTitle}
      </span>
      <div className={styles.margin}>
        <div className={styles.back}>
          <span className={styles.description}>
            {onboardingTranslations?.weHaveGivenYouConfirmationCode_1} <br />
            &nbsp;
            <span className={styles.email}>
              {resendEmail || t`deine E-Mail`}
            </span>
            &nbsp; {onboardingTranslations?.weHaveGivenYouConfirmationCode_2}
          </span>
        </div>
        {serverErrors._errors[0] && (
          <Error>{serverErrors._errors.join(", ")}</Error>
        )}
        <div className={styles.inputsContainer}>
          <Input
            mt={48}
            label={onboardingTranslations?.enterConfirmationCodeLabel}
            type="code"
            placeholder="-- -- -- --"
            textError={errors.code?._errors.join(", ")}
            value={values.code}
            anchor="code"
            onChange={handleChange}
          />
          <Input
            mt={48}
            label={onboardingTranslations?.enterNewPasswordLabel}
            type="password"
            placeholder={onboardingTranslations?.enterNewPasswordPlaceholder}
            textError={errors.password?._errors.join(", ")}
            value={values.password}
            anchor="password"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="white"
          width="fit-content"
          mt={40}
          mr={16}
          onClick={() => onClose(false)}
        >
          {onboardingTranslations?.newPasswordBtnCancel}
        </Button>
        <Button onClick={handleNext} width="fit-content" mt={40}>
          {onboardingTranslations?.newPasswordBtnSend}
        </Button>
      </div>
    </div>
  );
};
