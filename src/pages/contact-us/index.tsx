import { useAppDispatch } from "@/redux/store";
import {
  setContactUsTranslations,
  setSidebarTranslations,
} from "@/redux/Strapi/strapi-slice";
import { IContactUsTranslations, ISidebarTranslations } from "@/utility/types";
import {
  getStrapiSidebarTranslations,
  getStrapiTranslations,
  getTranslation,
} from "@/utils";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { CardAccountMailIcon } from "@/components/Icons/CardAccountMailIcon/CardAccountMailIcon";
import { SectionTitle } from "@/components/common/SectionTitle/SectionTitle";
import { ContactUsForm } from "@/components/ContactUsForm/ContactUsForm";
import styles from "./ContactUs.module.scss";

interface IProps {
  sidebarTranslations: ISidebarTranslations;
  contactUsTranslations: IContactUsTranslations;
}

const ContactUs: React.FC<IProps> = ({
  sidebarTranslations,
  contactUsTranslations,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setContactUsTranslations(contactUsTranslations));
    dispatch(setSidebarTranslations(sidebarTranslations));
  }, [dispatch, sidebarTranslations]);

  return (
    <div>
      <SectionTitle>{contactUsTranslations?.contactUsTitle}</SectionTitle>
      <Accordion style={{ marginTop: "80px" }} expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: "#222222" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className={styles.titleContainer}>
            <div className={styles.icon}>
              <CardAccountMailIcon />
            </div>
            <div className={styles.title}>
              {contactUsTranslations?.contactUsFormTitle}
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails style={{ padding: "0 24px 24px 24px" }}>
          <ContactUsForm contactUsTranslations={contactUsTranslations} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=10000"
  );

  const [translation, data, sidebar] = await Promise.all([
    getTranslation(ctx),
    getStrapiTranslations(`contact-form?locale=${ctx.locale}`),
    getStrapiSidebarTranslations(ctx.locale),
  ]);

  return {
    props: {
      translation,
      contactUsTranslations: data,
      sidebarTranslations: sidebar,
    },
  };
};

export default ContactUs;
