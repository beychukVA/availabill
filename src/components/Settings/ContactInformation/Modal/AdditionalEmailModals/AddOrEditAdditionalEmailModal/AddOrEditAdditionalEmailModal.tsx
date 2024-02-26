import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { ICurrentUser } from "@/components/OnboardingSteps/Login/types/ILogin";
import { PressedKey, useKeyPress } from "@/hooks/useKeyPress";
import {
  useAddAdditionalEmailMutation,
  useDeleteAdditionalEmailMutation,
} from "@/redux/User/Profile/profile-slice";
import { Trans, t } from "@lingui/macro";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import clsx from "clsx";
import { IProfileTranslations } from "@/utility/types";
import { IAdditionEmail } from "../../../ContactInformation";
import styles from "./AddOrEditAdditionalEmailModal.module.scss";

interface IProps {
  translations: IProfileTranslations | null;
  handleServerError: (error: string) => void;
  onClose: (isOpen: boolean) => void;
  isOpen: boolean;
  showAddEmailConfirmation: (isOpen: boolean) => void;
  setCurrAdditionEmail: (email: string) => void;
  currAdditionEmail: string;
  updateUI: () => void;
  additionalsEmails: IAdditionEmail[] | undefined;
  isEditCurrEmail: boolean;
  setEditCurrEmail: (isEdit: boolean) => void;
  user: ICurrentUser;
}

const emailSchema = z.object({
  email: z.string().email(t`E-Mail ist nicht korrekt`),
  emailConfirm: z.string().email(t`E-Mail ist nicht korrekt`),
});

export const AddOrEditAdditionalEmailModal: React.FC<IProps> = ({
  translations,
  handleServerError,
  onClose,
  isOpen,
  showAddEmailConfirmation,
  setCurrAdditionEmail,
  currAdditionEmail,
  updateUI,
  additionalsEmails,
  isEditCurrEmail,
  setEditCurrEmail,
  user,
}) => {
  const [addAdditionalEmail] = useAddAdditionalEmailMutation();
  const [deleteAdditionalEmail] = useDeleteAdditionalEmailMutation();
  const [errors, setErrors] = useState<
    z.ZodFormattedError<
      {
        email: string;
        emailConfirm: string;
      },
      string
    >
  >({ _errors: [] });
  const [values, setValues] = useState({
    email: currAdditionEmail,
    emailConfirm: currAdditionEmail,
  });
  const enterPressed = useKeyPress(PressedKey.ENTER);

  useEffect(() => {
    setValues({
      ...values,
      email: currAdditionEmail,
      emailConfirm: currAdditionEmail,
    });

    return () => {
      setValues({
        ...values,
        email: "",
        emailConfirm: "",
      });
    };
  }, [currAdditionEmail]);

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setErrors({ _errors: [] });
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClose = () => {
    setCurrAdditionEmail("");
    setValues({ email: "", emailConfirm: "" });
    setErrors({ _errors: [] });
    updateUI();
    if (isEditCurrEmail) {
      setEditCurrEmail(false);
    }
    onClose(false);
  };

  const checkEmail = (email: string) =>
    additionalsEmails?.find((addition) => addition.email === email);

  const handleNext = async () => {
    const validationEmails = emailSchema.safeParse({
      email: values.email,
      emailConfirm: values.emailConfirm,
    });
    if (!validationEmails.success) {
      const emailsErros = validationEmails.error.format();
      setErrors(emailsErros);
    } else {
      if (values.email !== values.emailConfirm) {
        setErrors({
          ...errors,
          emailConfirm: {
            _errors: [t`E-Mail und Bestätigungs-E-Mail stimmen nicht überein`],
          },
        });
        return;
      }
      setErrors({ _errors: [] });
      if (checkEmail(values.email)) {
        handleServerError(t`Diese E-Mail wurde bereits hinzugefügt.`);
        return;
      }
      await addAdditionalEmail({
        email: values.email,
      })
        .unwrap()
        .then(async (res) => {
          if (checkEmail(currAdditionEmail) && isEditCurrEmail) {
            await deleteAdditionalEmail({
              userId: user?.id,
              email: currAdditionEmail,
              type: "KAR",
            })
              .then((res) => {})
              .catch((error) => {
                switch (error.status.toString()[0]) {
                  case "4":
                    handleServerError(
                      t`E-Mail-Adresse konnte nicht gelöscht werden. Versuchen Sie es erneut.`
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
          if (isEditCurrEmail) {
            setEditCurrEmail(false);
          }
          setCurrAdditionEmail(values.email);
          showAddEmailConfirmation(true);
          updateUI();
          onClose(false);
        })
        .catch((error) => {
          switch (error.status.toString()[0]) {
            case "4":
              handleServerError(
                t`Daten konnten nicht gesendet werden. Versuchen Sie es nochmal.`
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
        {translations?.enterYourEmailAddressTitle}
      </div>
      <div className={clsx(styles.inputs, styles.margin)}>
        <Input
          label={translations?.additionalEmailModalFieldEmailLabel}
          type="email"
          placeholder={translations?.additionalEmailModalFieldEmailPlaceholder}
          textError={errors.email?._errors.join(", ")}
          value={values.email}
          anchor="email"
          onChange={handleChange}
        />
        <Input
          mt={48}
          label={translations?.additionalEmailModalFieldRepeatEmailLabel}
          type="email"
          placeholder={
            translations?.additionalEmailModalFieldRepeatEmailPlaceholder
          }
          textError={errors.emailConfirm?._errors.join(", ")}
          value={values.emailConfirm}
          anchor="emailConfirm"
          onChange={handleChange}
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="white"
          width="fit-content"
          mt={40}
          mr={16}
          onClick={() => handleClose()}
        >
          {translations?.additionalEmailModalBtnCancell}
        </Button>
        <div data-testid="addNewEmailButtonConfirm">
          <Button onClick={handleNext} width="fit-content" mt={40}>
            {translations?.additionalEmailModalBtnNext}
          </Button>
        </div>
      </div>
    </div>
  );
};
