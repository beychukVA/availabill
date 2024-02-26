import React, { useEffect, useState } from "react";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { Trans, t } from "@lingui/macro";
import { z } from "zod";
import { Input } from "@/components/common/Input/Input";
import { useLoginMutation } from "@/redux/Auth/auth-slice";
import { Button } from "@/components/common/Button/Button";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useAppSelector } from "@/redux/store";
import { IUserLogin } from "../../../ContactInformation";
import styles from "./PrimaryEmailLoginModal.module.scss";

const loginFormSchema = z.object({
  // email: z.string().email(t`E-Mail ist nicht korrekt`),
  //  password: z
  //    .string()
  //    .min(8)
  //    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}/, {
  //      message: "Invalid password",
  //    }),
});

interface IProps {
  onClose: (isOpen: boolean) => void;
  isOpen: boolean;
  user: ICurrentUser | undefined;
  updateUI: () => void;
  handleServerError: (error: string) => void;
  values: IUserLogin;
  setValues: (prop: string, value: string) => void;
  showCodeModal: () => void;
  forgotPassword: () => void;
}

export const PrimaryEmailLoginModal: React.FC<IProps> = ({
  onClose,
  isOpen,
  user,
  updateUI,
  handleServerError,
  values,
  setValues,
  showCodeModal,
  forgotPassword,
}) => {
  const { profileTranslations } = useAppSelector((state) => state.translations);

  const [login] = useLoginMutation();
  const [errors, setErrors] = useState<
    z.ZodFormattedError<
      {
        password: string;
      },
      string
    >
  >({ _errors: [] });
  const enterPressed = useKeyPress(PressedKey.ENTER);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setValues(prop, event.target.value);
    };

  const handleNext = async () => {
    const validationLoginForm = loginFormSchema.safeParse({
      password: values.password,
    });
    if (!validationLoginForm.success) {
      const loginFormErros = validationLoginForm.error.format();
      setErrors(loginFormErros);
    } else {
      setErrors({ _errors: [] });
      await login({
        username: user?.email || "",
        password: values.password,
      })
        .unwrap()
        .then((res) => {
          console.log("contact res: ", res);
          if (res.access_token) {
            setValues("token", res.access_token);
            showCodeModal();
            onClose(false);
          }
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              handleServerError(
                t`Autorisierungsfehler! Login oder Passwort falsch.`
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
      handleNext();
    }
  }, [enterPressed]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>{profileTranslations?.setEmailPrimary}</div>
      <div className={styles.margin}>
        <div className={styles.description}>
          {profileTranslations?.primaryEmailLoginSubtitle1} “{user?.email}”{" "}
          {profileTranslations?.primaryEmailLoginSubtitle2}
        </div>
        <div className={styles.inputContainer}>
          <Input
            mt={43}
            label={t`Passwort`}
            type="password"
            placeholder={profileTranslations?.enterPassword}
            textError={errors.password?._errors.join(", ")}
            value={values.password}
            anchor="password"
            onChange={handleChange}
          />
        </div>
        <div className={styles.description} style={{ marginTop: 24 }}>
          {profileTranslations?.weWillSendCode}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="white"
          width="fit-content"
          mt={40}
          mr={16}
          onClick={() => {
            forgotPassword();
            onClose(false);
          }}
        >
          {t`passwort vergessen`}
        </Button>
        <Button onClick={() => handleNext()} width="fit-content" mt={40}>
          {t`WEITER`}
        </Button>
      </div>
    </div>
  );
};
