import React, { Dispatch, SetStateAction, useState } from "react";
import { t } from "@lingui/macro";
import { pluckError } from "@/utils";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useChangeAddressMutation } from "@/redux/User/Accounts/account-slice";
import styles from "./AddressModal.module.scss";
import { Button } from "../../../common/Button/Button";
import { Input } from "../../../common/Input/Input";

const AddressModal = ({
  setIsModalOpen,
  accountId,
  cardAccountNo,
}: {
  accountId: number | undefined;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  cardAccountNo: number | undefined;
}) => {
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [success, setSuccess] = useState(false);

  const [changeAddress, { error }] = useChangeAddressMutation();

  const setCountryHandler = ({ target: { value } }: SelectChangeEvent) => {
    setCountry(value);
  };

  const changeAddressHandler = async () => {
    await changeAddress({
      street,
      zipCode,
      city,
      country,
      accountId: accountId!,
    }).unwrap();

    setSuccess(true);
  };

  const changeAddressError = error as any;

  if (changeAddressError) {
    return (
      <div className={styles.modalInnerContent}>
        <h4>Error</h4>
        <div>
          <p>
            {pluckError(
              changeAddressError,
              "Could not complete address change at this time"
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
            Speichern
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.modalInnerContent}>
        <h4>Vielen Dank für Ihre Angaben</h4>
        <div>
          <p>MediaMarkt CLUB Shopping Card</p>
          <p>Kontonummer: {cardAccountNo}</p>
        </div>
        <div>
          <p>
            Ihre Adresse wird für Ihr Media Markt Konto aktualisiert. Dies kann
            einige Minuten dauern.
          </p>
        </div>
        <div className={styles.buttonBlock}>
          <Button
            disabled={!street || !zipCode || !country || !city}
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
      <h4>Geben Sie Ihre Adresse ein</h4>
      <div>
        <p>MediaMarkt CLUB Shopping Card</p>
        <p>Kontonummer: {cardAccountNo}</p>
      </div>
      <div className={styles.inputsBlock}>
        <div className={styles.modalForm}>
          <Input
            label={t`Strasse und Nr.`}
            type="code"
            mt={24}
            anchor="street"
            value={street}
            onChange={(prop: string) =>
              (event: React.ChangeEvent<HTMLInputElement>) =>
                setStreet(event.target.value)}
          />

          <div className={styles.innerInputs}>
            <Input
              label={t`PLZ`}
              mt={24}
              type="code"
              value={zipCode}
              anchor="postalCode"
              onChange={(prop: string) =>
                (event: React.ChangeEvent<HTMLInputElement>) =>
                  setZipCode(event.target.value)}
            />
            <Input
              label={t`ORT`}
              mt={24}
              type="code"
              value={city}
              anchor="city"
              onChange={(prop: string) =>
                (event: React.ChangeEvent<HTMLInputElement>) =>
                  setCity(event.target.value)}
            />
          </div>
          <div className={styles.selectGroup}>
            <FormControl size="small" fullWidth>
              <Select
                value={country}
                fullWidth
                onChange={setCountryHandler}
                displayEmpty
                data-testid="tableSelectTransactionType"
              >
                <MenuItem value="Schweiz">Schweiz</MenuItem>
                <MenuItem value="Liechtenstein">Liechtenstein</MenuItem>
              </Select>
            </FormControl>
            <p>Anderes Land? Bitte kontaktieren Sie unseren Kundenservice.</p>
          </div>
        </div>
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
          disabled={!street || !zipCode || !country || !city}
          variant="black"
          mt={0}
          mb={0}
          ml={0}
          mr={10}
          pt={8}
          pb={8}
          width="fit-content"
          onClick={() => changeAddressHandler()}
        >
          Speichern
        </Button>
      </div>
    </div>
  );
};

export default AddressModal;
