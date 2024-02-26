import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Trans, t } from "@lingui/macro";
import { useLinkCardMutation } from "@/redux/User/Cards/cards-slice";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { z } from "zod";
import { format } from "date-fns";
import { displayAPIErrorMessage } from "@/utils";
import { useOneTimePasswordCodeQuery } from "@/redux/Auth/auth-slice";
import { useAppSelector } from "@/redux/store";
import { CalendarIcon } from "@/components/Icons/CalendarIcon/CalendarIcon";
import { Loading } from "@/components/Loading/Loading";
import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import styles from "./CardRegistrationCodeApplyModal.module.scss";

interface IProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setModalType: React.Dispatch<React.SetStateAction<any>>;
  setOneTimeCodeReference: React.Dispatch<React.SetStateAction<string>>;
}

const dateOfBirthSchema = z.date({
  required_error: t`Geburtsdatum ist nicht angegeben`,
  invalid_type_error: t`ungültiges Datum`,
});

const cardNumberSchema = z
  .string()
  .min(4, t`Bitte geben Sie eine gültige Kartennummer an`);

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

export const CardRegistrationCodeApplyModal: React.FC<IProps> = ({
  setIsModalOpen,
  setModalType,
  setOneTimeCodeReference,
}) => {
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [dateError, setDateError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");

  const { cardAccountTranslations } = useAppSelector(
    (state) => state.translations
  );

  const handleCardNumber =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCardNumber(event.target.value);
    };

  const [linkCard, { isError, error, isLoading, reset }] =
    useLinkCardMutation();

  useEffect(() => {
    if (isError) {
      setOneTimeCodeReference("cardNumber");
    }

    return () => {
      setOneTimeCodeReference("");
    };
  }, [cardNumber, isError, setOneTimeCodeReference, showSuccessMessage]);

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
      setShowSuccessMessage(true);
    }
  }, [cardNumber, dateOfBirth, linkCard, setDateError, setCardNumberError]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className={styles.loadingBlock}>
          <Loading />
        </div>
      );
    }

    if (isError) {
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
              {displayAPIErrorMessage(error)}
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
          <h2>{cardAccountTranslations?.regCodeApplied}</h2>
          <h5>{cardAccountTranslations?.receiveCodeInfoTxt}</h5>
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
              {cardAccountTranslations?.close}
            </Button>
          </div>
        </>
      );
    }

    return (
      <>
        <h2>{cardAccountTranslations?.applyForRegCode}</h2>
        <h5>{cardAccountTranslations?.enterDobCardNumber}</h5>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date"
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
            onClick={handleSend}
          >
            {cardAccountTranslations?.send}
          </Button>
        </div>
      </>
    );
  }, [
    isLoading,
    isError,
    showSuccessMessage,
    cardAccountTranslations?.applyForRegCode,
    cardAccountTranslations?.enterDobCardNumber,
    cardAccountTranslations?.send,
    cardAccountTranslations?.regCodeApplied,
    cardAccountTranslations?.receiveCodeInfoTxt,
    cardAccountTranslations?.close,
    dateOfBirth,
    dateError,
    cardNumber,
    cardNumberError,
    handleSend,
    error,
    setIsModalOpen,
  ]);

  return (
    <div className={styles.modalInnerContent}>
      {content}
      {/* {tempOneTimePasswordCode?.code && isModalOpen && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Your code is: {tempOneTimePasswordCode.code}
          </Alert>
        </Snackbar>
      )} */}
    </div>
  );
};
