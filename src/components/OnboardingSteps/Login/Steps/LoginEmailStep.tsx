import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import { Input } from "@/components/common/Input/Input";
import { Modal } from "@/components/common/Modal/Modal";
import { SectionTitle } from "@/components/common/SectionTitle/SectionTitle";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import { useLoginMutation } from "@/redux/Auth/auth-slice";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Error } from "@/components/Error/Error";
import { useMediaQuery } from "@mui/material";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useAppSelector } from "@/redux/store";
import { LoginStepsEnum } from "../../lib/LoginStepEnum";
import { ForgotPasswordCodeModal } from "../Modal/ForgotPasswordCodeModal/ForgotPasswordCodeModal";
import { ForgotPasswordEmailModal } from "../Modal/ForgotPasswordEmailModal/ForgotPasswordEmailModal";
import { ForgotPasswordFormModal } from "../Modal/ForgotPasswordFormModal/ForgotPasswordFormModal";
import { IDate, IStepProps } from "../types/ILogin";
import styles from "./LoginEmailStep.module.scss";

const loginFormSchema = z.object({
  email: z.string().email(t`E-Mail ist nicht korrekt`),
  //  password: z
  //    .string()
  //    .min(8)
  //    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}/, {
  //      message: "Invalid password",
  //    }),
});

export const LoginEmailStep: React.FC<IStepProps> = ({
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
  const [login, { isError: isLoginError, error: loginError }] =
    useLoginMutation();
  const [errors, setErrors] = useState<
    z.ZodFormattedError<
      {
        email: string;
        password: string;
      },
      string
    >
  >({ _errors: [] });
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [isForgotPasswordCodeModalOpen, setForgotPasswordCodeModalOpen] =
    useState<boolean>(false);
  const [isForgotEmailModalOpen, setForgotEmailModalOpen] =
    useState<boolean>(false);
  const [isForgotFormModalOpen, setForgotFormModalOpen] =
    useState<boolean>(false);
  const [values, setValues] = useState<IDate>({
    email: data.email,
    emailCode: data.emailCode,
    password: data.password,
    token: data.token,
    resendEmail: data.resendEmail,
  });
  const enterPressed = useKeyPress(PressedKey.ENTER);

  const handleAccessToken = (token: string) => {
    setValues({ ...values, token });
    setData((prev) => ({
      ...prev,
      token,
    }));
  };

  const handleNext = async () => {
    const validationLoginForm = loginFormSchema.safeParse({
      email: values.email,
      password: values.password,
    });
    if (!validationLoginForm.success) {
      const loginFormErros = validationLoginForm.error.format();
      setErrors(loginFormErros);
    } else {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      await login({
        username: values.email,
        password: values.password,
      })
        .unwrap()
        .then((res) => {
          if (res.access_token) {
            handleAccessToken(res.access_token);
            setStep(LoginStepsEnum.LOGIN_EMAIL_CONFIRMATION);
          }
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              setServerErrors({
                _errors: [t`Autorisierungsfehler! Login oder Passwort falsch.`],
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
    if (
      !isForgotEmailModalOpen &&
      !isForgotPasswordCodeModalOpen &&
      !isForgotFormModalOpen &&
      enterPressed
    ) {
      handleNext();
    }
  }, [enterPressed]);

  const handleForgotPassword = async () => {
    setForgotEmailModalOpen(true);
  };

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

  const handleResendEmail = (email: string) => {
    setValues({ ...values, resendEmail: email });
    setData((prev) => ({
      ...prev,
      resendEmail: email,
    }));
  };

  const handleRegistration = () => {
    handleChangeMenu(menu.MENU_REGISTRATION);
  };

  const handleCloseForgotPasswordCode = () => {
    setForgotFormModalOpen(true);
    setForgotPasswordCodeModalOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        <SectionTitle>
          <Trans>Loggen Sie sich ein.</Trans>
        </SectionTitle>
        <div className={styles.back}>
          <span className={styles.description}>
            <Trans>Sie haben noch keinen Zugang zu my.availabill.ch?</Trans>
            <div style={{ display: "flex" }}>
              <TransparentButton
                color="secondary"
                width="fit-content"
                onClick={handleRegistration}
              >
                {t`Jetzt REGISTRIEREN`}
              </TransparentButton>
            </div>
          </span>
        </div>
        {serverErrors._errors[0] && (
          <Error>{serverErrors._errors.join(", ")}</Error>
        )}
        <Input
          mt={56}
          label={t`${onboardingTranslations?.emailLabelLogin}`}
          type="email"
          placeholder={t`E-Mail`}
          textError={errors.email?._errors.join(", ")}
          value={values.email}
          anchor="email"
          onChange={handleChange}
        />
        <Input
          mt={40}
          label={t`${onboardingTranslations?.passLabelLogin}`}
          type="password"
          placeholder={t`passwort eingeben`}
          textError={errors.password?._errors.join(", ")}
          value={values.password}
          anchor="password"
          onChange={handleChange}
        />
        <Button
          mt={16}
          pt={matches ? 8 : 14}
          pr={20}
          pb={matches ? 8 : 14}
          pl={20}
          onClick={handleNext}
        >
          {t`${onboardingTranslations?.confirmAndContinueBtn}`}
        </Button>
        <span className={styles.description}>
          <Trans>{onboardingTranslations?.forgotPasswordTxt}</Trans>
        </span>
        <TransparentButton
          color="secondary"
          width="fit-content"
          onClick={handleForgotPassword}
        >
          {t`${onboardingTranslations?.newPasswordCTA}`}
        </TransparentButton>
      </div>
      <Modal
        isModalOpen={isForgotPasswordCodeModalOpen}
        onClose={handleCloseForgotPasswordCode}
      >
        <ForgotPasswordCodeModal
          openResetForm={setForgotFormModalOpen}
          onClose={setForgotPasswordCodeModalOpen}
          isOpen={isForgotPasswordCodeModalOpen}
        />
      </Modal>
      <Modal
        isModalOpen={isForgotEmailModalOpen}
        onClose={setForgotEmailModalOpen}
      >
        <ForgotPasswordEmailModal
          isOpen={isForgotEmailModalOpen}
          handleResendEmail={handleResendEmail}
          openSuccess={setForgotPasswordCodeModalOpen}
          onClose={setForgotEmailModalOpen}
          openResetForm={setForgotFormModalOpen}
        />
      </Modal>
      <Modal
        isModalOpen={isForgotFormModalOpen}
        onClose={setForgotFormModalOpen}
      >
        <ForgotPasswordFormModal
          isOpen={isForgotFormModalOpen}
          resendEmail={values.resendEmail}
          onClose={setForgotFormModalOpen}
        />
      </Modal>
    </>
  );
};
