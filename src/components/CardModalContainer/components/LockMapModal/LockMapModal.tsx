import React, { Dispatch, SetStateAction, useState } from "react";
import { ICardAccountToken } from "@/redux/User/Accounts/account-slice";
import { useLockCardMutation } from "@/redux/User/Cards/cards-slice";
import { hideCardNumber, pluckError } from "@/utils";
import { useAppSelector } from "@/redux/store";
import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";
import styles from "./LockMapModal.module.scss";
import { Radio } from "../../../common/Radio/Radio";
import { Button } from "../../../common/Button/Button";

const lockReasons = ["Gestohlen", "Verloren", "Defekt"];

const LockMapModal = ({
  setIsModalOpen,
  tokens,
  replaceCardModal,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  tokens: ICardAccountToken[];
  replaceCardModal?: boolean;
}) => {
  const token = useAppSelector((state) => state.user.token);
  const { data: currentUser } = useGetCurrentUserQuery(token);

  const [selectedCard, setSelectedCard] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [lockCard, { error }] = useLockCardMutation();

  const lockCardHandler = async () => {
    await lockCard({
      lockReason: selectedReason,
      tokenId: selectedId!,
    }).unwrap();

    setShowSuccess(true);
  };

  const lockCardMutationError = error as any;

  const selectedCardHandler = ({
    token,
    id,
  }: {
    token: string;
    id: number;
  }) => {
    setSelectedCard(token);
    setSelectedId(id);
  };

  if (showSuccess) {
    return (
      <div className={styles.modalInnerContent}>
        <div className={styles.errorLockCardInfo}>
          <h4>Successfully completed request</h4>
          <p>
            Your request was successfully completed. Your card will be locked
            and we will notify you about next steps
          </p>
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
            Weiter
          </Button>
        </div>
      </div>
    );
  }

  if (lockCardMutationError) {
    return (
      <div className={styles.modalInnerContent}>
        <div className={styles.errorLockCardInfo}>
          <h4>Sorry</h4>
          <p>
            {pluckError(
              lockCardMutationError,
              "Could not complete card lock at this time"
            )}
          </p>
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
            Weiter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalInnerContent}>
      <h4>{replaceCardModal ? "Karte ersetzen" : "Karte sperren"}</h4>
      <p>
        Geben Sie an, welche Karte Sie sperren möchten. Wir schicken Ihnen eine
        neue Karte an {currentUser?.email} zu.
      </p>
      <h6>Adresse ändern</h6>
      <div>
        {tokens.map(({ token, id }) => (
          <Radio
            key={token}
            text={hideCardNumber(token)}
            onChange={() => selectedCardHandler({ token, id })}
            value={token}
            mb={20}
            className={styles.modalRadio}
            checked={selectedCard === token}
          />
        ))}
      </div>
      <p className={styles.bottomParagraph}>
        {replaceCardModal
          ? 'Weshalb möchten Sie Ihre Karte ersetzen? Sollten Ihre Kartendaten gefahrdet sein, wahlen Sie bitte "Verloren" oder "Gestohlen"'
          : "Weshalb möchten Sie Ihre Karte sperren?"}
      </p>
      <div>
        {lockReasons.map((reason) => (
          <Radio
            key={reason}
            text={reason}
            onChange={() => setSelectedReason(reason)}
            mb={20}
            value={reason}
            checked={reason === selectedReason}
          />
        ))}
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
          disabled={!selectedCard || !selectedReason}
          variant="black"
          mt={0}
          mb={0}
          ml={0}
          mr={10}
          pt={8}
          pb={8}
          width="fit-content"
          onClick={() => lockCardHandler()}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default LockMapModal;
