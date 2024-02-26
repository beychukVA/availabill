import React, { Dispatch, SetStateAction, useState } from "react";
import { t } from "@lingui/macro";
import {
  useChangeEmailMutation,
  useConfirmEmailMutation,
  useConfirmMonthlyInvoiceMutation,
  useSendMonthlyInvoiceMutation,
} from "@/redux/User/Cards/cards-slice";
import { pluckError } from "@/utils";
import { z } from "zod";
import { TransparentButton } from "@/components/common/TransparentButton/TransparentButton";
import styles from "./ShipMonthlyInvoiceModal.module.scss";
import { Button } from "../../../common/Button/Button";
import { Input } from "../../../common/Input/Input";

const emailSchema = z.object({
  oldEmail: z.string().email(t`E-Mail ist nicht korrekt`),
  newEmail: z.string().email(t`E-Mail ist nicht korrekt`),
});

const ShipMonthlyInvoiceModal = ({
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

  const [sendMonthlyInvoice, { error }] = useSendMonthlyInvoiceMutation();
  const [confirmMonthlyInvoice, { error: confirmMonthlyInvoiceErr }] =
    useConfirmMonthlyInvoiceMutation();

  const sendMonthlyInvoiceMutationError = error as any;
  const confirmMonthlyInvoiceMutationError = confirmMonthlyInvoiceErr as any;

  const confirmEmailHandler = async () => {
    await confirmMonthlyInvoice({
      code: confirmationCode!,
      cardAccountId: accountId!,
    }).unwrap();

    setShowFinalSuccess(true);
  };

  const changeEmailHandler = async () => {
    const emailsValidation = emailSchema.safeParse({
      oldEmail,
      newEmail,
    });

    if (!emailsValidation.success) {
      setErrors(emailsValidation.error.format());
      return;
    }

    await sendMonthlyInvoice({
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

  if (sendMonthlyInvoiceMutationError || confirmMonthlyInvoiceMutationError) {
    return (
      <div className={styles.modalInnerContent}>
        <h4>Error</h4>
        <p>
          {pluckError(
            sendMonthlyInvoiceMutationError ||
              confirmMonthlyInvoiceMutationError,
            "Could not complete monthly invoice type change at this time"
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
        <h4>Bestätigte Änderung</h4>
        <div>
          <p>Änderung des monatlichen Rechnungstyps erfolgreich bestätigt</p>
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
        <h4>Bestatigen Sie Ihre E-Mail</h4>
        <div>
          <p>
            Wir haben ihnen eine Nachricht an {newEmail || "E-mail addresse "}{" "}
            gesendet.
          </p>
          <TransparentButton
            color="secondary"
            mt={4}
            onClick={handleResendCode}
          >
            {t`andern`}
          </TransparentButton>
        </div>
        <p>
          Klicken Sie auf den Bestatigungslink in der Nachricht. Damit wird die
          E-Mail bestatigt. Erst nach der erfolgreichen Bestatigung erhalten Sie
          Ihre Monatsrechnunh per E-Mail.
        </p>
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
          <p>
            Sie haben keine E-Mail erhalten? Uberprufen Sie Ihren Spam-Ordner
            oder lassen Sie sich den Bestatigungslink erneut zusenden
          </p>
          <TransparentButton
            color="secondary"
            mt={4}
            onClick={handleResendCode}
          >
            {t`erneut zusenden`}
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
      <h4>Sie mochten neu Ihre Rechnung per E-Mail erhalten</h4>
      <div>
        <p>MediaMarkt CLUB Shopping Card</p>
        <p>Kontonummer: {cardAccountNo}</p>
      </div>
      <div>
        <p>
          Geben Sie Ihre E-Mail an. Wir senden Ihnen neu Ihre MediaMarkt CLUB
          Shipping Card Rechnung an diese E-Mail Adresse.
        </p>
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
          Beastatigen und Weiter
        </Button>
      </div>
    </div>
  );
};

export default ShipMonthlyInvoiceModal;
