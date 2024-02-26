import { Button } from "@/components/common/Button/Button";
import { t, Trans } from "@lingui/macro";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useExtendPaymentPeriodMutation } from "@/redux/User/Accounts/account-slice";
import { Loading } from "@/components/Loading/Loading";
import { Portal } from "@/components/Portal/Portal";
import { Modal } from "@/components/common/Modal/Modal";
import { useAppSelector } from "@/redux/store";
import { RoundCloseIcon } from "@/components/Icons/RoundCloseIcon/RoundCloseIcon";
import styles from "./ExtendPaymentPeriodModal.module.scss";

interface IProps {
  transactionId: number;
  setPortalActive: Dispatch<SetStateAction<number | null>>;
}

export const ExtendPaymentPeriodModal: React.FC<IProps> = ({
  transactionId,
  setPortalActive,
}) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);

  const { billsTranslations } = useAppSelector((state) => state.translations);

  const [extendPaymentPeriod, { isError, error, isLoading }] =
    useExtendPaymentPeriodMutation();

  const handleSend = useCallback(async () => {
    const data = await extendPaymentPeriod({
      transactionId,
    }).unwrap();

    if (data.id) {
      setShowSuccessMessage(true);
    }
  }, [extendPaymentPeriod, transactionId]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className={styles.loadingBlock}>
          <Loading />
        </div>
      );
    }

    if (showSuccessMessage || isError) {
      return (
        <div className={styles.container}>
          <div className={styles.close} onClick={() => setIsModalOpen(false)}>
            <RoundCloseIcon color="#222222" />
          </div>
          <span className={styles.title}>
            {isError ? (
              <Trans>Es ist ein Fehler aufgetreten</Trans>
            ) : (
              billsTranslations?.youHaveExtendedPaymentPeriod
            )}
          </span>
          <p className={styles.description}>
            {error ? (
              <Trans>
                {JSON.stringify("error" in error ? error.error : error)}
              </Trans>
            ) : (
              billsTranslations?.newDueDateExplanation
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
        <div className={styles.close} onClick={() => setIsModalOpen(false)}>
          <RoundCloseIcon color="#222222" />
        </div>
        <span className={styles.title}>{billsTranslations?.payBillLater}</span>
        <p className={styles.description} style={{ marginBottom: "24px" }}>
          {billsTranslations?.extendPaymentPeriodExplanation}
        </p>
        <p className={styles.description}>
          {billsTranslations?.paymentPeriodExtendOnlyOnce}
        </p>
        <div className={styles.buttonContainer}>
          <Button
            variant="white"
            width="fit-content"
            mt={40}
            mr={16}
            onClick={() => setIsModalOpen(false)}
          >
            {t`Abrechen`}
          </Button>
          <Button onClick={() => handleSend()} width="fit-content" mt={40}>
            {billsTranslations?.extendPaymentPeriod}
          </Button>
        </div>
      </div>
    );
  }, [
    billsTranslations?.closeTxt,
    billsTranslations?.extendPaymentPeriod,
    billsTranslations?.extendPaymentPeriodExplanation,
    billsTranslations?.newDueDateExplanation,
    billsTranslations?.payBillLater,
    billsTranslations?.paymentPeriodExtendOnlyOnce,
    billsTranslations?.youHaveExtendedPaymentPeriod,
    error,
    handleSend,
    isError,
    isLoading,
    showSuccessMessage,
  ]);

  return (
    <Portal handlePortalNode={setPortalNode}>
      {portalNode && (
        <Modal
          isModalOpen={isModalOpen}
          onClose={setIsModalOpen}
          setPortalActive={() => setPortalActive(null)}
          preserveClose={isLoading}
          noCloseIcon
        >
          {content}
        </Modal>
      )}
    </Portal>
  );
};
