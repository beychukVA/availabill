import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { t } from "@lingui/macro";
import { ICardAccountToken } from "@/redux/User/Accounts/account-slice";
import { useChangeNameMutation } from "@/redux/User/Cards/cards-slice";
import { UploadIcon } from "@/components/Icons/UploadIcon/UploadIcon";
import { hideCardNumber, pluckError } from "@/utils";
import styles from "./NameEditModal.module.scss";
import { Radio } from "../../../common/Radio/Radio";
import { Button } from "../../../common/Button/Button";
import { Input } from "../../../common/Input/Input";

const NameEditModal = ({
  setIsModalOpen,
  tokens,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  tokens: ICardAccountToken[] | undefined;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<"F" | "M">("M");
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [changeName, { error }] = useChangeNameMutation();

  const nameEditMutationError = error as any;

  const handleUploadDoc = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    setSelectedFile(file);
  };

  const changeNameHandler = async () => {
    const formData = new FormData();
    formData.append("attachments", selectedFile!);

    await changeName({
      firstName,
      lastName,
      gender,
      tokenId: selectedCardId!,
      formData,
    }).unwrap();

    setShowSuccess(true);
  };

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (prop === "firstName") {
        setFirstName(event.target.value);
      } else if (prop === "lastName") {
        setLastName(event.target.value);
      }
    };

  if (nameEditMutationError) {
    return (
      <div className={styles.modalInnerContent}>
        <h4>Error</h4>
        <p>
          {pluckError(
            nameEditMutationError,
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
        <h4>Sie erhalten eine neue Karte</h4>
        <p>Wir senden Ihnen die neue Karte zu.</p>
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
      <h4>Geben Sie Ihren neuen Namen an</h4>
      <p>
        Welche Karte betrifft die Namensänderung? Wir schicken Ihnen eine neue
        Karte an Adresse zu. ÄNDERN.
      </p>
      <h6>Adresse ändern</h6>
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
      <h6>Machen Sie Ihre Angaben</h6>
      <div className={styles.inlineRadio}>
        <Radio
          text="Herr"
          onChange={() => setGender("M")}
          mb={20}
          value="Herr"
          checked={gender === "M"}
        />
        <Radio
          text="Frau"
          onChange={() => setGender("F")}
          mb={20}
          value="Frau"
          checked={gender === "F"}
        />
      </div>
      <div className={styles.innerInputs}>
        <Input
          label={t`Vorname`}
          mt={24}
          type="text"
          value={firstName}
          anchor="firstName"
          onChange={handleChange}
        />
        <Input
          label={t`Nachname`}
          mt={24}
          type="text"
          value={lastName}
          anchor="lastName"
          onChange={handleChange}
        />
      </div>
      <div className={styles.iconText} onClick={handleUploadDoc}>
        <div className={styles.icon}>
          <UploadIcon />
        </div>
        <p>
          Bitte laden Sie eine Kopie eines gültigen, amtlichen Dokuments
          hoch(Identitätskarte, Pass oder Heiratsurkunde - für Ausländer ist die
          Kopie des Ausländerausweises zwingend). Akzeptierte Formate: PDF....
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
          Alternativ können Sie das Formular zur Namensänderung als PDF zum
          Einschicken per Post oder E-Mail hier herunterladen.
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
          disabled={
            !gender ||
            !firstName ||
            !lastName ||
            !selectedCardId ||
            !selectedFile
          }
          variant="black"
          mt={0}
          mb={0}
          ml={0}
          mr={10}
          pt={8}
          pb={8}
          width="fit-content"
          onClick={changeNameHandler}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default NameEditModal;
