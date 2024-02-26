import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Trans, t } from "@lingui/macro";
import {
  useLinkCardMutation,
  useRegisterCardMutation,
} from "@/redux/User/Cards/cards-slice";
import { format } from "date-fns";
import { z } from "zod";
import { CalendarIcon } from "@/components/Icons/CalendarIcon/CalendarIcon";
import { Loading } from "@/components/Loading/Loading";
import { displayAPIErrorMessage } from "@/utils";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Input } from "../../../common/Input/Input";
import { Button } from "../../../common/Button/Button";
import styles from "./CardRegistrationModal.module.scss";

const dateOfBirthSchema = z.date({
  required_error: t`Geburtsdatum ist nicht angegeben`,
  invalid_type_error: t`ungültiges Datum`,
});

const registerCardSchema = z.object({
  cardNumber: z
    .string()
    .min(4, t`Bitte geben Sie eine gültige Kartennummer ein`),
  registrationCode: z.string().min(4, t`Bitte trage einen korrekten Code ein`),
});

const BrowserInput = (props: any) => {
  const { inputProps, InputProps, ownerState, inputRef, error, ...other } =
    props;

  return (
    <div ref={InputProps?.ref}>
      <label htmlFor="dateInput" className={styles.label}>
        <Trans>Geburtsdatum</Trans>
      </label>
      <div style={{ position: "relative" }}>
        <div className={styles.icon}>{InputProps?.endAdornment}</div>
        <input
          name="dateInput"
          ref={inputRef}
          {...inputProps}
          {...(other as any)}
          className={styles.input}
        />
      </div>
    </div>
  );
};

const CardRegistrationModal = ({
  setIsModalOpen,
  setOneTimeCodeReference,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setOneTimeCodeReference: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [dateError, setDateError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [registerCardActive, setRegisterCardActive] = useState(false);
  const [registrationCode, setRegistrationCode] = useState("");
  const [registrationCodeError, setRegistrationCodeError] = useState("");
  const [successfulCardRegistration, setSuccessfulCardRegistration] =
    useState(false);

  const handleCardNumber =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCardNumber(event.target.value);
    };

  useEffect(() => {
    setOneTimeCodeReference("");
  }, [setOneTimeCodeReference]);

  const cardNumberSchema = z
    .string()
    .min(4, t`Bitte geben Sie eine gültige Kartennummer an`);

  const [linkCard, { isError, error, isLoading, reset }] =
    useLinkCardMutation();

  const handleSend = useCallback(async () => {
    setDateError("");
    setCardNumberError("");

    const dateOfBirthValidation = dateOfBirthSchema.safeParse(dateOfBirth);
    const cardNumberValidation = cardNumberSchema.safeParse(cardNumber);

    if (!dateOfBirthValidation.success) {
      setDateError(
        dateOfBirthValidation.error.issues[0]?.message || t`ungültiges Datum`
      );

      return;
    }

    if (!cardNumberValidation.success) {
      setCardNumberError(
        cardNumberValidation.error.issues[0]?.message ||
          t`Ungültige Kartennummer`
      );

      return;
    }

    const formatedDate = format(dateOfBirth!, "yyyy-MM-dd");

    const { message } = await linkCard({
      dateOfBirth: formatedDate,
      token: cardNumber,
    }).unwrap();

    if (message) {
      // setShowSuccessMessage(true);
      setOneTimeCodeReference(cardNumber);
      setRegisterCardActive(true);
    }
  }, [
    dateOfBirth,
    cardNumberSchema,
    cardNumber,
    linkCard,
    setOneTimeCodeReference,
  ]);

  const handleRegistrationCode =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setRegistrationCode(event.target.value);
    };

  const [
    registerCard,
    {
      isError: registerCardIsError,
      error: registerCardError,
      isLoading: registerCardIsLoading,
    },
  ] = useRegisterCardMutation();

  const handleRegisterCard = async () => {
    const registerCardValidation = registerCardSchema.safeParse({
      cardNumber,
      registrationCode,
    });

    if (!registerCardValidation.success) {
      setCardNumberError(registerCardValidation.error.issues[0]?.message || "");
      setRegistrationCodeError(
        registerCardValidation.error.issues[1]?.message || ""
      );

      return;
    }

    const { message } = await registerCard({
      code: registrationCode,
      token: cardNumber,
    }).unwrap();

    if (message) {
      setSuccessfulCardRegistration(true);
      setRegistrationCode("");
      setCardNumber("");
    }
  };

  if (isLoading || registerCardIsLoading) {
    return (
      <div className={styles.loadingBlock}>
        <Loading />
      </div>
    );
  }

  if (isError || registerCardIsError) {
    return (
      <>
        <h2 data-testid="registerCardErrorHeading">
          <Trans>Fehler passiert</Trans>
        </h2>
        <h5>
          <Trans>
            Entschuldigung, beim Verknüpfen der Karte mit Ihrem Konto ist ein
            Fehler aufgetreten
          </Trans>
        </h5>
        <h5>
          <Trans>
            Fehler:
            {displayAPIErrorMessage(error || registerCardError)}
          </Trans>
        </h5>
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
            <Trans>schliessen</Trans>
          </Button>
        </div>
      </>
    );
  }

  if (showSuccessMessage) {
    return (
      <>
        <h2>Registrierungscode erfolgreich beantragt</h2>
        <h5>
          Sie erhalten Ihren Registrierungscode in den nächsten Tagen per Post.
        </h5>
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
            schliessen
          </Button>
        </div>
      </>
    );
  }

  if (successfulCardRegistration) {
    return (
      <>
        <h2>Glückwunsch!</h2>
        <h5>
          Sie haben Ihre Karte erfolgreich registriert. Ihre Karte ist jetzt mit
          dem Portal verbunden und Sie können das Kartenkonto hier verwalten.{" "}
        </h5>
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
            schliessen
          </Button>
        </div>
      </>
    );
  }

  if (registerCardActive) {
    return (
      <div className={styles.modalInnerContent}>
        <h4>Registrieren Sie Ihre Karte</h4>
        <p>Geben Sie Ihren Registrierungscode und die Kartennummer ein</p>
        <p>Sie haben keinen Registrierungscode erhalten?</p>
        <h6
          className={styles.link}
          onClick={() => setRegisterCardActive(false)}
        >
          Registrierungscode beantragen
        </h6>
        <div className={styles.inputsBlock}>
          <Input
            mt={26}
            label="Registrierungscode"
            type="code"
            placeholder="-- -- -- --"
            textError=""
            value={registrationCode}
            anchor="registrationCode"
            onChange={handleRegistrationCode}
          />
          {registrationCodeError && (
            <div
              className={styles.inputError}
              data-testid="registrationCodeError"
            >
              {registrationCodeError}
            </div>
          )}
          <Input
            mt={26}
            label={t`Kartennummer`}
            type="code"
            placeholder="-- -- -- --"
            value={cardNumber}
            anchor="cardNumber"
            onChange={handleCardNumber}
          />
          {cardNumberError && (
            <div className={styles.inputError}>{cardNumberError}</div>
          )}
        </div>
        <div className={styles.buttonBlock}>
          <Button
            variant="gray"
            mt={0}
            mb={0}
            ml={0}
            mr={10}
            pt={8}
            pb={8}
            width="fit-content"
            onClick={() => setIsModalOpen(false)}
          >
            Abbrechen
          </Button>
          <Button
            variant="black"
            mt={0}
            mb={0}
            ml={0}
            mr={10}
            pt={8}
            pb={8}
            width="fit-content"
            onClick={handleRegisterCard}
          >
            Beantragen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalInnerContent}>
      <h4>Registrierungscode beantragen</h4>
      <p>
        Bitte geben Sie Ihr Geburtsdatum und die Kartennummer an. Wir senden
        Ihnen den Registrierungscode per Post zu.
      </p>
      <p>
        Sie haben bereits einen Registrierungscode erhalten? Dann können Sie
        Ihre Karte direkt registrieren.
      </p>
      <h6 className={styles.link} onClick={() => setRegisterCardActive(true)}>
        Karte jetzt registrieren
      </h6>
      <div className={styles.inputsBlock}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Geburtsdatum"
            value={dateOfBirth}
            onChange={(newValue) => setDateOfBirth(newValue)}
            format="dd.MM.yyyy"
            slots={{
              textField: BrowserInput,
              openPickerIcon: CalendarIcon,
            }}
          />
        </LocalizationProvider>
        {dateError && <div className={styles.inputError}>{dateError}</div>}
        <Input
          mt={26}
          label={t`Kartennummer`}
          type="code"
          placeholder="-- -- -- --"
          value={cardNumber}
          anchor="cardNumber"
          onChange={handleCardNumber}
        />
        {cardNumberError && (
          <div className={styles.inputError}>{cardNumberError}</div>
        )}
      </div>
      <div className={styles.buttonBlock}>
        <Button
          variant="gray"
          mt={0}
          mb={0}
          ml={0}
          mr={10}
          pt={8}
          pb={8}
          width="fit-content"
          onClick={() => setIsModalOpen(false)}
        >
          Abbrechen
        </Button>
        <Button
          variant="black"
          mt={0}
          mb={0}
          ml={0}
          mr={10}
          pt={8}
          pb={8}
          width="fit-content"
          onClick={handleSend}
        >
          Beantragen
        </Button>
      </div>
    </div>
  );
};

export default CardRegistrationModal;
