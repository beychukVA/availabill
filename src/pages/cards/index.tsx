import { PrivateRoute } from "@/components/Routes/PrivateRoute";
import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
} from "@/utils";
import { GetServerSideProps } from "next";
import { t } from "@lingui/macro";

import { useEffect } from "react";
import { Loading } from "@/components/Loading/Loading";
import { z } from "zod";
import {
  ICardAccountTranslations,
  ISidebarTranslations,
} from "@/utility/types";
import {
  setCardAccountTranslations,
  setSidebarTranslations,
} from "@/redux/Strapi/strapi-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useGetCurrentUserAccountsQuery } from "@/redux/User/Accounts/account-slice";
import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";
import styles from "./Cards.module.scss";
import WithCard from "./components/WithCard";
import NoCard from "./components/NoCard";

const registerCardSchema = z.object({
  cardNumber: z
    .string()
    .min(4, t`Bitte geben Sie eine gültige Kartennummer ein`),
  registrationCode: z.string().min(4, t`Bitte trage einen korrekten Code ein`),
});

interface ICardsPageProps {
  cardAccountTranslations: ICardAccountTranslations;
  sidebarTranslations: ISidebarTranslations;
}

const CardsPage = ({
  cardAccountTranslations,
  sidebarTranslations,
}: ICardsPageProps) => {
  const token = useAppSelector((state) => state.user.token);
  const { data: currentUser } = useGetCurrentUserQuery(token);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCardAccountTranslations(cardAccountTranslations));
    dispatch(setSidebarTranslations(sidebarTranslations));
  }, [dispatch, cardAccountTranslations, sidebarTranslations]);

  const { data, isFetching, isError, refetch } = useGetCurrentUserAccountsQuery(
    {
      token,
      userId: currentUser?.id,
    },
    { skip: !currentUser?.id }
  );

  const filteredCards = data?.content.filter(
    (item) => item.account_type === "CARDS"
  );

  if (!cardAccountTranslations) return null;

  if (!data || isFetching) {
    return <Loading className={styles.spinner} />;
  }

  if (isError) {
    return <div>Error page</div>;
  }

  return (
    <PrivateRoute>
      {filteredCards?.length ? (
        <WithCard
          cardAccountTranslations={cardAccountTranslations}
          cardAccounts={filteredCards}
        />
      ) : (
        <NoCard
          cardAccountTranslations={cardAccountTranslations}
          fetchCards={refetch}
        />
      )}
    </PrivateRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=10000"
  );

  const [translation, data, sidebar] = await Promise.all([
    getTranslation(ctx),
    getStrapiTranslations(`card-account?locale=${ctx.locale}`),
    getStrapiSidebarTranslations(ctx.locale),
  ]);

  return {
    props: {
      translation,
      cardAccountTranslations: data,
      sidebarTranslations: sidebar,
    },
  };
};

export default CardsPage;
