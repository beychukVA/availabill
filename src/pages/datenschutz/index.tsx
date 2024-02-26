import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
} from "@/utils";
import { GetServerSideProps } from "next";
import parse from "html-react-parser";
import { PublicRoute } from "@/components/Routes/PublicRoute";
import { marked } from "marked";
import { useEffect, useMemo } from "react";
import { useAppDispatch } from "@/redux/store";
import {
  setDataProtectionTranslations,
  setSidebarTranslations,
} from "@/redux/Strapi/strapi-slice";
import { ISidebarTranslations } from "@/utility/types";
import styles from "./Datenschutz.module.scss";

interface IDatenschutzProps {
  dataProtectionTranslations: {
    custom: string;
  };
  sidebarTranslations: ISidebarTranslations;
}

const DatenschutzPage = ({
  dataProtectionTranslations,
  sidebarTranslations,
}: IDatenschutzProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setDataProtectionTranslations(dataProtectionTranslations));
    dispatch(setSidebarTranslations(sidebarTranslations));
  }, [dataProtectionTranslations, dispatch, sidebarTranslations]);

  const dataProtectionHTML = useMemo(
    () => parse(marked.parse(dataProtectionTranslations?.custom!)),
    [dataProtectionTranslations?.custom]
  );

  return (
    <PublicRoute restricted={false}>
      <div className={styles.container}>
        <div className={styles.content}>{dataProtectionHTML}</div>
      </div>
    </PublicRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=10000"
  );

  const [translation, data, sidebar] = await Promise.all([
    getTranslation(ctx),
    getStrapiTranslations(`data-protection?locale=${ctx.locale}`),
    getStrapiSidebarTranslations(ctx.locale),
  ]);

  return {
    props: {
      translation,
      dataProtectionTranslations: data,
      sidebarTranslations: sidebar,
    },
  };
};

export default DatenschutzPage;
