import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import { Input } from "@/components/common/Input/Input";
import { Modal } from "@/components/common/Modal/Modal";
import { SectionTitle } from "@/components/common/SectionTitle/SectionTitle";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import { token } from "@/redux/Auth/auth-actions";
import {
  useConfirmLoginMutation,
  useOneTimePasswordCodeQuery,
  useOneTimePasswordMutation,
} from "@/redux/Auth/auth-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Error } from "@/components/Error/Error";
import { Alert, Snackbar, useMediaQuery } from "@mui/material";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { LoginStepsEnum } from "../../lib/LoginStepEnum";
import { ForgotPasswordCodeModal } from "../Modal/ForgotPasswordCodeModal/ForgotPasswordCodeModal";
import { IDate, IStepProps } from "../types/ILogin";
import styles from "./LoginEmailConfirmationStep.module.scss";

interface IProps {}

const codeSchema = z
  .string()
  .max(6, t`Maximal zulässige Zeichenanzahl (6)`)
  .regex(/[\dA-Z]{6}/, { message: t`Ungültiger Code` });

export const LoginEmailConfirmationStep: React.FC<IStepProps> = ({
  step,
  setStep,
  data,
  setData,
  handleChangeMenu,
  menu,
}) => {
  const { onboardingTranslations } = useAppSelector(
    (state) => state.translations
  );

  const matches = useMediaQuery("(min-width:1200px)");
  const [oneTimePassword] = useOneTimePasswordMutation();
  const [confirmLogin, { isError, error }] = useConfirmLoginMutation();
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [values, setValues] = useState<IDate>({
    email: data.email,
    emailCode: data.emailCode,
    password: data.password,
    token: data.token,
    resendEmail: data.resendEmail,
  });

  const enterPressed = useKeyPress(PressedKey.ENTER);

  const { data: tempOneTimePasswordCode } = useOneTimePasswordCodeQuery(
    { reference: values.token },
    { skip: !values.token }
  );

  const [isForgotPasswordCodeModalOpen, setForgotPasswordCodeModalOpen] =
    useState<boolean>(false);

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
      await confirmLogin({
        access_token: values.token,
        code: values.emailCode,
      })
        .unwrap()
        .then((res) => {
          if (res.access_token) {
            dispatch(token(res.access_token, res.expires_at));
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
    if (!isForgotPasswordCodeModalOpen && enterPressed) {
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
          setForgotPasswordCodeModalOpen(true);
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

  const handleBack = () => {
    setStep(LoginStepsEnum.LOGIN_EMAIL);
  };

  return (
    <div className={styles.container}>
      <SectionTitle>
        {onboardingTranslations?.enterYourConfirmationCode}
      </SectionTitle>
      <div className={styles.back}>
        <span className={styles.description}>
          {onboardingTranslations?.weHaveGivenYouConfirmationCode_1}
          &nbsp;
          <span className={styles.email}>{values.email}</span>&nbsp;
          {onboardingTranslations?.weHaveGivenYouConfirmationCode_2}
        </span>
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
        {onboardingTranslations?.didNotReceiveEmailQuestion} &nbsp;
        <TransparentButton color="secondary" mt={19} onClick={handleResendCode}>
          {onboardingTranslations?.resendCodeTxt}
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
        {onboardingTranslations?.sendTxt}
      </Button>
      <Modal
        isModalOpen={isForgotPasswordCodeModalOpen}
        onClose={setForgotPasswordCodeModalOpen}
      >
        <ForgotPasswordCodeModal
          onClose={setForgotPasswordCodeModalOpen}
          isOpen={isForgotPasswordCodeModalOpen}
        />
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
