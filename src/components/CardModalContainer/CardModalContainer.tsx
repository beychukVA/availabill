import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useOneTimePasswordCodeQuery } from "@/redux/Auth/auth-slice";
import { Alert, Snackbar } from "@mui/material";
import {
  ICardAccount,
  ICardAccountToken,
} from "@/redux/User/Accounts/account-slice";
import { Modal } from "../common/Modal/Modal";
import styles from "./CardModalContainer.module.scss";

import { Portal } from "../Portal/Portal";
import NameEditModal from "./components/NameEditModal/NameEditModal";
import AddressModal from "./components/AddressModal/AddressModal";
import { CardRegistrationCodeApplyModal } from "./components/CardRegistrationCodeApplyModal/CardRegistrationCodeApplyModal";
import CardRegistrationModal from "./components/CardRegistrationModal/CardRegistrationModal";
import CloseNotificationModal from "./components/CloseNotificationModal/CloseNotificationModal";
import LockMapModal from "./components/LockMapModal/LockMapModal";
import IncreaseLimitModal from "./components/IncreaseLimitModal/IncreaseLimitModal";
import DecreaseLimitModal from "./components/DecreaseLimitModal/DecreaseLimitModal";
import ChangeEmailModal from "./components/ChangeEmailModal/ChangeEmailModal";
import ShipMonthlyInvoiceModal from "./components/ShipMonthlyInvoiceModal/ShipMonthlyInvoice";

export enum ModalType {
  LOCK_MAP_MODAL = "lockMapModal",
  REPLACE_CARD_MODAL = "replaceCardModal",
  CLOSE_NOTIFICATION_MODAL = "closeNotificationModal",
  CARD_REGISTRATION_MODAL = "cardRegistrationModal",
  CARD_REGISTRATION_CODE_APPLY_MODAL = "cardRegistrationCodeApplyModal",
  ADDRESS_MODAL = "addressModal",
  NAME_EDIT_MODAL = "nameEditModal",
  INCREASE_LIMIT_MODAL = "increaseLimitModal",
  DECREASE_LIMIT_MODAL = "decreaseLimitModal",
  CHANGE_EMAIL_MODAL = "changeEmailModal",
  SHIPPING_MONTHLY_INVOICE = "shippingMonthlyInvoice",
}

type Props = {
  modalType: ModalType | "";
  setModalType: Dispatch<SetStateAction<"" | ModalType>>;
  isModalOpen: boolean;
  portalModalVisible: boolean;
  tokens: ICardAccountToken[] | undefined;
  cardAccountNo: number | undefined;
  selectedAccountId: number | undefined;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setPortalModalVisible: Dispatch<SetStateAction<boolean>>;
};

export const CardModalContainer = ({
  modalType,
  setModalType,
  isModalOpen,
  tokens,
  cardAccountNo,
  selectedAccountId,
  setIsModalOpen,
  portalModalVisible,
  setPortalModalVisible,
}: Props) => {
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);
  const [oneTimeCodeReference, setOneTimeCodeReference] = useState("");

  const { data: tempOneTimePasswordCode, refetch } =
    useOneTimePasswordCodeQuery(
      {
        reference: oneTimeCodeReference,
      },
      {
        skip: !oneTimeCodeReference,
      }
    );

  const content = useMemo(() => {
    switch (modalType) {
      case ModalType.ADDRESS_MODAL:
        return (
          <AddressModal
            setIsModalOpen={setIsModalOpen}
            accountId={selectedAccountId}
            cardAccountNo={cardAccountNo}
          />
        );
      case ModalType.CARD_REGISTRATION_CODE_APPLY_MODAL:
        return (
          <CardRegistrationCodeApplyModal
            setIsModalOpen={setIsModalOpen}
            setModalType={setModalType}
            setOneTimeCodeReference={setOneTimeCodeReference}
          />
        );
      case ModalType.CARD_REGISTRATION_MODAL:
        return (
          <CardRegistrationModal
            setIsModalOpen={setIsModalOpen}
            setOneTimeCodeReference={setOneTimeCodeReference}
          />
        );
      case ModalType.CLOSE_NOTIFICATION_MODAL:
        return (
          <CloseNotificationModal
            setIsModalOpen={setIsModalOpen}
            heading="Registrierungscode erfolgreich beantragt"
            firstParagraph="Sie erhalten Ihren Registrierungscode in den nächsten Tagen per Post."
            secondParagraph="Sie erhalten Ihren Registrierungscode in den nächsten Tagen per Post."
          />
        );
      case ModalType.LOCK_MAP_MODAL:
        return (
          <LockMapModal setIsModalOpen={setIsModalOpen} tokens={tokens!} />
        );
      case ModalType.REPLACE_CARD_MODAL:
        return (
          <LockMapModal
            setIsModalOpen={setIsModalOpen}
            tokens={tokens!}
            replaceCardModal
          />
        );
      case ModalType.NAME_EDIT_MODAL:
        return (
          <NameEditModal setIsModalOpen={setIsModalOpen} tokens={tokens!} />
        );
      case ModalType.INCREASE_LIMIT_MODAL:
        return (
          <IncreaseLimitModal
            setIsModalOpen={setIsModalOpen}
            tokens={tokens!}
            cardAccountNo={cardAccountNo}
          />
        );
      case ModalType.DECREASE_LIMIT_MODAL:
        return (
          <DecreaseLimitModal
            setIsModalOpen={setIsModalOpen}
            tokens={tokens!}
            cardAccountNo={cardAccountNo}
          />
        );
      case ModalType.CHANGE_EMAIL_MODAL:
        return (
          <ChangeEmailModal
            setIsModalOpen={setIsModalOpen}
            accountId={selectedAccountId}
            setOneTimeCodeReference={setOneTimeCodeReference}
            cardAccountNo={cardAccountNo}
          />
        );
      case ModalType.SHIPPING_MONTHLY_INVOICE:
        return (
          <ShipMonthlyInvoiceModal
            setIsModalOpen={setIsModalOpen}
            accountId={selectedAccountId}
            setOneTimeCodeReference={setOneTimeCodeReference}
            cardAccountNo={cardAccountNo}
          />
        );

      default:
        return null;
    }
  }, [
    modalType,
    selectedAccountId,
    setIsModalOpen,
    setModalType,
    tokens,
    setOneTimeCodeReference,
  ]);

  if (!portalModalVisible) {
    return null;
  }

  return (
    <Portal handlePortalNode={setPortalNode}>
      {portalNode && (
        <Modal
          className={styles.modalContent}
          isModalOpen={isModalOpen}
          onClose={setIsModalOpen}
          setPortalActive={() => {
            setPortalModalVisible(false);
            setModalType("");
          }}
        >
          {content}
        </Modal>
      )}
      {tempOneTimePasswordCode?.code && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Your code is: {tempOneTimePasswordCode?.code}
          </Alert>
        </Snackbar>
      )}
    </Portal>
  );
};
