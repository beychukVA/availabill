import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { IUserLogin } from "@/components/Settings/ContactInformation/ContactInformation";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useLoginMutation } from "@/redux/Auth/auth-slice";
import { Trans, t } from "@lingui/macro";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useAppSelector } from "@/redux/store";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import styles from "./DeleteConfirmedEmailLoginModal.module.scss";

interface IProps {
  deleteEmail: string;
  onClose: (isOpen: boolean) => void;
  isOpen: boolean;
  handleServerError: (error: string) => void;
  values: IUserLogin;
  setValues: (prop: string, value: string) => void;
  // showDeleteEmailConfirm: (isOpen: boolean) => void;
  showCodeModal: (isOpen: boolean) => void;
  forgotPassword: () => void;
  user: ICurrentUser | undefined;
}

const loginFormSchema = z.object({
  // email: z.string().email(t`E-Mail ist nicht korrekt`),
  //  password: z
  //    .string()
  //    .min(8)
  //    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}/, {
  //      message: "Invalid password",
  //    }),
});

export const DeleteConfirmedEmailLoginModal: React.FC<IProps> = ({
  deleteEmail,
  onClose,
  isOpen,
  showCodeModal,
  handleServerError,
  values,
  setValues,
  forgotPassword,
  user,
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
            showCodeModal(true);
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

  const insertEmail = (text: string | undefined) => {
    if (!text) return "";
    return text.replace(/(?<=“)(.*)(?=”)/gm, deleteEmail);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {profileTranslations?.wantToRemoveEmailTxt}
      </div>
      <div className={styles.margin}>
        <div className={styles.description}>
          {insertEmail(profileTranslations?.enterCredentialsToRemoveEmail)}
        </div>
        <div className={styles.inputContainer}>
          <Input
            mt={48}
            label={profileTranslations?.passwordLabel}
            type="password"
            placeholder={profileTranslations?.enterPassword}
            textError={errors.password?._errors.join(", ")}
            value={values.password}
            anchor="password"
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
          onClick={() => {
            forgotPassword();
            onClose(false);
          }}
        >
          {profileTranslations?.forgotPassowrd}
        </Button>
        <Button onClick={() => handleNext()} width="fit-content" mt={40}>
          {profileTranslations?.further}
        </Button>
      </div>
    </div>
  );
};
