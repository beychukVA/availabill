import { displayAPIErrorMessage } from "@/utils";
import { Trans, t } from "@lingui/macro";
import Image from "next/image";

import { Card } from "@mui/material";
import CardHeading from "@/components/CardSection/CardHeading/CardHeading";
import { CheckIcon } from "@/components/Icons/CheckIcon/CheckIcon";
import { ShoppingBagIcon } from "@/components/Icons/ShoppingBagIcon/ShoppingBagIcon";
import { BribeIcon } from "@/components/Icons/BribeIcon/BribeIcon";
import { ListIcon } from "@/components/Icons/ListIcon/ListIcon";
import { MoneyIcon } from "@/components/Icons/MoneyIcon/MoneyIcon";
import { RoundPlusIcon } from "@/components/Icons/RoundPlusIcon/RoundPlusIcon";
import { CreditCardIcon } from "@/components/Icons/CreditCardIcon/CreditCardIcon";
import { useCallback, useRef, useState } from "react";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import { CardsModal } from "@/components/CardsModal/CardsModal";
import { useRegisterCardMutation } from "@/redux/User/Cards/cards-slice";
import { Loading } from "@/components/Loading/Loading";
import { z } from "zod";
import { ICardAccountTranslations } from "@/utility/types";
import { useRouter } from "next/router";
import styles from "../Cards.module.scss";
import PaymentCardImage from "../../../assets/images/payment_card.png";

const registerCardSchema = z.object({
  cardNumber: z
    .string()
    .min(4, t`Bitte geben Sie eine gültige Kartennummer ein`),
  registrationCode: z.string().min(4, t`Bitte trage einen korrekten Code ein`),
});

interface ICardsPageProps {
  cardAccountTranslations: ICardAccountTranslations;
  fetchCards: () => any;
}

const NoCard = ({ cardAccountTranslations, fetchCards }: ICardsPageProps) => {
  const router = useRouter();

  const refAddNewEmailSection = useRef<HTMLDivElement | null>(null);
  const [registrationCode, setRegistrationCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [registrationCodeError, setRegistrationCodeError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [successfulCardRegistration, setSuccessfulCardRegistration] =
    useState(false);

  setTimeout(() => {
    const { query } = router;
    const scrollTo = query.scrollTo?.toString();
    if (
      scrollTo &&
      refAddNewEmailSection.current &&
      refAddNewEmailSection.current.id === scrollTo
    ) {
      window.scrollTo({
        top: refAddNewEmailSection.current.offsetTop - 74,
        behavior: "smooth",
      });
    }
  }, 1000);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [registerCard, { isError, error, isLoading }] =
    useRegisterCardMutation();

  const clearData = useCallback(() => {
    setRegistrationCodeError("");
    setCardNumberError("");
    setSuccessfulCardRegistration(false);
  }, [
    setRegistrationCodeError,
    setCardNumberError,
    setSuccessfulCardRegistration,
  ]);

  const handleRegisterCard = async () => {
    clearData();

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
      fetchCards();
      setRegistrationCode("");
      setCardNumber("");
    }
  };

  const handleRegistrationCode =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setRegistrationCode(event.target.value);
    };

  const handleCardNumber =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCardNumber(event.target.value);
    };

  if (!cardAccountTranslations) return null;

  return (
    <>
      <h2 className={styles.heading} data-testid="cardsTitle">
        {cardAccountTranslations?.cardsAndAccounts}
      </h2>
      <div className={styles.digitalServicesBlock}>
        <Card>
          <div className={styles.container}>
            <h3>{cardAccountTranslations?.digitalServices}</h3>
            <h5>{cardAccountTranslations?.securelyManageMediaMarkt}</h5>
            <div className={styles.listBlock}>
              <CardHeading
                className={styles.listBlockHeading}
                heading={cardAccountTranslations?.manageInvoice}
              >
                <CheckIcon color="#FF8000" />
              </CardHeading>
              <CardHeading
                className={styles.listBlockHeading}
                heading={cardAccountTranslations?.viewTransactions}
              >
                <ShoppingBagIcon color="#FF8000" />
              </CardHeading>
              <CardHeading
                className={styles.listBlockHeading}
                heading={cardAccountTranslations?.manageAccountLimits}
              >
                <MoneyIcon color="#FF8000" />
              </CardHeading>
              <CardHeading
                className={styles.listBlockHeading}
                heading={cardAccountTranslations?.orderReplacementCard}
              >
                <BribeIcon color="#FF8000" />
              </CardHeading>
              <CardHeading
                className={styles.listBlockHeading}
                heading={cardAccountTranslations?.changeAddress}
              >
                <ListIcon color="#FF8000" />
              </CardHeading>
              <CardHeading
                className={styles.listBlockHeading}
                heading={cardAccountTranslations?.blockCardOnline}
              >
                <ListIcon color="#FF8000" />
              </CardHeading>
            </div>
          </div>
        </Card>
      </div>
      <div className={styles.cardsContainer}>
        <div className={styles.cardsBlock}>
          <div className={styles.cardsBlockText}>
            <h3>
              Sie möchten Ihre Media Markt Card mit my.availabill verbinden?
            </h3>
            <p>
              Um Ihre Media Markt CLUB Shopping Card auf my.availabill.ch zu
              registrieren, benötigen Sie einen Registrierungscode. Den Code
              erhalten Sie von uns per Post.
            </p>
            <p>
              Klicken Sie auf das Kartenbild und beantragen Sie den
              Registrierungscode.
            </p>
            <div className={styles.registerCode}>
              <p>
                Sie haben bereits einen Registrierungscode? Dann können Sie Ihre
                Karte direkt registrieren.
              </p>
              <span>REGISTRIERUNGSCODE EINGEBEN</span>
            </div>
            <h5>Sie haben noch keine MediaMarkt CLUB Shopping Karte?</h5>
            <Button
              variant="black"
              mt={0}
              mb={0}
              ml={0}
              mr={10}
              pt={8}
              pb={8}
              width="fit-content"
              onClick={() => {
                if (refAddNewEmailSection.current) {
                  refAddNewEmailSection.current.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }}
            >
              MediaMarkt Karte beantragen
            </Button>
          </div>
          <div>
            <Card className={styles.cardsBlockCard}>
              <div>
                <Image
                  className={styles.paymentCard}
                  src={PaymentCardImage}
                  alt={t`Payment card`}
                  width={58}
                  height={36}
                />
                <h5>
                  <Trans>MediaMarkt CLUB Shopping Card</Trans>
                </h5>
              </div>
              <div
                className={styles.plusBlock}
                onClick={() => {
                  if (refAddNewEmailSection.current) {
                    refAddNewEmailSection.current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <RoundPlusIcon />
              </div>
            </Card>
          </div>
          <div>
            <Card className={styles.cardsBlockCard}>
              <div>
                <CreditCardIcon />
                <h5>{cardAccountTranslations?.moreCardsAvailableSoon}</h5>
              </div>
              <div className={styles.plusBlock}>
                <RoundPlusIcon />
              </div>
            </Card>
          </div>
        </div>
      </div>
      <div
        id="AddNewCardSection"
        ref={refAddNewEmailSection}
        className={styles.registrationBlock}
      >
        <Card>
          <div className={styles.container}>
            <h3>Geben Sie hier Ihren Registrierungscode ein</h3>
            <div className={styles.inputsContainer}>
              <h5>{cardAccountTranslations?.weHaveSentYouRegisterCode}</h5>
              <div className={styles.inputBlock}>
                <div>
                  <Input
                    mt={26}
                    label={cardAccountTranslations?.registerCodeLabel}
                    type="code"
                    placeholder="-- -- -- --"
                    textError=""
                    value={registrationCode}
                    anchor="registrationCode"
                    onChange={handleRegistrationCode}
                  />
                  {registrationCodeError && (
                    <div
                      className={styles.registerCardError}
                      data-testid="registrationCodeError"
                    >
                      {registrationCodeError}
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    mt={26}
                    label={cardAccountTranslations?.cardNumberLabel}
                    type="code"
                    placeholder="-- -- -- --"
                    value={cardNumber}
                    anchor="cardNumber"
                    onChange={handleCardNumber}
                  />
                  {cardNumberError && (
                    <div
                      className={styles.registerCardError}
                      data-testid="cardNumberError"
                    >
                      {cardNumberError}
                    </div>
                  )}
                </div>
              </div>
              <h5 className={styles.resendCode}>
                Sie haben keinen Registrierungscode erhalten?{" "}
                <span onClick={() => setIsModalOpen(true)}>
                  Registrierungscode beantragen
                </span>
              </h5>
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
                Jetzt karte registrieren
              </Button>
              {isError && (
                <div
                  className={styles.registerCardErrorGeneral}
                  data-testid="registerCardError"
                >
                  <Trans>
                    Entschuldigung, da war ein Fehler:{" "}
                    {displayAPIErrorMessage(error)}
                  </Trans>
                </div>
              )}
              {successfulCardRegistration && (
                <div>
                  <h5 className={styles.registerCardSuccessGeneral}>
                    <Trans>
                      Herzlichen Glückwunsch, Sie haben Ihre Karte erfolgreich
                      registriert
                    </Trans>
                  </h5>
                </div>
              )}
            </div>
            {isLoading && <Loading className={styles.loading} />}
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoBlock}>
              <h5>
                <span>
                  <Trans>Hinweis:</Trans>
                </span>{" "}
                {cardAccountTranslations?.principalCardHoldersNote}
              </h5>
            </div>
          </div>
        </Card>
      </div>
      <CardsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

export default NoCard;
