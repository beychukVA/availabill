import React, { useEffect, useState } from "react";
import { Trans, t } from "@lingui/macro";
import { z } from "zod";
import { IGenders } from "@/components/OnboardingSteps/Registration/types/IGender";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { Radio } from "@/components/common/Radio/Radio";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import { useRouter } from "next/router";
import { IGender } from "@/redux/User/Profile/types/IProfile";
import { LOCALES } from "@/components/LanguageSwitcher/LanguageSwitcher";
import { useChangeUserInfoMutation } from "@/redux/User/Profile/profile-slice";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import styles from "./EditNameModal.module.scss";

const userDataSchema = z.object({
  gender: z.string().min(1),
  firstName: z
    .string()
    .min(1, t`Bitte geben Sie mindestens ein Zeichen ein (1)`),
  lastName: z
    .string()
    .min(1, t`Bitte geben Sie mindestens ein Zeichen ein (1)`),
});

const gender: IGenders[] = [
  { value: "M", text: t`Herr` },
  { value: "F", text: t`Frau` },
];

interface IProps {
  onClose: (isOpen: boolean) => void;
  isOpen: boolean;
  user: ICurrentUser | undefined;
  updateUI: () => void;
  handleServerError: (error: string) => void;
}

interface IUserName {
  gender: string;
  firstName: string;
  lastName: string;
}

export const EditNameModal: React.FC<IProps> = ({
  onClose,
  isOpen,
  user,
  updateUI,
  handleServerError,
}) => {
  const [changeUserInfo, { isError, error }] = useChangeUserInfoMutation();
  const [errors, setErrors] = useState<
    z.ZodFormattedError<
      {
        firstName: string;
        lastName: string;
        gender: string;
      },
      string
    >
  >({ _errors: [] });
  const salutation = gender.find(
    (gender) => gender.value === user?.gender
  )?.value;
  const [values, setValues] = useState<IUserName>({
    gender: salutation || gender[0].value,
    firstName: user?.firstName || "",
    lastName: user?.name || "",
  });
  const enterPressed = useKeyPress(PressedKey.ENTER);

  useEffect(() => {
    setValues({
      gender: salutation || gender[0].value,
      firstName: user?.firstName || "",
      lastName: user?.name || "",
    });
  }, [user]);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({ _errors: [] });
    setValues({ ...values, gender: event.target.value });
  };

  const handleSubmit = async () => {
    handleServerError("");
    const validationUserData = userDataSchema.safeParse({
      gender: values.gender,
      firstName: values.firstName,
      lastName: values.lastName,
    });
    if (!validationUserData.success) {
      const userDataErros = validationUserData.error.format();
      setErrors(userDataErros);
    } else {
      setErrors({ _errors: [] });
      const updatedUser = {
        userId: user?.id,
        birthDate: user?.birthDate,
        firstName: values.firstName,
        name: values.lastName,
        gender: values.gender as IGender,
        language: user?.language,
      };
      await changeUserInfo(updatedUser)
        .unwrap()
        .then((res) => {
          if (res) {
            updateUI();
            onClose(false);
          }
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              handleServerError(
                t`Daten konnten nicht gesendet werden. versuchen Sie es nochmal`
              );
              onClose(false);
              return;
            case "5":
              handleServerError(t`Serverfehler`);
              onClose(false);
              return;
            default:
              handleServerError(t`Ein Fehler ist aufgetreten`);
              onClose(false);
          }
        });
    }
  };

  useEffect(() => {
    if (enterPressed && isOpen) {
      handleSubmit();
    }
  }, [enterPressed]);

  const handleClose = () => {
    setValues({
      gender: salutation || gender[0].value,
      firstName: user?.firstName || "",
      lastName: user?.name || "",
    });
    onClose(false);
  };

  return (
    <div className={styles.container}>
      <div data-testid="editModalTitle" className={styles.title}>
        <Trans>Name ändern</Trans>
      </div>
      <div className={styles.margin}>
        <div className={styles.description}>
          <Trans>
            Bitte beachten Sie, dass aus Sicherheitsgründen eine Namensänderung
            für Karten und Konten separat unter Karten & Konten durchgeführt
            werden müssen.
          </Trans>
        </div>
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
            label={t`Vorname`}
            type="text"
            placeholder={t`Vorname`}
            textError={errors.firstName?._errors.join(", ")}
            value={values.firstName}
            anchor="firstName"
            onChange={handleChange}
          />
          <Input
            mt={24}
            label={t`Nachname`}
            type="text"
            placeholder={t`Nachname`}
            textError={errors.lastName?._errors.join(", ")}
            value={values.lastName}
            anchor="lastName"
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
          onClick={() => handleClose()}
        >
          {t`Abrechen`}
        </Button>
        <Button onClick={() => handleSubmit()} width="fit-content" mt={40}>
          {t`Speichern`}
        </Button>
      </div>
    </div>
  );
};
