import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import { Input } from "@/components/common/Input/Input";
import { SectionTitle } from "@/components/common/SectionTitle/SectionTitle";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import { ChevronDoubleRight } from "@/components/Icons/ChevronDoubleRight/ChevronDoubleRight";
import { FlagIcon } from "@/components/Icons/FlagIcon/FlagIcon";
import { useSetPhoneMutation } from "@/redux/Auth/auth-slice";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Error } from "@/components/Error/Error";
import { useMediaQuery } from "@mui/material";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useAppSelector } from "@/redux/store";
import { RegistrationStepsEnum } from "../../lib/RegistrationStepsEnum";
import { IDate, IStepProps } from "../types/IRegistration";
import styles from "./RegistrationMobileStep.module.scss";

const mobileSchema = z
  .string()
  .regex(
    /^\+41\s\(0\)\d{2}\s\d{3}\s\d{2}\s\d{2}$/g,
    t`Telefonnummer ist nicht korrekt`
  );

export const RegistrationMobileStep: React.FC<IStepProps> = ({
  step,
  setStep,
  data,
  setData,
}) => {
  const { onboardingTranslations } = useAppSelector(
    (state) => state.translations
  );
  const matches = useMediaQuery("(min-width:1200px)");
  const [setPhone, { isError, error }] = useSetPhoneMutation();
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
    const validationMobile = mobileSchema.safeParse(values.mobile);
    if (!validationMobile.success) {
      const mobileErros = validationMobile.error.format();
      setErrors(mobileErros);
    } else {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      await setPhone({
        code: values.onboardingCode,
        phoneNumber: values.mobile,
      })
        .unwrap()
        .then((res) => {
          if (res) {
            setStep(RegistrationStepsEnum.REGISTRATION_MOBILE_CONFIRMATION);
          }
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
    if (enterPressed) {
      handleNext();
    }
  }, [enterPressed]);

  const handleBack = () => {
    setStep(RegistrationStepsEnum.REGISTRATION_EMAIL);
  };

  const handleNoPhoneNumber = async () => {
    await setPhone({
      code: values.onboardingCode,
    })
      .unwrap()
      .then((res) => {
        if (res) {
          setStep(RegistrationStepsEnum.REGISTRATION_PASSWORD);
        }
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
  };
  return (
    <div className={styles.container}>
      <SectionTitle>{onboardingTranslations?.addPhoneTitle}</SectionTitle>
      <span className={styles.description}>
        {onboardingTranslations?.addPhoneDescription}
      </span>
      {serverErrors._errors[0] && (
        <Error>{serverErrors._errors.join(", ")}</Error>
      )}
      <Input
        mt={56}
        icon={<FlagIcon />}
        label={onboardingTranslations?.addPhoneLabel}
        type="tel"
        placeholder="+41 --- --- -- --"
        textError={errors._errors.join(", ")}
        value={values.mobile || ""}
        anchor="mobile"
        onChange={handleChange}
      />
      <Button
        mt={16}
        pt={matches ? 8 : 14}
        pr={20}
        pb={matches ? 8 : 14}
        pl={20}
        mb={17}
        onClick={handleNext}
      >
        {onboardingTranslations?.confirmAndContinueBtn}
      </Button>
      <div className={styles.noMobile}>
        <TransparentButton
          icon={<ChevronDoubleRight />}
          color="secondary"
          onClick={handleNoPhoneNumber}
        >
          {onboardingTranslations?.doNotHaveMobileNumberBtn}
        </TransparentButton>
      </div>
    </div>
  );
};
