import { DisableAccountSuccess } from "@/components/DisableAccount/DisableAccountSuccess";
import { PublicLayout } from "@/layouts/PublicLayout/PublicLayout";
import { useAppDispatch } from "@/redux/store";
import {
  setDisableAccountSuccessTranslations,
  setQATranslations,
} from "@/redux/Strapi/strapi-slice";
import { IDisableAccountSuccess, IQATranslations } from "@/utility/types";
import {
  getStrapiTranslations,
  getTranslation,
  STRAPI_HOST_URL,
} from "@/utils";
import { GetServerSideProps } from "next";
import React, { ReactElement, useEffect } from "react";
import styles from "./DisableAccountSuccess.module.scss";

interface IProps {
  qaTranslations: IQATranslations;
  disableAccountSuccess: IDisableAccountSuccess;
  contentImage: string;
}

const DisablePortalAccessSuccess = ({
  qaTranslations,
  disableAccountSuccess,
  contentImage,
}: IProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setQATranslations(qaTranslations));
    dispatch(setDisableAccountSuccessTranslations(disableAccountSuccess));
  }, [dispatch, qaTranslations, disableAccountSuccess]);

  return (
    <PublicLayout>
      <DisableAccountSuccess contentImage={contentImage} />
    </PublicLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=10000"
  );

  const [translation, data, disableSuccess] = await Promise.all([
    getTranslation(ctx),
    getStrapiTranslations(`qa?locale=${ctx.locale}`),
    getStrapiTranslations(
      `disable-account-success?locale=${ctx.locale}&populate=contentImage`
    ),
  ]);

  const contentImage = `${STRAPI_HOST_URL}${disableSuccess?.contentImage?.data?.attributes?.url}`;

  return {
    props: {
      translation,
      qaTranslations: data,
      disableAccountSuccess: disableSuccess,
      contentImage,
    },
  };
};

export default DisablePortalAccessSuccess;

DisablePortalAccessSuccess.getLayout = (page: ReactElement) => page;
