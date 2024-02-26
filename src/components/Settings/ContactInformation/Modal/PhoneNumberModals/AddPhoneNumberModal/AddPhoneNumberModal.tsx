import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { FlagIcon } from "@/components/Icons/FlagIcon/FlagIcon";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import { useChangePhoneNumberMutation } from "@/redux/User/Profile/profile-slice";
import { Trans, t } from "@lingui/macro";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { IUserLogin } from "../../../ContactInformation";
import styles from "./AddPhoneNumberModal.module.scss";

interface IProps {
  onClose: (isOpen: boolean) => void;
  isOpen: boolean;
  showPhoneNumberCodeModal: (isOpen: boolean) => void;
  handleServerError: (error: string) => void;
  user: ICurrentUser;
  values: IUserLogin;
  setValues: (prop: string, value: string) => void;
}

const mobileSchema = z
  .string()
  .regex(
    /^\+41\s\(0\)\d{2}\s\d{3}\s\d{2}\s\d{2}$/g,
    t`Telefonnummer ist nicht korrekt`
  );

export const AddPhoneNumberModal: React.FC<IProps> = ({
  onClose,
  isOpen,
  handleServerError,
  user,
  showPhoneNumberCodeModal,
  values,
  setValues,
}) => {
  const [changePhoneNumber] = useChangePhoneNumberMutation();
  const [errors, setErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const enterPressed = useKeyPress(PressedKey.ENTER);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setValues(prop, event.target.value);
    };

  const handleClose = () => {
    onClose(false);
  };

  const handleNext = async () => {
    const validationMobile = mobileSchema.safeParse(values.phoneNumber);
    if (!validationMobile.success) {
      const mobileErros = validationMobile.error.format();
      setErrors(mobileErros);
    } else {
      setErrors({ _errors: [] });
      handleServerError("");
      await changePhoneNumber({
        userId: user?.id,
        phoneNumber: values.phoneNumber,
      })
        .unwrap()
        .then((res) => {
          showPhoneNumberCodeModal(true);
          onClose(false);
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              handleServerError(
                t`Ein Benutzer mit dieser Telefonnummer existiert bereits.`
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

  useEffect(() => {
    if (enterPressed && isOpen) {
      handleNext();
    }
  }, [enterPressed]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Trans>Sie haben eine neue Mobilnummer</Trans>
      </div>
      <div className={styles.margin}>
        <div className={styles.description}>
          <Trans>Bitte geben Sie Ihre Mobilnummer ein.</Trans>
        </div>
        <Input
          mt={24}
          mb={24}
          icon={<FlagIcon />}
          label=""
          type="tel"
          placeholder="+41 --- --- -- --"
          textError={errors._errors.join(", ")}
          value={values.phoneNumber || ""}
          anchor="phoneNumber"
          onChange={handleChange}
        />
        <div className={styles.description}>
          <Trans>
            Wir senden Ihnen einen Code an «primäre E-Mail-Adresse». Den Code
            benötigen Sie für den nächsten Schritt.
          </Trans>
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
        <Button onClick={() => handleNext()} width="fit-content" mt={40}>
          {t`senden`}
        </Button>
      </div>
    </div>
  );
};
