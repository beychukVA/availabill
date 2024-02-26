import { hideCardNumber, toFixedAmount } from "@/utils";
import { Trans, t } from "@lingui/macro";
import Image from "next/image";

import { Card } from "@mui/material";

import { RoundPlusIcon } from "@/components/Icons/RoundPlusIcon/RoundPlusIcon";
import { useCallback, useEffect, useState } from "react";
import { ICardAccountTranslations } from "@/utility/types";
import { setCardAccountTranslations } from "@/redux/Strapi/strapi-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { VerifiedCard } from "@/components/Icons/VerifiedCard/VerifiedCard";
import clsx from "clsx";
import { GraphIcon } from "@/components/Icons/GraphIcon/GraphIcon";
import { DivideIcon } from "@/components/Icons/DivideIcon/DivideIcon";
import { LockIcon } from "@/components/Icons/LockIcon/LockIcon";
import { RewindIcon } from "@/components/Icons/RewindIcon/RewindIcon";
import { LocationIcon } from "@/components/Icons/LocationIcon/LocationIcon";

import AccordionComponent from "@/components/Accordion/Accordion";
import PaymentProgress from "@/components/CardSection/PaymentProgress/PaymentProgress";
import CardAccordionTable from "@/components/CardAccordionTable/CardAccordionTable";
import {
  CardModalContainer,
  ModalType,
} from "@/components/CardModalContainer/CardModalContainer";
import { AddNewCardIcon } from "@/components/Icons/AddNewCardIcon/AddNewCardIcon";
import CardActionItemWAccordion from "@/components/CardActionItemWAccordion/CardActionItemWAccordion";
import Link from "next/link";
import {
  ICurrentUserAccounts,
  useGetCardAccountInfoQuery,
  useGetCardAccountPersonQuery,
  useGetCardAccountQuery,
  useGetCardAccountTokensQuery,
} from "@/redux/User/Accounts/account-slice";
import styles from "./Card.module.scss";
import PaymentCardImage from "../../../assets/images/payment_card.png";
import MediaMarkt from "../../../assets/images/media-markt.png";
import Graph from "./Graph";

interface ICardsPageProps {
  cardAccountTranslations: ICardAccountTranslations;
  cardAccounts: ICurrentUserAccounts[];
}

const WithCard = ({
  cardAccountTranslations,
  cardAccounts,
}: ICardsPageProps) => {
  const token = useAppSelector((state) => state.user.token);

  const dispatch = useAppDispatch();
  const [modalType, setModalType] = useState<ModalType | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portalModalVisible, setPortalModalVisible] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<
    number | undefined
  >();
  const [selectedToken, setSelectedToken] = useState<number | undefined>();

  useEffect(() => {
    dispatch(setCardAccountTranslations(cardAccountTranslations));
  }, [dispatch, cardAccountTranslations]);

  const { data: cardAccount } = useGetCardAccountQuery(
    {
      token,
      cardAccountId: selectedAccountId,
    },
    { skip: !selectedAccountId }
  );

  const { data: cardAccountPerson } = useGetCardAccountPersonQuery(
    {
      token,
      cardAccountId: selectedAccountId,
    },
    { skip: !selectedToken }
  );

  const { data: cardAccountInfo } = useGetCardAccountInfoQuery(
    {
      token,
      cardAccountId: selectedAccountId,
    },
    { skip: !selectedAccountId }
  );

  useEffect(() => {
    if (cardAccounts.length) {
      setSelectedAccountId(cardAccounts[0].id);
    }
  }, [cardAccounts]);

  const { data: tokens } = useGetCardAccountTokensQuery(
    {
      token,
      cardAccountId: selectedAccountId,
      amount: 100,
    },
    { skip: cardAccounts.length === 0 || !selectedAccountId }
  );

  useEffect(() => {
    if (tokens?.content.length) {
      setSelectedToken(tokens.content[0].id);

      return;
    }

    setSelectedToken(undefined);
  }, [tokens]);

  const openModal = useCallback((modalType: ModalType) => {
    setModalType(modalType);
    setIsModalOpen(true);
    setPortalModalVisible(true);
  }, []);

  const tokenData = tokens?.content.find((token) => token.id === selectedToken);

  return (
    <>
      <h2 className={styles.heading} data-testid="cardsTitle">
        {cardAccountTranslations?.cardsAndAccounts}
      </h2>
      <div className={styles.cardsContainer}>
        <div className={styles.cardsBlock}>
          {cardAccounts.map((cardAccount) => (
            <Card
              key={cardAccount.id}
              className={styles.cardsBlockCard}
              onClick={() => setSelectedAccountId(cardAccount.id)}
              style={{
                border:
                  selectedAccountId === cardAccount.id
                    ? "1px solid gray"
                    : "1px solid white",
                transition: "0.2s ease-in-out",
              }}
            >
              <div style={{ maxWidth: "80%" }}>
                <Image
                  className={styles.paymentCard}
                  src={PaymentCardImage}
                  alt={t`Payment card`}
                  width={58}
                  height={36}
                />
                <h5>
                  <Trans>{cardAccount.name}</Trans>
                </h5>
                <h6>{cardAccount.email}</h6>
              </div>
              <span className={styles.verified}>
                <VerifiedCard color="#ff8000" />
              </span>
            </Card>
          ))}
          <Card className={clsx(styles.cardsBlockCard, styles.withPlus)}>
            <div>
              <AddNewCardIcon />
              <h5>Weitere MediaMarkt CLUB Shopping Card hinzufügen</h5>
            </div>
            <div
              className={styles.plusBlock}
              onClick={() => {
                openModal(ModalType.CARD_REGISTRATION_MODAL);
              }}
            >
              <RoundPlusIcon />
            </div>
          </Card>
          <Card className={clsx(styles.cardsBlockCard, styles.addNew)}>
            <div>
              <AddNewCardIcon />
              <h5>{cardAccountTranslations?.moreCardsAvailableSoon}</h5>
            </div>
          </Card>
        </div>
      </div>
      <div className={styles.mainContainer}>
        <Card className={styles.mainCard}>
          <div className={styles.cardRow}>
            <div className={styles.cardRowInner}>
              {tokens?.content.length ? (
                tokens?.content.map((token) => (
                  <div
                    key={token.id}
                    className={clsx(
                      styles.rowBlockImage,
                      selectedToken === token.id && styles.active
                    )}
                    onClick={() => setSelectedToken(token.id)}
                  >
                    <Image
                      className={styles.paymentCard}
                      src={MediaMarkt}
                      alt={t`Payment card`}
                      width={100}
                      height={60}
                    />
                    <div>
                      <h4>Hauptkarte CHF</h4>
                      <div className={styles.statusBlock}>
                        <span>Status:</span>
                        <span className={styles.buttonBox}>
                          {token.tokenStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  No data
                </div>
              )}
            </div>
            <div>
              <div className={styles.iconTextBlock}>
                <div className={styles.iconBox}>
                  <RoundPlusIcon color="#FF8000" />
                </div>
                <span>Zusatzkarte beantragen</span>
              </div>
            </div>
            <div className={styles.rowBlock}>
              <Link
                href={`/bills?merchantId=${cardAccount?.merchant.id}`}
                className={clsx(
                  styles.negativeIconTextBlock,
                  styles.iconTextBlock
                )}
              >
                <div className={styles.iconBox}>
                  <GraphIcon color="white" />
                </div>
                <span>Zur aktuellen Monatsrechnung</span>
              </Link>
              <Link
                href={`/tax?merchantId=${cardAccount?.merchant.id}&contractNo=${cardAccount?.contractNo}`}
                className={styles.iconTextBlock}
              >
                <div className={styles.iconBox}>
                  <DivideIcon />
                </div>
                <span>Zum aktuellen Zinsausweis</span>
              </Link>
            </div>
          </div>
          <div className={styles.numbersRow}>
            {selectedToken ? (
              <>
                <div className={styles.priceBlock}>
                  <h6>Kreditlimite</h6>
                  <div>
                    <span>CHF</span>
                    <span className={styles.price}>
                      {toFixedAmount(cardAccount?.limit || 0)}
                    </span>
                  </div>
                </div>
                <div className={styles.priceBlock}>
                  <h6>Verfügbares Einkaufslimite</h6>
                  <div>
                    <span>CHF</span>
                    <span className={styles.price}>
                      {toFixedAmount(cardAccount?.effectiveLimit || 0)}
                    </span>
                  </div>
                </div>
                <div className={styles.priceBlock}>
                  <h6>Ausgaben diesen Monat</h6>
                  <div>
                    <span>CHF</span>
                    <span className={styles.price}>
                      {toFixedAmount(cardAccount?.reservedAmount || 0)}
                    </span>
                  </div>
                </div>
                <div className={styles.graphContainer}>
                  <Graph cardId={selectedToken} />
                </div>
              </>
            ) : (
              <div>No data</div>
            )}
          </div>
          <div className={styles.actionsBlock}>
            <div
              className={styles.actionBlock}
              onClick={() => openModal(ModalType.LOCK_MAP_MODAL)}
            >
              <LockIcon />
              <span>Speren</span>
            </div>
            <div
              className={styles.actionBlock}
              onClick={() => openModal(ModalType.REPLACE_CARD_MODAL)}
            >
              <RewindIcon />
              <span>Ersetzen</span>
            </div>
            <div
              className={styles.actionBlock}
              onClick={() => openModal(ModalType.ADDRESS_MODAL)}
            >
              <LocationIcon />
              <span>Adresse ändern</span>
            </div>
            <CardActionItemWAccordion
              setModalType={setModalType}
              setIsModalOpen={setIsModalOpen}
              setPortalModalVisible={setPortalModalVisible}
            />
          </div>
          <div className={styles.accordionBlock}>
            <AccordionComponent heading="Kontodetails">
              {() => (
                <div className={styles.kontodetails}>
                  <div>
                    <PaymentProgress
                      amount={cardAccountInfo?.reservedAmount || 0}
                      limit={cardAccountInfo?.limit || 0}
                      amountLabel="Austgaben"
                      limitLabel="Verfügbar"
                    />
                  </div>
                  <div className={styles.kontodetailsText}>
                    <div>
                      <span className={styles.label}>Vertragsnummer</span>
                      <span className={styles.value}>
                        {cardAccount?.contractNo}
                      </span>
                    </div>
                    <div>
                      <span className={styles.label}>Kontonummer</span>
                      <span className={styles.value}>{cardAccount?.id}</span>
                    </div>
                    <div>
                      <span className={styles.label}>Kontoinhaber</span>
                      <span
                        className={styles.value}
                      >{`${cardAccountPerson?.firstName} ${cardAccountPerson?.name}`}</span>
                    </div>
                    <div>
                      <span className={styles.label}>Limite</span>
                      <span className={styles.value}>
                        CHF {cardAccountInfo?.limit}
                      </span>
                    </div>
                    <div>
                      <span className={styles.label}>Rechnungseinstellung</span>
                      <span className={styles.value}>
                        {cardAccountInfo?.invoiceChannel || "/"}
                      </span>
                    </div>
                    <div>
                      <span className={styles.label}>Versicherung</span>
                      <span className={styles.value}>Saldo Garant</span>
                    </div>
                    <div>
                      <span className={styles.label}>Adresse</span>
                      <span className={styles.value}>
                        {`${cardAccountInfo?.merchant?.address.street} ${
                          cardAccountInfo?.merchant?.address.streetExtension ||
                          ""
                        }, ${cardAccountInfo?.merchant?.address.city}`}
                      </span>
                    </div>
                    <div>
                      <span className={styles.label}>E-Mail</span>
                      <span className={styles.value}>
                        {cardAccountPerson?.email} (bestätigt)
                      </span>
                    </div>
                    <div>
                      <span className={styles.label}>Telefon</span>
                      <span className={styles.value}>
                        {cardAccountPerson?.mobilePhoneNumber} (bestätigt)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </AccordionComponent>
            <AccordionComponent heading="Kartendetails">
              {() => (
                <div className={styles.kontodetailsText}>
                  <div>
                    <span className={styles.label}>Kartennummer</span>
                    <span className={styles.value}>
                      {hideCardNumber(tokenData?.token)}
                    </span>
                  </div>
                  <div>
                    <span className={styles.label}>Kontoinhaber</span>
                    <span className={styles.value}>
                      {tokenData?.cardholder}
                    </span>
                  </div>
                  <div>
                    <span className={styles.label}>Gültig bis</span>
                    <span className={styles.value}>
                      {tokenData?.expiryDate}
                    </span>
                  </div>
                </div>
              )}
            </AccordionComponent>
            <AccordionComponent heading="Übersicht Transaktionen">
              {(expanded) => (
                <CardAccordionTable
                  cardId={selectedAccountId}
                  expanded={expanded}
                />
              )}
            </AccordionComponent>
          </div>
        </Card>
      </div>
      <CardModalContainer
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        portalModalVisible={portalModalVisible}
        setPortalModalVisible={setPortalModalVisible}
        modalType={modalType}
        setModalType={setModalType}
        selectedAccountId={selectedAccountId}
        tokens={tokens?.content}
        cardAccountNo={cardAccount?.contractNo}
      />
    </>
  );
};

export default WithCard;
