import React, { useEffect } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { PrivateRoute } from "@/components/Routes/PrivateRoute";
import { IQaAccountsTranslations, ISidebarTranslations } from "@/utility/types";
import { useAppDispatch } from "@/redux/store";
import {
  setQaAccountsTranslations,
  setSidebarTranslations,
} from "@/redux/Strapi/strapi-slice";
import { GetServerSideProps } from "next";
import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
  STRAPI_HOST_URL,
} from "@/utils";
import ReactMarkdown from "react-markdown";
import styles from "./Bills.module.scss";

interface IProps {
  qaAccountsTranslations: IQaAccountsTranslations;
  sidebarTranslations: ISidebarTranslations;
  contentImage: string;
}

const Bills: React.FC<IProps> = ({
  sidebarTranslations,
  qaAccountsTranslations,
  contentImage,
}) => {
  const breadcrumbs = [
    <Link
      key="1"
      className={styles.link}
      style={{ color: "#848484" }}
      href="/qa"
    >
      {qaAccountsTranslations?.parentLink}
    </Link>,
    <Typography key="2" className={styles.link} color="text.primary">
      {qaAccountsTranslations?.currentLink}
    </Typography>,
  ];

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setQaAccountsTranslations(qaAccountsTranslations));
    dispatch(setSidebarTranslations(sidebarTranslations));
  }, [dispatch, sidebarTranslations]);

  return (
    <PrivateRoute>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <span className={styles.title}>
            {qaAccountsTranslations?.heading}
          </span>
          <div className={styles.content}>
            <ReactMarkdown>{qaAccountsTranslations?.content}</ReactMarkdown>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <img alt="" src={contentImage} className={styles.contentImg} />
        </div>
      </div>
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
    getStrapiTranslations(
      `qa-account?locale=${ctx.locale}&populate=contentImage`
    ),
    getStrapiSidebarTranslations(ctx.locale),
  ]);

  const contentImage = `${STRAPI_HOST_URL}${data?.contentImage?.data?.attributes?.url}`;

  return {
    props: {
      translation,
      qaAccountsTranslations: data,
      sidebarTranslations: sidebar,
      contentImage,
    },
  };
};

export default Bills;
