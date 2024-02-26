import { SectionTitle } from "@/components/common/SectionTitle/SectionTitle";
import { CustomerServiceMenu } from "@/components/CustomerServiceMenu/CustomerServiceMenu";
import { PrivateRoute } from "@/components/Routes/PrivateRoute";
import { VideoCard } from "@/components/VideoCard";
import { useAppDispatch } from "@/redux/store";
import {
  setQATranslations,
  setSidebarTranslations,
} from "@/redux/Strapi/strapi-slice";
import { IQATranslations, ISidebarTranslations } from "@/utility/types";
import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
} from "@/utils";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { NeedMoreHelp } from "@/components/NeedMoreHelp/NeedMoreHelp";
import styles from "./CustomerService.module.scss";

interface IProps {
  sidebarTranslations: ISidebarTranslations;
  qaTranslations: IQATranslations;
}

const videos = [
  {
    id: 1,
    coverImage: "",
    url: "",
  },
  {
    id: 2,
    coverImage: "",
    url: "",
  },
  {
    id: 3,
    coverImage: "",
    url: "",
  },
  {
    id: 4,
    coverImage: "",
    url: "",
  },
  {
    id: 5,
    coverImage: "",
    url: "",
  },
  {
    id: 6,
    coverImage: "",
    url: "",
  },
];

const CustomerService: React.FC<IProps> = ({
  sidebarTranslations,
  qaTranslations,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setQATranslations(qaTranslations));
    dispatch(setSidebarTranslations(sidebarTranslations));
  }, [dispatch, qaTranslations, sidebarTranslations]);

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <div style={{ marginBottom: "12px" }}>
          <SectionTitle>{qaTranslations?.qaTitle}</SectionTitle>
        </div>
        <span style={{ marginBottom: "24px" }} className={styles.title}>
          {qaTranslations?.howCanWeHelpYou}
        </span>
        <CustomerServiceMenu qaTranslations={qaTranslations} />
        <span
          style={{ marginBottom: "64px", marginTop: "31px" }}
          className={styles.title}
        >
          {qaTranslations?.checkOutOurTutorials}
        </span>
        <div className={styles.videoContainer}>
          <div className={styles.videoList}>
            {videos.map(({ id, coverImage, url }) => (
              <VideoCard key={id} coverImage={coverImage} url={url} />
            ))}
          </div>
        </div>
        <NeedMoreHelp qaTranslations={qaTranslations} />
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
    getStrapiTranslations(`qa?locale=${ctx.locale}`),
    getStrapiSidebarTranslations(ctx.locale),
  ]);

  return {
    props: {
      translation,
      qaTranslations: data,
      sidebarTranslations: sidebar,
    },
  };
};

export default CustomerService;
