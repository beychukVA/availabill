import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import { Input } from "@/components/common/Input/Input";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import {
  useForgotLoginPasswordMutation,
  useGetCurrentUserQuery,
} from "@/redux/Auth/auth-slice";
import React, { useState, useEffect, SetStateAction } from "react";
import { z } from "zod";
import { Error } from "@/components/Error/Error";
import { useAppSelector } from "@/redux/store";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import styles from "./ForgotPasswordEmailModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  openSuccess: (isOpen: boolean) => void;
  openResetForm: (isOpen: boolean) => void;
  handleResendEmail: (email: string) => void;
  isOpen: boolean;
  setForgotPassword?: (isForgot: SetStateAction<boolean>) => void;
}

const emailSchema = z.string().email(t`E-Mail ist nicht korrekt`);

export const ForgotPasswordEmailModal: React.FC<IProps> = ({
  onClose,
  openSuccess,
  openResetForm,
  handleResendEmail,
  isOpen,
  setForgotPassword,
}) => {
  const token = useAppSelector((state) => state.user.token);

  const { data: user, refetch } = useGetCurrentUserQuery(token);
  const { onboardingTranslations } = useAppSelector(
    (state) => state.translations
  );
  const [
    forgotLoginPassword,
    { isError: isForgotPasswordError, error: forgotPasswordError },
  ] = useForgotLoginPasswordMutation();
  const [errors, setErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [values, setValues] = useState({
    email: user?.email || "",
  });

  const enterPressed = useKeyPress(PressedKey.ENTER);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleNext = async () => {
    const validationEmail = emailSchema.safeParse(values.email);
    if (!validationEmail.success) {
      const emailErros = validationEmail.error.format();
      setErrors(emailErros);
    } else {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      await forgotLoginPassword({
        email: values.email,
      })
        .unwrap()
        .then((res) => {
          handleResendEmail(values.email);
          openSuccess(true);
          onClose(false);
          if (setForgotPassword) setForgotPassword(false);
          setValues({ ...values, email: "" });
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              setServerErrors({
                _errors: [
                  t`Der Bestätigungscode konnte nicht gesendet werden. Bitte versuchen Sie es erneut`,
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

  const handleIHaveCode = () => {
    openResetForm(true);
    onClose(false);
    if (setForgotPassword) setForgotPassword(false);
  };

  return (
    <div className={styles.container}>
      <span className={styles.title}>
        {onboardingTranslations?.addAnEmailTxt}
      </span>
      <div className={styles.margin}>
        <p className={styles.description}>
          <Trans>{onboardingTranslations?.addAnEmailDesc}</Trans>
        </p>
        {serverErrors._errors[0] && (
          <Error>{serverErrors._errors.join(", ")}</Error>
        )}
        <Input
          mt={48}
          label={onboardingTranslations?.emailLabelLogin}
          type="email"
          placeholder={t`E-Mail`}
          textError={errors._errors.join(", ")}
          value={values.email}
          anchor="email"
          onChange={handleChange}
          editable={false}
        />
        <TransparentButton
          mt={20}
          color="secondary"
          width="fit-content"
          onClick={handleIHaveCode}
        >
          {onboardingTranslations?.alreadyHaveCodeTxt}
        </TransparentButton>
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={handleNext} width="fit-content" mt={40}>
          {onboardingTranslations?.sendTxt}
        </Button>
      </div>
    </div>
  );
};
