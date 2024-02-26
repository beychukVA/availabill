import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import { Input } from "@/components/common/Input/Input";
import { Radio } from "@/components/common/Radio/Radio";
import { SectionTitle } from "@/components/common/SectionTitle/SectionTitle";
import { CalendarIcon } from "@/components/Icons/CalendarIcon/CalendarIcon";
import { useSetUserDataMutation } from "@/redux/Auth/auth-slice";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Error } from "@/components/Error/Error";
import { IGender } from "@/redux/User/Profile/types/IProfile";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useAppSelector } from "@/redux/store";
import { RegistrationStepsEnum } from "../../lib/RegistrationStepsEnum";
import { IGenders } from "../types/IGender";
import { IDate, IStepProps } from "../types/IRegistration";
import styles from "./RegistrationUserInfoStep.module.scss";

const userDataSchema = z.object({
  gender: z.string().min(1),
  firstName: z
    .string()
    .min(1, t`Bitte geben Sie mindestens ein Zeichen ein (1)`),
  lastName: z
    .string()
    .min(1, t`Bitte geben Sie mindestens ein Zeichen ein (1)`),
  // birthday: z.string().datetime({ offset: true }),
  birthday: z.string().regex(/^(?=.*[0-9])/, t`Falsches Datum ausgewählt`),
});

export const RegistrationUserInfoStep: React.FC<IStepProps> = ({
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
  const gender: IGenders[] = [
    { value: "M", text: onboardingTranslations?.man || "Herr" },
    { value: "F", text: onboardingTranslations?.woman || "Frau" },
  ];
  const [setUserData, { isError, error }] = useSetUserDataMutation();
  const [errors, setErrors] = useState<
    z.ZodFormattedError<
      {
        firstName: string;
        lastName: string;
        birthday: string;
        gender: string;
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
    gender: data.gender ? data.gender : gender[0].value,
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

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({ _errors: [] });
    setServerErrors({ _errors: [] });
    setValues({ ...values, gender: event.target.value });
    setData((prev) => ({
      ...prev,
      gender: event.target.value,
    }));
  };

  const handleNext = async () => {
    const validationUserData = userDataSchema.safeParse({
      gender: values.gender,
      firstName: values.firstName,
      lastName: values.lastName,
      birthday: values.birthday,
    });
    if (!validationUserData.success) {
      const userDataErros = validationUserData.error.format();
      setErrors(userDataErros);
    } else {
      setErrors({ _errors: [] });
      setServerErrors({ _errors: [] });
      await setUserData({
        code: values.onboardingCode,
        gender: values.gender as IGender,
        firstName: values.firstName,
        name: values.lastName,
        birthDate: values.birthday,
      })
        .unwrap()
        .then((res) => {
          if (res) {
            handleChangeMenu(menu.MENU_LOGIN);
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
    setStep(RegistrationStepsEnum.REGISTRATION_PASSWORD);
  };

  return (
    <div className={styles.container}>
      <SectionTitle>{onboardingTranslations?.userInfoTitle}</SectionTitle>
      {serverErrors._errors[0] && (
        <Error>{serverErrors._errors.join(", ")}</Error>
      )}
      <div className={styles.gender}>
        <Radio
          onChange={handleGenderChange}
          name="gender"
          value={gender[0].value}
          text={gender[0].text}
          mr={26}
          checked={values.gender === gender[0].value}
        />
        <Radio
          onChange={handleGenderChange}
          name="gender"
          value={gender[1].value}
          text={gender[1].text}
          checked={values.gender === gender[1].value}
        />
      </div>
      <div className={styles.fullName}>
        <Input
          mt={24}
          mr={15}
          label={onboardingTranslations?.nameLabel}
          type="text"
          placeholder={onboardingTranslations?.namePlaceholder}
          textError={errors.firstName?._errors.join(", ")}
          value={values.firstName}
          anchor="firstName"
          onChange={handleChange}
        />
        <Input
          mt={24}
          label={onboardingTranslations?.surnameLabel}
          type="text"
          placeholder={onboardingTranslations?.surnamePlaceholder}
          textError={errors.lastName?._errors.join(", ")}
          value={values.lastName}
          anchor="lastName"
          onChange={handleChange}
        />
      </div>
      <Input
        mt={40}
        icon={<CalendarIcon />}
        label={onboardingTranslations?.birthdayLabel}
        type="date"
        placeholder={t`Geburtsdatum`}
        textError={errors.birthday?._errors.join(", ")}
        value={values.birthday}
        anchor="birthday"
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
          {onboardingTranslations?.backBtn}
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
          {onboardingTranslations?.conclusionBtn}
        </Button>
      </div>
    </div>
  );
};
