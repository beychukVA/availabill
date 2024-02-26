import React, { useState, useEffect } from "react";
import { Radio } from "@/components/common/Radio/Radio";
import { t } from "@lingui/macro";
import { ISelectItem } from "@/components/common/Select/types/ISelectItem";
import { Button } from "@/components/common/Button/Button";
import { useChangeUserInfoMutation } from "@/redux/User/Profile/profile-slice";
import { ToastError } from "@/components/Toasts/ToastError/ToastError";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { IGender } from "@/redux/User/Profile/types/IProfile";
import { useAppSelector } from "@/redux/store";
import styles from "./Language.module.scss";

interface IProps {
  user: ICurrentUser | undefined;
  updateUI: () => void;
}

const languages: ISelectItem[] = [
  {
    name: t`Deutsch`,
    value: "de",
  },
  {
    name: t`Englisch`,
    value: "en",
  },
  {
    name: t`Französisch`,
    value: "fr",
  },
  {
    name: t`Italienisch`,
    value: "it",
  },
];

export type LOCALES = "en" | "de" | "fr" | "it";

export const Language: React.FC<IProps> = ({ user, updateUI }) => {
  const { profileTranslations } = useAppSelector((state) => state.translations);
  const [changeUserInfo, { isError, error }] = useChangeUserInfoMutation();
  const [isToastErrorOpen, setToastErrorOpen] = useState(false);
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });

  const [selectedLenguage, setSelectedLenguage] = useState(
    user?.language?.toLowerCase() || (languages[0].value as LOCALES)
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLenguage(e.target.value as LOCALES);
  };

  useEffect(() => {
    if (serverErrors._errors[0]) {
      setToastErrorOpen(true);
    }
  }, [serverErrors._errors]);

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setServerErrors({ _errors: [] });
    setToastErrorOpen(false);
  };

  const handleServerError = (error: string) => {
    setServerErrors({
      _errors: [error],
    });
  };

  const handleSubmit = async () => {
    handleServerError("");
    const updatedUser = {
      userId: user?.id,
      birthDate: user?.birthDate,
      firstName: user?.firstName,
      name: user?.name,
      gender: user?.gender as IGender,
      language: selectedLenguage.toUpperCase(),
    };
    await changeUserInfo(updatedUser)
      .unwrap()
      .then((res) => {
        if (res) {
          updateUI();
        }
      })
      .catch((error) => {
        switch (error.status.toString()[0]) {
          case "4":
            handleServerError(
              t`Daten konnten nicht gesendet werden. versuchen Sie es nochmal`
            );
            return;
          case "5":
            handleServerError(t`Serverfehler`);
            return;
          default:
            handleServerError(t`Ein Fehler ist aufgetreten`);
        }
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{profileTranslations?.editLanguage}</div>
      <div className={styles.radioContainer}>
        {languages.map((language) => (
          <Radio
            key={`language-${language.value}`}
            onChange={handleSelect}
            name="language"
            value={language.value as string}
            text={language.name as string}
            mb={13}
            checked={selectedLenguage === language.value}
          />
        ))}
      </div>
      <Button
        mt={11}
        onClick={handleSubmit}
        variant="black"
        width="fit-content"
      >
        {profileTranslations?.saveTxt}
      </Button>
      <ToastError
        message={serverErrors._errors.join(", ")}
        duration={6000}
        open={isToastErrorOpen}
        handleClose={handleCloseToast}
      />
    </div>
  );
};
