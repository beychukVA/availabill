import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
} from "@/utils";
import parse from "html-react-parser";
import { PublicRoute } from "@/components/Routes/PublicRoute";
import { IImprintTranslations, ISidebarTranslations } from "@/utility/types";
import { useEffect, useMemo } from "react";
import { useAppDispatch } from "@/redux/store";
import { setSidebarTranslations } from "@/redux/Strapi/strapi-slice";
import { marked } from "marked";
import { GetServerSideProps } from "next";
import styles from "./Impressum.module.scss";

interface IImprintProps {
  imprintTranslations: IImprintTranslations;
  sidebarTranslations: ISidebarTranslations;
}

const ImpressumPage = ({
  imprintTranslations,
  sidebarTranslations,
}: IImprintProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSidebarTranslations(sidebarTranslations));
  }, [dispatch, sidebarTranslations]);

  const imprintFirstSectionHTML = useMemo(
    () => parse(marked.parse(imprintTranslations?.firstSection!)),
    [imprintTranslations?.firstSection]
  );

  const imprintSecondSectionHTML = useMemo(
    () => parse(marked.parse(imprintTranslations?.secondSection!)),
    [imprintTranslations?.secondSection]
  );

  const imprintThirdSectionHTML = useMemo(
    () => parse(marked.parse(imprintTranslations?.thirdSection!)),
    [imprintTranslations?.thirdSection]
  );

  return (
    <PublicRoute restricted={false}>
      <div className={styles.container}>
        <h2 className={styles.heading}>{imprintTranslations?.heading}</h2>
        <div className={styles.content}>
          <div>{imprintFirstSectionHTML}</div>
          <div className={styles.infoBlock}>{imprintSecondSectionHTML}</div>
          <div className={styles.infoBlock}>{imprintThirdSectionHTML}</div>
        </div>
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
    getStrapiTranslations(`imprint?locale=${ctx.locale}`),
    getStrapiSidebarTranslations(ctx.locale),
  ]);

  return {
    props: {
      translation,
      imprintTranslations: data,
      sidebarTranslations: sidebar,
    },
  };
};

export default ImpressumPage;
