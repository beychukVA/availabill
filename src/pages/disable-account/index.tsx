import { DisableAccountConfirmation } from "@/components/DisableAccount/DisableAccountConfirmation";
import { PublicLayout } from "@/layouts/PublicLayout/PublicLayout";
import { useAppDispatch } from "@/redux/store";
import {
  setDisableAccountConfirmationTranslations,
  setQATranslations,
} from "@/redux/Strapi/strapi-slice";
import { IDisableAccountConfirmation, IQATranslations } from "@/utility/types";
import {
  getStrapiTranslations,
  getTranslation,
  STRAPI_HOST_URL,
} from "@/utils";
import { GetServerSideProps } from "next";
import React, { ReactElement, useEffect } from "react";
import styles from "./DisableAccount.module.scss";

interface IProps {
  qaTranslations: IQATranslations;
  disableAccountConfirmation: IDisableAccountConfirmation;
  contentImage: string;
}

const DisableAccount = ({
  qaTranslations,
  disableAccountConfirmation,
  contentImage,
}: IProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setQATranslations(qaTranslations));
    dispatch(
      setDisableAccountConfirmationTranslations(disableAccountConfirmation)
    );
  }, [dispatch, qaTranslations, disableAccountConfirmation]);

  return (
    <PublicLayout>
      <DisableAccountConfirmation contentImage={contentImage} />
    </PublicLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=700"
  );

  const [translation, data, disableConfirmation] = await Promise.all([
    getTranslation(ctx),
    getStrapiTranslations(`qa?locale=${ctx.locale}`),
    getStrapiTranslations(
      `disable-account-confirmation?locale=${ctx.locale}&populate=contentImage`
    ),
  ]);

  const contentImage = `${STRAPI_HOST_URL}${disableConfirmation?.contentImage?.data?.attributes?.url}`;

  return {
    props: {
      translation,
      qaTranslations: data,
      disableAccountConfirmation: disableConfirmation,
      contentImage,
    },
  };
};

export default DisableAccount;

DisableAccount.getLayout = (page: ReactElement) => page;
