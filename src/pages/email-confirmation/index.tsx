import { EmailConfirmationPage } from "@/components/EmailConfirmationPage/EmailConfirmationPage";
import { PublicLayout } from "@/layouts/PublicLayout/PublicLayout";
import { getTranslation } from "@/utils";
import { GetServerSideProps } from "next";
import React, { ReactElement } from "react";
import styles from "./EmailConfirmation.module.scss";

interface IProps {}

const EmailConfirmation = ({}: IProps) => (
  <PublicLayout>
    <EmailConfirmationPage />
  </PublicLayout>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=10000"
  );

  const translation = await getTranslation(ctx);

  return {
    props: {
      translation,
    },
  };
};

export default EmailConfirmation;

EmailConfirmation.getLayout = (page: ReactElement) => page;
