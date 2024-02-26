import { AddCardIcon } from "@/components/Icons/AddCardIcon/AddCardIcon";
import React from "react";
import { useAppSelector } from "@/redux/store";
import Card from "@/components/common/Card/Card";
import { RoundPlusIcon } from "@/components/Icons/RoundPlusIcon/RoundPlusIcon";
import { ICardAccountTranslations } from "@/utility/types";
import clsx from "clsx";
import { CreditCardPlusIcon } from "@/components/Icons/CreditCardPlusIcon/CreditCardPlusIcon";
import styles from "./CardsAndBills.module.scss";

const CardsAndBills = ({
  cardsCount,
  cardAccountTranslations,
}: {
  cardsCount: number | undefined;
  cardAccountTranslations: ICardAccountTranslations;
}) => {
  const { dashboardTranslations } = useAppSelector(
    (state) => state.translations
  );

  return (
    <>
      {cardsCount ? (
        <div className={clsx(styles.card, styles.paddingRightZero)}>
          <Card className={styles.cardsBlockCard}>
            <div>
              <div className={styles.icon}>
                <CreditCardPlusIcon />
              </div>
              <h5>Weitere MediaMarkt Club Shopping Card hinzufügen</h5>
            </div>
            <div className={styles.plusBlock}>
              <RoundPlusIcon />
            </div>
          </Card>
        </div>
      ) : null}
      <div className={clsx(styles.card, styles.paddingRightZero)}>
        <Card className={styles.cardsBlockCard}>
          <div>
            <div className={styles.icon}>
              <CreditCardPlusIcon />
            </div>
            <h5>{cardAccountTranslations?.moreCardsAvailableSoon}</h5>
          </div>
          <div className={styles.plusBlock}>
            <RoundPlusIcon />
          </div>
        </Card>
      </div>
    </>
  );
};

export default CardsAndBills;
