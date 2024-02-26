import React, { useEffect, useMemo, useState } from "react";
import CardHeading from "@/components/CardSection/CardHeading/CardHeading";
import CardSection from "@/components/CardSection/CardSection";

import Greeting from "@/components/Greeting/Greeting";
import { CheckIcon } from "@/components/Icons/CheckIcon/CheckIcon";
import { ProfileIcon } from "@/components/Icons/ProfileIcon/ProfileIcon";
import { CardIcon } from "@/components/Icons/CardIcon/CardIcon";
import { PrivateRoute } from "@/components/Routes/PrivateRoute";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { GetServerSideProps } from "next";
import TransactionCard from "@/components/CardSection/TransactionCard/TransactionCard";
import CardBillInfo from "@/components/CardSection/CardBillInfo/CardBillInfo";
import CardUserInfo from "@/components/CardSection/CardUserInfo/CardUserInfo";
import CardsAndBills from "@/components/CardSection/CardsAndBills/CardsAndBills";
import {
  useGetCurrentUserQuery,
  useOneTimePasswordCodeQuery,
} from "@/redux/Auth/auth-slice";
import {
  ICurrentUserAccounts,
  useGetCardAccountQuery,
  useGetCardAccountTokensQuery,
  useGetCardAccountTransactionsQuery,
  useGetCurrentUserAccountsQuery,
  useGetLatestTransactionQuery,
  useGetOpenUserTransactionsQuery,
  useGetOverdueUserTransactionsQuery,
} from "@/redux/User/Accounts/account-slice";
import PaymentCard from "@/components/CardSection/PaymentCard/PaymentCard";
import PaymentProgress from "@/components/CardSection/PaymentProgress/PaymentProgress";
import { YourShops } from "@/components/CardSection/YourShops/YourShops";
import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
} from "@/utils";
import {
  ICardAccountTranslations,
  IDashboardTranslations,
  IProfileTranslations,
  ISidebarTranslations,
} from "@/utility/types";
import Link from "next/link";
import { Modal } from "@/components/common/Modal/Modal";
import { AddOrEditAdditionalEmailModal } from "@/components/Settings/ContactInformation/Modal/AdditionalEmailModals/AddOrEditAdditionalEmailModal/AddOrEditAdditionalEmailModal";
import { ToastError } from "@/components/Toasts/ToastError/ToastError";
import { useGetAdditionEmailsQuery } from "@/redux/User/Profile/profile-slice";
import { AddEmailConfirmationModal } from "@/components/Settings/ContactInformation/Modal/AdditionalEmailModals/AddEmailConfirmationModal/AddEmailConfirmationModal";
import { Alert, Snackbar } from "@mui/material";
import {
  setCardAccountTranslations,
  setDashboardTranslations,
  setProfileTranslations,
  setSidebarTranslations,
} from "@/redux/Strapi/strapi-slice";
import clsx from "clsx";
import styles from "../components/CardSection/CardSection.module.scss";

interface IDashboardProps {
  dashboardTranslations: IDashboardTranslations;
  sidebarTranslations: ISidebarTranslations;
  cardAccountTranslations: ICardAccountTranslations;
  profileTranslations: IProfileTranslations;
}

const DashboardPage = ({
  dashboardTranslations,
  sidebarTranslations,
  cardAccountTranslations,
  profileTranslations,
}: IDashboardProps) => {
  const token = useAppSelector((state) => state.user.token);
  const { data: currentUser, refetch: update } = useGetCurrentUserQuery(token);
  const dispatch = useAppDispatch();
  const { data: additionalEmails } = useGetAdditionEmailsQuery(
    {
      userId: currentUser?.id!,
    },
    { skip: !currentUser?.id }
  );
  const [isToastErrorOpen, setToastErrorOpen] = useState(false);
  const [currAdditionEmail, setCurrAdditionEmail] = useState("");
  const [oneTimeCodeReference, setOneTimeCodeReference] = useState("");
  const [passwordType, setPasswordType] = useState("");
  const [isEditCurrEmail, setEditCurrEmail] = useState(false);
  const [serverErrors, setServerErrors] = useState<{
    _errors: string[];
  }>({ _errors: [] });
  const [
    isAddOrEditAdditionalEmailModalOpen,
    setAddOrEditAdditionalEmailModalOpen,
  ] = useState(false);
  const [isAddEmailConfirmationModalOpen, setAddEmailConfirmationModalOpen] =
    useState(false);

  useEffect(() => {
    if (serverErrors._errors[0]) {
      setToastErrorOpen(true);
    }
  }, [serverErrors._errors]);

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setServerErrors({ _errors: [] });
    setToastErrorOpen(false);
  };

  const handleServerError = (error: string) => {
    setServerErrors({
      _errors: [error],
    });
  };

  useEffect(() => {
    dispatch(setDashboardTranslations(dashboardTranslations));
    dispatch(setSidebarTranslations(sidebarTranslations));
    dispatch(setCardAccountTranslations(cardAccountTranslations));
    dispatch(setProfileTranslations(cardAccountTranslations));
  }, [
    dispatch,
    dashboardTranslations,
    sidebarTranslations,
    cardAccountTranslations,
    profileTranslations,
  ]);

  const { data: tempOneTimePasswordCode, refetch } =
    useOneTimePasswordCodeQuery(
      {
        reference: oneTimeCodeReference,
        passwordType,
      },
      {
        skip: !oneTimeCodeReference,
      }
    );

  const { data } = useGetCurrentUserAccountsQuery(
    {
      token,
      userId: currentUser?.id,
    },
    { skip: !currentUser?.id }
  );

  const { data: userOpenTransactions } = useGetOpenUserTransactionsQuery(
    {
      token,
      userId: currentUser?.id,
    },
    { skip: !currentUser?.id }
  );

  const { data: userOverdueTransactions } = useGetOverdueUserTransactionsQuery(
    {
      token,
      userId: currentUser?.id,
    },
    { skip: !currentUser?.id }
  );

  const { data: latestTransaction } = useGetLatestTransactionQuery(
    {
      token,
      userId: currentUser?.id,
    },
    { skip: !currentUser?.id }
  );

  const openAmount = useMemo(
    () =>
      (userOpenTransactions?.content || []).reduce((acc, next) => {
        acc += next.amount;

        return acc;
      }, 0),
    [userOpenTransactions?.content]
  );

  const overdueAmount = useMemo(
    () =>
      (userOverdueTransactions?.content || []).reduce((acc, next) => {
        acc += next.amount;

        return acc;
      }, 0),
    [userOverdueTransactions?.content]
  );

  const [cardAccounts, karAccounts] = useMemo(() => {
    const cardsArr: ICurrentUserAccounts[] = [];
    const karArr: ICurrentUserAccounts[] = [];

    data?.content.forEach((account) => {
      if (account.account_type === "CARDS") {
        cardsArr.push(account);
      } else if (account.account_type === "KAR") {
        karArr.push(account);
      }
    });

    return [cardsArr, karArr];
  }, [data?.content]);

  const { data: cardAccount } = useGetCardAccountQuery(
    {
      token,
      cardAccountId: cardAccounts[0]?.id,
    },
    { skip: cardAccounts.length === 0 }
  );

  const { data: cardAccountTransactions } = useGetCardAccountTransactionsQuery(
    {
      token,
      cardAccountId: cardAccounts[0]?.id,
    },
    { skip: cardAccounts.length === 0 }
  );

  const cardTotalAmount = useMemo(
    () =>
      (cardAccountTransactions?.content || []).reduce((acc, next) => {
        acc += next.amount;

        return acc;
      }, 0),
    [cardAccountTransactions?.content]
  );

  const { data: cardTokens } = useGetCardAccountTokensQuery(
    {
      token,
      cardAccountId: cardAccount?.id,
      amount: 100,
    },
    { skip: !cardAccount?.id }
  );

  const updateUI = () => {
    update();
  };

  const openAddEmailModal = (isOpen: boolean) => {
    setAddOrEditAdditionalEmailModalOpen(isOpen);
  };

  if (!dashboardTranslations) return null;

  return (
    <PrivateRoute>
      <Greeting token={token} />
      <CardSection>
        <Link href="/bills">
          <CardHeading heading={dashboardTranslations.yourBills}>
            <CheckIcon />
          </CardHeading>
        </Link>
        <TransactionCard
          status={dashboardTranslations.transOpen}
          amount={openAmount}
          noOfTransactions={userOpenTransactions?.content.length || 0}
          openTransactions={userOpenTransactions}
        />
        <TransactionCard
          status={dashboardTranslations.transOverdue}
          amount={overdueAmount}
          noOfTransactions={userOverdueTransactions?.content.length || 0}
        />
        <CardBillInfo
          amount={latestTransaction?.content[0]?.amount}
          date={latestTransaction?.content[0]?.creationDate}
          className={styles.card}
        />
      </CardSection>
      <CardSection className={styles.cardSectionMultipleRows}>
        <Link href="/cards">
          <CardHeading
            heading={dashboardTranslations.yourCardsAccounts}
            className={styles.cardHeading}
          >
            <CardIcon />
          </CardHeading>
        </Link>
        <div className={styles.cardGridContainer}>
          {cardTokens?.content && cardTokens?.content?.length > 1 ? (
            <>
              {cardTokens?.content.map((card) => (
                <div
                  key={`card-${card.id}`}
                  className={clsx(styles.card, styles.overflowEllipsis)}
                >
                  <span className={styles.cardNumber}>
                    {"xxxx xxxx ".concat(card.token.slice(17))}
                  </span>
                  <span className={styles.cardHolder}>
                    {card.cardholder?.toUpperCase()}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <PaymentCard cardTotalAmount={cardTotalAmount} />
          )}
        </div>
        {cardTokens?.content && cardTokens?.content?.length === 0 && (
          <PaymentProgress
            amount={cardAccount?.reservedAmount || 0}
            limit={cardAccount?.limit || 0}
            amountLabel={dashboardTranslations?.expenditure}
            limitLabel={dashboardTranslations?.accessible}
            className={styles.progressBar}
          />
        )}
        <CardsAndBills
          cardsCount={cardTokens?.content?.length}
          cardAccountTranslations={cardAccountTranslations}
        />
      </CardSection>
      <div className={styles.settingCardsContainer}>
        <CardSection className={styles.settingCard}>
          <Link href="/profile">
            <CardHeading heading={dashboardTranslations.yourSettings}>
              <ProfileIcon />
            </CardHeading>
          </Link>
          <CardUserInfo
            className={styles.userInfo}
            karAccounts={additionalEmails}
            openAddEmailModal={openAddEmailModal}
            user={currentUser}
          />
        </CardSection>
        <CardSection className={styles.yourShops}>
          <YourShops />
        </CardSection>
      </div>
      <Modal
        isModalOpen={isAddOrEditAdditionalEmailModalOpen}
        onClose={setAddOrEditAdditionalEmailModalOpen}
      >
        <AddOrEditAdditionalEmailModal
          translations={profileTranslations}
          isOpen={isAddOrEditAdditionalEmailModalOpen}
          onClose={setAddOrEditAdditionalEmailModalOpen}
          handleServerError={handleServerError}
          showAddEmailConfirmation={setAddEmailConfirmationModalOpen}
          setCurrAdditionEmail={setCurrAdditionEmail}
          currAdditionEmail={currAdditionEmail}
          updateUI={updateUI}
          additionalsEmails={additionalEmails?.content}
          isEditCurrEmail={isEditCurrEmail}
          setEditCurrEmail={setEditCurrEmail}
          user={currentUser!}
        />
      </Modal>
      <Modal
        isModalOpen={isAddEmailConfirmationModalOpen}
        onClose={setAddEmailConfirmationModalOpen}
      >
        {isAddEmailConfirmationModalOpen && (
          <AddEmailConfirmationModal
            onClose={setAddEmailConfirmationModalOpen}
            handleServerError={handleServerError}
            showEditEmailModal={setAddOrEditAdditionalEmailModalOpen}
            setCurrAdditionEmail={setCurrAdditionEmail}
            updateUI={updateUI}
            currAdditionEmail={currAdditionEmail}
            isEditCurrEmail={isEditCurrEmail}
            setEditCurrEmail={setEditCurrEmail}
            setOneTimeCodeReference={setOneTimeCodeReference}
            refetchOneTimeCode={refetch}
          />
        )}
      </Modal>

      <ToastError
        message={serverErrors._errors.join(", ")}
        duration={6000}
        open={isToastErrorOpen}
        handleClose={handleCloseToast}
      />
      {tempOneTimePasswordCode?.code && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Your code is: {tempOneTimePasswordCode?.code}
          </Alert>
        </Snackbar>
      )}
    </PrivateRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=10000"
  );

  const [translation, data, cardData, profileData, sidebar] = await Promise.all(
    [
      getTranslation(ctx),
      getStrapiTranslations(`dashboard?locale=${ctx.locale}`),
      getStrapiTranslations(`card-account?locale=${ctx.locale}`),
      getStrapiTranslations(`setting-account?locale=${ctx.locale}`),
      getStrapiSidebarTranslations(ctx.locale),
    ]
  );

  return {
    props: {
      translation,
      dashboardTranslations: data,
      sidebarTranslations: sidebar,
      cardAccountTranslations: cardData,
      profileTranslations: profileData,
    },
  };
};

export default DashboardPage;
