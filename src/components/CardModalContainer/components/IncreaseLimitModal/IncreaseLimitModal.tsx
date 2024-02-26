import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { t } from "@lingui/macro";
import { ICardAccountToken } from "@/redux/User/Accounts/account-slice";
import { useIncreaseLimitMutation } from "@/redux/User/Cards/cards-slice";
import { UploadIcon } from "@/components/Icons/UploadIcon/UploadIcon";
import { hideCardNumber, pluckError } from "@/utils";
import styles from "./IncreaseLimitModal.module.scss";
import { Radio } from "../../../common/Radio/Radio";
import { Button } from "../../../common/Button/Button";
import { Input } from "../../../common/Input/Input";

const IncreaseLimitModal = ({
  setIsModalOpen,
  tokens,
  cardAccountNo,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  tokens: ICardAccountToken[] | undefined;
  cardAccountNo: number | undefined;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newLimit, setNewLimit] = useState("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [increaseLimit, { error }] = useIncreaseLimitMutation();

  const increaseLimitMutationError = error as any;

  const handleUploadDoc = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    setSelectedFile(file);
  };

  const increaseLimitHandler = async () => {
    const formData = new FormData();
    formData.append("attachments", selectedFile!);

    await increaseLimit({
      newLimit,
      tokenId: selectedCardId!,
      formData,
    }).unwrap();

    setShowSuccess(true);
  };

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewLimit(event.target.value);
    };

  if (increaseLimitMutationError) {
    return (
      <div className={styles.modalInnerContent}>
        <h4>Error</h4>
        <p>
          {pluckError(
            increaseLimitMutationError,
            "Could not complete name change at this time"
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
        <h4>Limit erfolgreich erhöht</h4>
        <p>
          Sie haben erfolgreich eine Aufforderung zur Erhöhung des Limits
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
      <div className={styles.iconText} onClick={handleUploadDoc}>
        <div className={styles.icon}>
          <UploadIcon />
        </div>
        <p>
          Bitte laden Sie die letzten 3 aktuellen Lohnausweise hier hoch.
          Akzeptierte Formate: PDF, ...
        </p>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      {selectedFile && (
        <p className={styles.selectedFile}>{selectedFile.name}</p>
      )}
      <div className={styles.iconText}>
        <div className={styles.reverseIcon}>
          <UploadIcon />
        </div>
        <p>
          Alternativ können Sie den Antrag für eine Limitenerhöhung hier
          herunterladen.
        </p>
      </div>
      <div>
        <p>
          Ihre individuelle Kreditlimite wird im Rahmen der
          Kreditfähigkeitsprüfung ermittelt und Ihnen im Anschluss schriftlich
          mitgeteilt. Entscheidend sind Einkommensverhältnisse sowie die beim
          IKO gemeldeten Kredite.
        </p>
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
          disabled={!newLimit || !selectedCardId || !selectedFile}
          variant="black"
          mt={0}
          mb={0}
          ml={0}
          mr={10}
          pt={8}
          pb={8}
          width="fit-content"
          onClick={increaseLimitHandler}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default IncreaseLimitModal;
