import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import { Input } from "@/components/common/Input/Input";
import { SectionTitle } from "@/components/common/SectionTitle/SectionTitle";
import { useSetPasswordMutation } from "@/redux/Auth/auth-slice";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Error } from "@/components/Error/Error";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useAppSelector } from "@/redux/store";
import { RegistrationStepsEnum } from "../../lib/RegistrationStepsEnum";
import { IDate, IStepProps } from "../types/IRegistration";
import styles from "./RegistrationPasswordStep.module.scss";

const passwordsSchema = z.object({
  password: z
    .string()
    .min(8, t`Erlaubte Mindestanzahl an Zeichen (8)`)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{8,}/, {
      message: t`Ungültiges Passwort`,
    }),
  passwordConfirm: z
    .string()
    .min(8, t`Erlaubte Mindestanzahl an Zeichen (8)`)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{8,}/, {
      message: t`Ungültiges Bestätigungspasswort`,
    }),
});

export const RegistrationPasswordStep: React.FC<IStepProps> = ({
  step,
  setStep,
  data,
  setData,
}) => {
  const { onboardingTranslations } = useAppSelector(
    (state) => state.translations
  );
  const [setPassword, { isError, error }] = useSetPasswordMutation();
  const [errors, setErrors] = useState<
    z.ZodFormattedError<
      {
        password: string;
        passwordConfirm: string;
      },
      string
    >
  >({ _errors: [] });
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
    const validationPasswords = passwordsSchema.safeParse({
      password: values.password,
      passwordConfirm: values.passwordConfirm,
    });
    if (!validationPasswords.success) {
      const passwordsErros = validationPasswords.error.format();
      setErrors(passwordsErros);
    } else {
      if (values.password !== values.passwordConfirm) {
        setErrors({
          ...errors,
          passwordConfirm: {
            _errors: [t`Passwort bestätigen stimmt nicht mit Passwort überein`],
          },
        });
        return;
      }
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      await setPassword({
        code: values.onboardingCode,
        password: values.password,
      })
        .unwrap()
        .then((res) => {
          if (res) {
            setStep(RegistrationStepsEnum.REGISTRATION_USER_INFO);
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
              setServerErrors({
                _errors: [t`Serverfehler`],
              });
              return;
            default:
              setServerErrors({
                _errors: [t`Ein Fehler ist aufgetreten`],
              });
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
    setStep(RegistrationStepsEnum.REGISTRATION_MOBILE);
  };

  return (
    <div className={styles.container}>
      <SectionTitle>
        <Trans>Passwort setzen</Trans>
      </SectionTitle>
      <span className={styles.description}>
        {onboardingTranslations?.passwordInfo}
      </span>
      {serverErrors._errors[0] && (
        <Error>{serverErrors._errors.join(", ")}</Error>
      )}
      <Input
        mt={56}
        label={t`Passwort eingeben`}
        type="password"
        placeholder={t`passwort eingeben`}
        textError={errors.password?._errors.join(", ")}
        value={values.password}
        anchor="password"
        onChange={handleChange}
      />
      <Input
        mt={48}
        label={t`Passwort bestätigen`}
        password={values.password}
        type="passwordConfirm"
        placeholder={t`passwort bestätigen`}
        textError={errors.passwordConfirm?._errors.join(", ")}
        value={values.passwordConfirm}
        anchor="passwordConfirm"
        onChange={handleChange}
      />
      <div className={styles.buttons}>
        <Button
          variant="white"
          mt={0}
          mb={0}
          ml={0}
          mr={10}
          pt={14}
          pb={14}
          onClick={handleBack}
        >
          {t`Zurück`}
        </Button>
        <Button
          mt={0}
          mb={0}
          ml={0}
          mr={0}
          pt={14}
          pb={14}
          onClick={handleNext}
        >
          {onboardingTranslations?.sendCTA}
        </Button>
      </div>
    </div>
  );
};
