import React, { Dispatch, SetStateAction, useState } from "react";
import { t } from "@lingui/macro";
import {
  useChangeEmailMutation,
  useConfirmEmailMutation,
} from "@/redux/User/Cards/cards-slice";
import { pluckError } from "@/utils";
import { z } from "zod";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import styles from "./ChangeEmailModal.module.scss";
import { Button } from "../../../common/Button/Button";
import { Input } from "../../../common/Input/Input";

const changeEmailSchema = z.object({
  oldEmail: z.string().email(t`E-Mail ist nicht korrekt`),
  newEmail: z.string().email(t`E-Mail ist nicht korrekt`),
});

const ChangeEmailModal = ({
  setIsModalOpen,
  accountId,
  setOneTimeCodeReference,
  cardAccountNo,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  accountId: number | undefined;
  cardAccountNo: number | undefined;
  setOneTimeCodeReference: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFinalSuccess, setShowFinalSuccess] = useState<boolean>(false);

  const [errors, setErrors] = useState<
    z.ZodFormattedError<
      {
        oldEmail: string;
        newEmail: string;
      },
      string
    >
  >({ _errors: [] });

  const [changeEmail, { error }] = useChangeEmailMutation();
  const [confirmEmail, { error: confirmEmailErr }] = useConfirmEmailMutation();

  const changeEmailMutationError = error as any;
  const confirmEmailMutationError = confirmEmailErr as any;

  const confirmEmailHandler = async () => {
    await confirmEmail({
      code: confirmationCode!,
      cardAccountId: accountId!,
    }).unwrap();

    setShowFinalSuccess(true);
  };

  const changeEmailHandler = async () => {
    const emailsValidation = changeEmailSchema.safeParse({
      oldEmail,
      newEmail,
    });

    if (!emailsValidation.success) {
      setErrors(emailsValidation.error.format());
      return;
    }

    await changeEmail({
      email: newEmail,
      cardAccountId: accountId!,
    }).unwrap();

    setShowSuccess(true);
    await setOneTimeCodeReference(newEmail);
  };

  const handleResendCode = () => {};

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (prop === "old") {
        setOldEmail(event.target.value);
      } else if (prop === "new") {
        setNewEmail(event.target.value);
      } else if (prop === "confirmationCode") {
        setConfirmationCode(event.target.value);
      }
    };

  if (changeEmailMutationError || confirmEmailMutationError) {
    return (
      <div className={styles.modalInnerContent}>
        <h4>Error</h4>
        <p>
          {pluckError(
            changeEmailMutationError || confirmEmailMutationError,
            "Could not complete limit change at this time"
          )}
        </p>
        <div className={styles.buttonBlock}>
          <Button
            variant="black"
            mt={0}
            mb={0}
            ml={0}
            mr={10}
            pt={8}
            pb={8}
            width="fit-content"
            onClick={() => setIsModalOpen(false)}
          >
            Schliessen
          </Button>
        </div>
      </div>
    );
  }

  if (showFinalSuccess) {
    return (
      <div className={styles.modalInnerContent}>
        <h4>Bestätigte E-Mail-Änderung</h4>
        <div>
          <p>Sie haben die E-Mail-Änderung erfolgreich bestätigt</p>
        </div>
        <div className={styles.buttonBlock}>
          <Button
            variant="black"
            mt={0}
            mb={0}
            ml={0}
            mr={10}
            pt={8}
            pb={8}
            width="fit-content"
            onClick={() => setIsModalOpen(false)}
          >
            Schliessen
          </Button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className={styles.modalInnerContent}>
        <h4>Geben Sie Ihre E-Mail an</h4>
        <div>
          <p>
            Bitte geben Sie den Code ein, den wir Ihnen an{" "}
            {newEmail || "E-mail addresse "}
            gesendet haben.
          </p>
        </div>
        <div className={styles.innerInputs}>
          <Input
            label={t`Code eingeben`}
            mt={24}
            type="text"
            value={confirmationCode}
            anchor="confirmationCode"
            onChange={handleChange}
          />
        </div>
        <div>
          <p>Keinen Code erhalten? Prüfen Sie zunächst Ihren Spam-Ordner.</p>
          <TransparentButton
            color="secondary"
            mt={4}
            onClick={handleResendCode}
          >
            {t`Code erneut senden`}
          </TransparentButton>
        </div>
        <div className={styles.buttonBlock}>
          <Button
            variant="white"
            mt={0}
            mb={0}
            ml={0}
            mr={10}
            pt={8}
            pb={8}
            width="fit-content"
            onClick={() => setIsModalOpen(false)}
          >
            Abrechen
          </Button>
          <Button
            disabled={!confirmationCode}
            variant="black"
            mt={0}
            mb={0}
            ml={0}
            mr={10}
            pt={8}
            pb={8}
            width="fit-content"
            onClick={confirmEmailHandler}
          >
            Weiter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalInnerContent}>
      <h4>Geben Sie Ihre E-Mail an</h4>
      <div>
        <p>MediaMarkt CLUB Shopping Card</p>
        <p>Kontonummer: {cardAccountNo}</p>
      </div>
      <div className={styles.innerInputs}>
        <Input
          label={t`E-Mail eingeben`}
          mt={24}
          type="text"
          value={oldEmail}
          anchor="old"
          onChange={handleChange}
          textError={errors.oldEmail?._errors.join(", ")}
        />
      </div>
      <div className={styles.innerInputs}>
        <Input
          label={t`E-Mail bestätigen`}
          mt={24}
          type="text"
          value={newEmail}
          anchor="new"
          onChange={handleChange}
          textError={errors.newEmail?._errors.join(", ")}
        />
      </div>
      <div className={styles.buttonBlock}>
        <Button
          variant="white"
          mt={0}
          mb={0}
          ml={0}
          mr={10}
          pt={8}
          pb={8}
          width="fit-content"
          onClick={() => setIsModalOpen(false)}
        >
          Abrechen
        </Button>
        <Button
          disabled={!oldEmail || !newEmail || oldEmail !== newEmail}
          variant="black"
          mt={0}
          mb={0}
          ml={0}
          mr={10}
          pt={8}
          pb={8}
          width="fit-content"
          onClick={changeEmailHandler}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default ChangeEmailModal;
