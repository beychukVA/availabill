import React, { useEffect, useState } from "react";
import { Input } from "@/components/common/Input/Input";
import { SectionTitle } from "@/components/common/SectionTitle/SectionTitle";
import { Button } from "@/components/common/Button/Button";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import { useRegisterMutation } from "@/redux/Auth/auth-slice";
import { z } from "zod";
import { useMediaQuery } from "@mui/material";
import { Error } from "@/components/Error/Error";
import { useRouter } from "next/router";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useAppSelector } from "@/redux/store";
import { t } from "@lingui/macro";
import styles from "./RegistrationEmailStep.module.scss";
import { IDate, IStepProps } from "../types/IRegistration";
import { RegistrationStepsEnum } from "../../lib/RegistrationStepsEnum";

const emailSchema = z.string().email(t`E-Mail ist nicht korrekt`);

export const RegistrationEmailStep: React.FC<IStepProps> = ({
  step,
  setStep,
  data,
  setData,
  handleChangeMenu,
  menu,
}) => {
  const router = useRouter();
  const { onboardingTranslations } = useAppSelector(
    (state) => state.translations
  );
  const matches = useMediaQuery("(min-width:1200px)");
  const [register, { isError, error }] = useRegisterMutation();
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
  const enterPressed = useKeyPress(PressedKey.ENTER);

  const handleNext = async () => {
    const validationEmail = emailSchema.safeParse(values.email);
    if (!validationEmail.success) {
      const emailErros = validationEmail.error.format();
      setErrors(emailErros);
    } else {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      await register({
        email: values.email,
        language: router.locale!.split("-")[0].toUpperCase(),
      })
        .unwrap()
        .then((res) => {
          if (res?.email === values.email) {
            setStep(RegistrationStepsEnum.REGISTRATION_EMAIL_CONFIRMATION);
          }
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              setServerErrors({
                _errors: [
                  t`Ein Benutzer existiert bereits mit dieser E-Mail-Adresse!`,
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
    if (enterPressed) {
      handleNext();
    }
  }, [enterPressed]);

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

  const handleLogin = () => {
    handleChangeMenu(menu.MENU_LOGIN);
  };

  return (
    <div className={styles.container}>
      <SectionTitle>{onboardingTranslations?.registerYourself}</SectionTitle>
      <span className={styles.description}>
        {onboardingTranslations?.alreadyHaveAccountTxt}
      </span>
      <TransparentButton color="secondary" onClick={handleLogin}>
        {onboardingTranslations?.loginCTA}
      </TransparentButton>
      {serverErrors._errors[0] && (
        <Error>{serverErrors._errors.join(", ")}</Error>
      )}
      <Input
        mt={56}
        label={onboardingTranslations?.emailLoginRegister}
        type="email"
        placeholder={t`E-Mail`}
        textError={errors._errors.join(", ")}
        value={values.email}
        anchor="email"
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
        {onboardingTranslations?.confirmAndContinueBtn}
      </Button>
      <p className={styles.captcha}>
        {onboardingTranslations?.onboardingSubTxt_1}
        <br />
        <br />
        {onboardingTranslations?.onboardingSubTxt_2}
      </p>
    </div>
  );
};
