import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useLoginMutation } from "@/redux/Auth/auth-slice";
import { IProfileTranslations } from "@/utility/types";
import { Trans, t } from "@lingui/macro";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { IUserLogin } from "../../../ContactInformation";
import styles from "./PhoneNumberLoginModal.module.scss";

interface IProps {
  translations: IProfileTranslations | null;
  onClose: (isOpen: boolean) => void;
  isOpen: boolean;
  handleServerError: (error: string) => void;
  values: IUserLogin;
  setValues: (prop: string, value: string) => void;
  showCodeModal: (isOpen: boolean) => void;
  user: ICurrentUser;
  forgotPassword: () => void;
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

export const PhoneNumberLoginModal: React.FC<IProps> = ({
  translations,
  onClose,
  isOpen,
  handleServerError,
  values,
  setValues,
  showCodeModal,
  user,
  forgotPassword,
}) => {
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
        username: user?.email,
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

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {values.stepPhoneNumber === "delete" ? (
          <Trans>{translations?.deleteYourMobilePhoneNumberTitle}</Trans>
        ) : (
          <Trans>{translations?.setAsPrimaryPhoneNumberTitle}</Trans>
        )}
      </div>
      <div className={styles.margin}>
        <div className={styles.description}>
          {values.stepPhoneNumber === "delete" ? (
            <>
              {translations?.deletePhoneNumberLoginModalSubtitle_1} &nbsp;
              {user.phoneNumber} &nbsp;
              {translations?.deletePhoneNumberLoginModalSubtitle_2}
            </>
          ) : (
            translations?.addPhoneNumberLoginModalSubtitle
          )}
        </div>
        <div className={styles.inputContainer}>
          <Input
            mt={48}
            label={translations?.phoneNumberLoginModalFieldPasswordLabel}
            type="password"
            placeholder={
              translations?.phoneNumberLoginModalFieldPasswordPlaceholder
            }
            textError={errors.password?._errors.join(", ")}
            value={values.password}
            anchor="password"
            onChange={handleChange}
          />
        </div>
        <div className={styles.description} style={{ marginTop: 24 }}>
          {translations?.phoneNumberLoginModalDescription}
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
          {translations?.phoneNumberLoginModalBtnForgotPassword}
        </Button>
        <Button onClick={() => handleNext()} width="fit-content" mt={40}>
          {translations?.phoneNumberLoginModalBtnNext}
        </Button>
      </div>
    </div>
  );
};
