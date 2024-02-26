import { Button } from "@/components/common/Button/Button";
import { Trans, t } from "@lingui/macro";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { PlusIcon } from "@/components/Icons/PlusIcon/PlusIcon";
import { useObjectToInvoiceMutation } from "@/redux/User/Accounts/account-slice";
import { Loading } from "@/components/Loading/Loading";
import { z } from "zod";
import { Portal } from "@/components/Portal/Portal";
import { Modal } from "@/components/common/Modal/Modal";
import { useAppSelector } from "@/redux/store";
import styles from "./ObjectToInvoiceModal.module.scss";

interface IProps {
  transactionId: number;
  setPortalActive: Dispatch<SetStateAction<number | null>>;
}

const mobileSchema = z
  .string()
  .startsWith("0", {
    message: t`Bitte geben Sie eine gültige Telefonnummer ein`,
  })
  .length(10, { message: t`Telefonnummer ist nicht korrekt` });

export const ObjectToInvoiceModal: React.FC<IProps> = ({
  transactionId,
  setPortalActive,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState<string | undefined>(
    undefined
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { billsTranslations } = useAppSelector((state) => state.translations);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);

  const [objectToInvoice, { isError, error, isLoading }] =
    useObjectToInvoiceMutation();

  const handleSend = useCallback(async () => {
    const phoneNumberValidation = mobileSchema.safeParse(phoneNumber);
    if (!phoneNumberValidation.success) {
      const mobileErros = phoneNumberValidation.error.format();
      setPhoneNumberError(mobileErros._errors[0]);
      return;
    }

    const data = await objectToInvoice({
      transactionId,
      phoneNumber,
    }).unwrap();

    if (data.id) {
      setShowSuccessMessage(true);
    }
  }, [objectToInvoice, phoneNumber, transactionId]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className={styles.container}>
          <Loading className={styles.spinner} />;
        </div>
      );
    }

    if (showSuccessMessage || isError) {
      return (
        <div className={styles.container}>
          <span className={styles.title}>
            {isError ? (
              <Trans>Es ist ein Fehler aufgetreten</Trans>
            ) : (
              billsTranslations?.callbackSuccessfullyReq
            )}
          </span>
          <p className={styles.description}>
            {error ? (
              <Trans>
                {JSON.stringify("error" in error ? error.error : error)}
              </Trans>
            ) : (
              billsTranslations?.weWillGetBackToYou
            )}
          </p>

          <div className={styles.buttonContainer}>
            <Button
              width="fit-content"
              mt={40}
              mr={16}
              onClick={() => setIsModalOpen(false)}
            >
              {billsTranslations?.closeTxt}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <span className={styles.title}>
          {billsTranslations?.requestACallback}
        </span>
        <p className={styles.description}>
          {billsTranslations?.enterPhoneNumber}
        </p>
        <div className={styles.inputWrapper}>
          <PlusIcon />
          <input
            type="number"
            placeholder={
              billsTranslations?.requestCallBackModalPhonePlaceholder
            }
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className={phoneNumberError ? styles.phoneNumberError : ""}>
          {phoneNumberError && phoneNumberError}
        </div>
        <div className={styles.buttonContainer}>
          <Button
            variant="white"
            width="fit-content"
            mt={40}
            mr={16}
            onClick={() => setIsModalOpen(false)}
          >
            {billsTranslations?.cancel}
          </Button>
          <Button onClick={() => handleSend()} width="fit-content" mt={40}>
            {billsTranslations?.send}
          </Button>
        </div>
      </div>
    );
  }, [
    billsTranslations?.callbackSuccessfullyReq,
    billsTranslations?.cancel,
    billsTranslations?.closeTxt,
    billsTranslations?.enterPhoneNumber,
    billsTranslations?.requestACallback,
    billsTranslations?.send,
    billsTranslations?.weWillGetBackToYou,
    error,
    handleSend,
    isError,
    isLoading,
    phoneNumber,
    phoneNumberError,
    showSuccessMessage,
  ]);

  return (
    <Portal handlePortalNode={setPortalNode}>
      {portalNode && (
        <Modal
          isModalOpen={isModalOpen}
          onClose={setIsModalOpen}
          setPortalActive={() => setPortalActive(null)}
        >
          {content}
        </Modal>
      )}
    </Portal>
  );
};
