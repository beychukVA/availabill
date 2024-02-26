import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import { Input } from "@/components/common/Input/Input";
import { Modal } from "@/components/common/Modal/Modal";
import { SectionTitle } from "@/components/common/SectionTitle/SectionTitle";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import {
  useOneTimePasswordCodeQuery,
  useOneTimePasswordMutation,
  useRegisterCodeMutation,
} from "@/redux/Auth/auth-slice";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Error } from "@/components/Error/Error";
import { Snackbar, Alert, useMediaQuery } from "@mui/material";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useAppSelector } from "@/redux/store";
import { RegistrationStepsEnum } from "../../lib/RegistrationStepsEnum";
import { ResendEmailCodeModal } from "../Modal/ResendEmailCodeModal/ResendEmailCodeModal";
import { IDate, IStepProps } from "../types/IRegistration";
import styles from "./RegistrationEmailConfirmationStep.module.scss";

const codeSchema = z
  .string()
  .max(6, t`Maximal zulässige Zeichenanzahl (6)`)
  .regex(/[\dA-Z]{6}/, { message: t`Ungültiger Code` });

export const RegistrationEmailConfirmationStep: React.FC<IStepProps> = ({
  step,
  setStep,
  data,
  setData,
}) => {
  const { onboardingTranslations } = useAppSelector(
    (state) => state.translations
  );
  const matches = useMediaQuery("(min-width:1200px)");
  const [
    oneTimePassword,
    { isError: isOneTimePasswordError, error: oneTimePasswordError },
  ] = useOneTimePasswordMutation();
  const [
    registerCode,
    { isError: isRegisterCodeError, error: registerCodeError },
  ] = useRegisterCodeMutation();
  const [errors, setErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [values, setValues] = useState<IDate>({
    email: data.email,
    emailCode: data.emailCode,
    onboardingCode: data.onboardingCode,
    mobile: data.mobile,
    mobileConfirmCode: data.mobileConfirmCode,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
    gender: data.gender,
    firstName: data.firstName,
    lastName: data.lastName,
    birthday: data.birthday,
  });
  const [resendCodeModalOpen, setResendCodeModalOpen] = useState(false);

  const { data: tempOneTimePasswordCode } = useOneTimePasswordCodeQuery(
    { reference: data.email },
    {
      skip: !data.email,
      refetchOnMountOrArgChange: false,
      refetchOnReconnect: false,
      refetchOnFocus: false,
    }
  );
  const enterPressed = useKeyPress(PressedKey.ENTER);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      setValues({ ...values, [prop]: event.target.value });
      setData((prev) => ({
        ...prev,
        [prop]: event.target.value,
      }));
    };

  const handleNext = async () => {
    const validationCode = codeSchema.safeParse(values.emailCode);
    if (!validationCode.success) {
      const codeErros = validationCode.error.format();
      setErrors(codeErros);
    } else {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      await registerCode({
        code: values.emailCode,
      })
        .unwrap()
        .then((res) => {
          if (res) {
            setValues({
              ...values,
              onboardingCode: res?.code,
            });
            setData((prev) => ({
              ...prev,
              onboardingCode: res?.code,
            }));
            setStep(RegistrationStepsEnum.REGISTRATION_MOBILE);
          }
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              setServerErrors({
                _errors: [t`Falscher Code. Versuchen Sie es erneut`],
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
    if (enterPressed) {
      handleNext();
    }
  }, [enterPressed]);

  const handleResendCode = async () => {
    if (values.email) {
      await oneTimePassword({
        reference: values.email,
        passwordType: "REGISTRATION",
      })
        .unwrap()
        .then((res) => {
          setErrors({ _errors: [] });
          setServerErrors({ _errors: [] });
          setResendCodeModalOpen(true);
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

  const handleBack = () => {
    setStep(RegistrationStepsEnum.REGISTRATION_EMAIL);
  };

  return (
    <div className={styles.container}>
      <SectionTitle>{onboardingTranslations?.confirmYourEmail}</SectionTitle>
      <div className={styles.back}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className={styles.description}>
            {onboardingTranslations?.confirmationCodeAtEmail_1}
            &nbsp;
            <span className={styles.email}>{values.email}</span>
            &nbsp; {onboardingTranslations?.confirmationCodeAtEmail_2}&nbsp;
          </span>
          <TransparentButton color="secondary" onClick={handleBack}>
            {onboardingTranslations?.changeMobileNumberCTA}
          </TransparentButton>
        </div>
      </div>
      {serverErrors._errors[0] && (
        <Error>{serverErrors._errors.join(", ")}</Error>
      )}
      <Input
        mt={56}
        label={onboardingTranslations?.confirmationCodeLabel}
        type="code"
        placeholder="-- -- -- --"
        textError={errors._errors.join(", ")}
        value={values.emailCode}
        anchor="emailCode"
        onChange={handleChange}
      />
      <span className={styles.retry}>
        {onboardingTranslations?.didNotReceiveEmailQuestion}
        &nbsp;
        <TransparentButton color="secondary" onClick={handleResendCode}>
          {onboardingTranslations?.resendCodeCTA}
        </TransparentButton>
      </span>
      <Button
        mt={35}
        pt={matches ? 8 : 14}
        pr={20}
        pb={matches ? 8 : 14}
        pl={20}
        onClick={handleNext}
      >
        {onboardingTranslations?.sendCTA}
      </Button>
      <Modal isModalOpen={resendCodeModalOpen} onClose={setResendCodeModalOpen}>
        <ResendEmailCodeModal onClose={setResendCodeModalOpen} />
      </Modal>
      {tempOneTimePasswordCode?.code && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Your code is: {tempOneTimePasswordCode?.code}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};
