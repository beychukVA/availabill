import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { Modal } from "@/components/common/Modal/Modal";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import { ForgotPasswordCodeModal } from "@/components/OnboardingSteps/Login/Modal/ForgotPasswordCodeModal/ForgotPasswordCodeModal";
import { ForgotPasswordEmailModal } from "@/components/OnboardingSteps/Login/Modal/ForgotPasswordEmailModal/ForgotPasswordEmailModal";
import { ForgotPasswordFormModal } from "@/components/OnboardingSteps/Login/Modal/ForgotPasswordFormModal/ForgotPasswordFormModal";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { ToastError } from "@/components/Toasts/ToastError/ToastError";
import { useChangePasswordMutation } from "@/redux/User/Profile/profile-slice";
import { Trans, t } from "@lingui/macro";
import React, { useState, useEffect, SetStateAction } from "react";
import { z } from "zod";
import { useAppSelector } from "@/redux/store";
import { ChangePasswordSuccesModal } from "./Modal/ChangePasswordSuccesModal/ChangePasswordSuccesModal";
import { PasswordInfoModal } from "./Modal/PasswordInfoModal/PasswordInfoModal";
import styles from "./Password.module.scss";

interface IProps {
  user: ICurrentUser | undefined;
  isForgotPassword: boolean;
  setForgotPassword: (isForgot: SetStateAction<boolean>) => void;
}

const passwordsSchema = z.object({
  oldPassword: z.string().min(8, t`Erlaubte Mindestanzahl an Zeichen (8)`),
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

export const Password: React.FC<IProps> = ({
  user,
  isForgotPassword,
  setForgotPassword,
}) => {
  const { profileTranslations } = useAppSelector((state) => state.translations);

  const [isChangePasswordSuccesModalOpen, setChangePasswordSuccesModalOpen] =
    useState(false);
  const [isPasswordInfoModalOpen, setPasswordInfoModalOpen] = useState(false);
  const [isForgotPasswordCodeModalOpen, setForgotPasswordCodeModalOpen] =
    useState<boolean>(false);
  const [isForgotEmailModalOpen, setForgotEmailModalOpen] =
    useState<boolean>(false);
  const [isForgotFormModalOpen, setForgotFormModalOpen] =
    useState<boolean>(false);
  const [changePassword] = useChangePasswordMutation();
  const [isToastErrorOpen, setToastErrorOpen] = useState(false);
  const [errors, setErrors] = useState<
    z.ZodFormattedError<
      {
        oldPassword: string;
        password: string;
        passwordConfirm: string;
      },
      string
    >
  >({ _errors: [] });
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [values, setValues] = useState({
    oldPassword: "",
    password: "",
    passwordConfirm: "",
    resendEmail: "",
  });

  setTimeout(() => {
    if (isForgotPassword && !isForgotEmailModalOpen) {
      setForgotEmailModalOpen(true);
    }
  }, 500);

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

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSavePassword = async () => {
    const validationPasswords = passwordsSchema.safeParse({
      oldPassword: values.oldPassword,
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
      await changePassword({
        userId: user?.id,
        oldPassword: values.oldPassword,
        newPassword: values.password,
      })
        .unwrap()
        .then((res) => {
          if (res) {
            setValues({
              oldPassword: "",
              password: "",
              passwordConfirm: "",
              resendEmail: "",
            });
            setChangePasswordSuccesModalOpen(true);
          }
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              handleServerError(
                t`Sie haben das falsche alte Passwort eingegeben`
              );
              return;
            case "5":
              handleServerError(t`Serverfehler`);
              return;
            default:
              handleServerError(t`Ein Fehler ist aufgetreten`);
          }
        });
    }
  };

  const handleForgotPassword = async () => {
    setForgotEmailModalOpen(true);
  };

  const handleResendEmail = (email: string) => {
    setValues({ ...values, resendEmail: email });
  };

  const handleCloseForgotPasswordCode = () => {
    setForgotFormModalOpen(true);
    setForgotPasswordCodeModalOpen(false);
  };

  const handleForgotEmailModalOpen = () => {
    setForgotEmailModalOpen(false);
    setForgotPassword(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{profileTranslations?.createNewPass}</div>
      <TransparentButton
        color="secondary"
        mt={5}
        onClick={() => setPasswordInfoModalOpen(true)}
      >
        {profileTranslations?.whatMakesPassSecure}
      </TransparentButton>
      <Input
        mt={48}
        label={profileTranslations?.oldPassLabel}
        type="password"
        placeholder={profileTranslations?.oldPassLabel}
        textError={errors.oldPassword?._errors.join(", ")}
        value={values.oldPassword}
        anchor="oldPassword"
        onChange={handleChange}
      />
      <Input
        mt={50}
        label={profileTranslations?.newPassLabel}
        password={values.password}
        type="password"
        placeholder={profileTranslations?.newPassLabel}
        textError={errors.password?._errors.join(", ")}
        value={values.password}
        anchor="password"
        onChange={handleChange}
      />
      <Input
        mt={50}
        label={profileTranslations?.confirmNewPassLabel}
        password={values.passwordConfirm}
        type="passwordConfirm"
        placeholder={profileTranslations?.confirmNewPassLabel}
        textError={errors.passwordConfirm?._errors.join(", ")}
        value={values.passwordConfirm}
        anchor="passwordConfirm"
        onChange={handleChange}
      />
      <TransparentButton
        color="secondary"
        mt={20}
        onClick={handleForgotPassword}
      >
        {profileTranslations?.forgotReqPass}
      </TransparentButton>
      <div className={styles.buttons}>
        <Button
          mt={20}
          mb={0}
          ml={0}
          mr={0}
          pt={14}
          pb={14}
          width="fit-content"
          onClick={handleSavePassword}
        >
          {profileTranslations?.savePass}
        </Button>
      </div>
      <Modal
        isModalOpen={isChangePasswordSuccesModalOpen}
        onClose={setChangePasswordSuccesModalOpen}
      >
        <ChangePasswordSuccesModal onClose={setChangePasswordSuccesModalOpen} />
      </Modal>
      <Modal
        isModalOpen={isPasswordInfoModalOpen}
        onClose={setPasswordInfoModalOpen}
      >
        <PasswordInfoModal onClose={setPasswordInfoModalOpen} />
      </Modal>
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
        onClose={handleForgotEmailModalOpen}
      >
        <ForgotPasswordEmailModal
          setForgotPassword={setForgotPassword}
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
      <ToastError
        message={serverErrors._errors.join(", ")}
        duration={6000}
        open={isToastErrorOpen}
        handleClose={handleCloseToast}
      />
    </div>
  );
};
