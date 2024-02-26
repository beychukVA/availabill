import React, { Dispatch, SetStateAction, useState } from "react";
import { t } from "@lingui/macro";
import { ICardAccountToken } from "@/redux/User/Accounts/account-slice";
import { useDecreaseLimitMutation } from "@/redux/User/Cards/cards-slice";
import { hideCardNumber, pluckError } from "@/utils";
import styles from "./DecreaseLimitModal.module.scss";
import { Radio } from "../../../common/Radio/Radio";
import { Button } from "../../../common/Button/Button";
import { Input } from "../../../common/Input/Input";

const DecreaseLimitModal = ({
  setIsModalOpen,
  tokens,
  cardAccountNo,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  tokens: ICardAccountToken[] | undefined;
  cardAccountNo: number | undefined;
}) => {
  const [newLimit, setNewLimit] = useState("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const [decreaseLimit, { error }] = useDecreaseLimitMutation();

  const decreaseLimitMutationError = error as any;

  const decreaseLimitHandler = async () => {
    await decreaseLimit({
      newLimit,
      tokenId: selectedCardId!,
    }).unwrap();

    setShowSuccess(true);
  };

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewLimit(event.target.value);
    };

  if (decreaseLimitMutationError) {
    return (
      <div className={styles.modalInnerContent}>
        <h4>Error</h4>
        <p>
          {pluckError(
            decreaseLimitMutationError,
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

  if (showSuccess) {
    return (
      <div className={styles.modalInnerContent}>
        <h4>Erfolgreiche Limitsenkung</h4>
        <p>
          Sie haben erfolgreich eine Aufforderung zur Reduzierung des Limits
          übermittelt
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

  return (
    <div className={styles.modalInnerContent}>
      <h4>Geben Sie Ihre Wunschlimite an</h4>
      <div>
        <p>MediaMarkt CLUB Shopping Card</p>
        <p>Kontonummer: {cardAccountNo}</p>
      </div>
      <div>
        {tokens?.map(({ token, id }) => (
          <Radio
            key={id}
            text={hideCardNumber(token)}
            onChange={() => setSelectedCardId(id)}
            value={token}
            mb={20}
            className={styles.modalRadio}
            checked={id === selectedCardId}
          />
        ))}
      </div>
      <div className={styles.innerInputs}>
        <Input
          label={t`Neue Wunschlimite`}
          mt={24}
          type="text"
          value={newLimit}
          anchor="NeueWunschlimite"
          onChange={handleChange}
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
          disabled={!newLimit || !selectedCardId}
          variant="black"
          mt={0}
          mb={0}
          ml={0}
          mr={10}
          pt={8}
          pb={8}
          width="fit-content"
          onClick={decreaseLimitHandler}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default DecreaseLimitModal;
