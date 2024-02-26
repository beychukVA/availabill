import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { t } from "@lingui/macro";
import Link from "next/link";
import { IQATranslations } from "@/utility/types";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import DOMpurify from "dompurify";
import { STRAPI_HOST_URL } from "@/utils";
import styles from "./CustomerServiceMenu.module.scss";
import { Button } from "../common/Button/Button";
import { TransparentButton } from "../common/TransparentButton/TransparentButton";
import { CheckIcon } from "../Icons/CheckIcon/CheckIcon";
import { CardMembershipIcon } from "../Icons/CardMembershipIcon/CardMembershipIcon";
import { LockOpenIcon } from "../Icons/LockOpenIcon/LockOpenIcon";
import { CardAccountMailIcon } from "../Icons/CardAccountMailIcon/CardAccountMailIcon";

interface IProps {
  qaTranslations: IQATranslations;
}

export const CustomerServiceMenu: React.FC<IProps> = ({ qaTranslations }) => {
  const menu = [
    {
      id: 1,
      title: qaTranslations?.menuBills,
      icon: <CheckIcon width="24" height="24" />,
      href: "/qa/bills",
      button: { text: qaTranslations?.allArticlesAboutBillsBtn },
      links: [
        {
          icon: <CheckIcon width="24" height="24" />,
          text: qaTranslations?.toMyBillsBtn,
        },
        { icon: <CardAccountMailIcon />, text: qaTranslations?.contactUsBtn },
      ],
      subMenu: [
        {
          id: 2,
          title: qaTranslations?.whereCanIFindMyAccountTitle,
          content: qaTranslations?.whereCanIFindMyAccountContent,
        },
        {
          id: 3,
          title: qaTranslations?.iSignedUpButCantSeeMyAccountTitle,
          content: qaTranslations?.iSignedUpButCantSeeMyAccountContent,
        },
        {
          id: 4,
          title: qaTranslations?.canIConnectMultipleEmailAddressesTitle,
          content: qaTranslations?.canIConnectMultipleEmailAddressesContent,
        },
        {
          id: 5,
          title: qaTranslations?.howCanIAddAnotherEmailAddressTitle,
          content: qaTranslations?.howCanIAddAnotherEmailAddressContent,
        },
        {
          id: 6,
          title: qaTranslations?.iWantToVerifyMyEmailAddressTitle,
          content: qaTranslations?.iWantToVerifyMyEmailAddressContent,
        },
        {
          id: 7,
          title: qaTranslations?.iWouldLikeToReceiveACopyOfTheInvoiceTitle,
          content: qaTranslations?.iWouldLikeToReceiveACopyOfTheInvoiceContent,
        },
        {
          id: 8,
          title: qaTranslations?.iWantToPayTheBillLaterTitle,
          content: qaTranslations?.iWantToPayTheBillLaterContent,
        },
        {
          id: 9,
          title: qaTranslations?.whereCanISeeThatAnInvoiceIsDueTitle,
          content: qaTranslations?.whereCanISeeThatAnInvoiceIsDueContent,
        },
        {
          id: 10,
          title: qaTranslations?.canIAlsoPayTheBillInInstallmentsTitle,
          content: qaTranslations?.canIAlsoPayTheBillInInstallmentsContent,
        },
        {
          id: 11,
          title: qaTranslations?.iWantToDisputeAnInvoiceTitle,
          content: qaTranslations?.iWantToDisputeAnInvoiceContent,
        },
      ],
    },
    {
      id: 12,
      title: qaTranslations?.menuRegistrationOfCardsAndAccounts,
      icon: <CardMembershipIcon />,
      href: "/qa/registration-cards",
      button: { text: qaTranslations?.allArticlesAboutCardRegistrationBtn },
      links: [],
      subMenu: [
        {
          id: 13,
          title: qaTranslations?.whatDoINeedToRegisterMyShoppingCardTitle,
          content: qaTranslations?.whatDoINeedToRegisterMyShoppingCardContent,
        },
        {
          id: 14,
          title: qaTranslations?.firstLoginToMyAvailabilTitle,
          content: qaTranslations?.firstLoginToMyAvailabilContent,
        },
        {
          id: 15,
          title: qaTranslations?.iHaveSeveralCardsTitle,
          content: qaTranslations?.iHaveSeveralCardsContent,
        },
      ],
    },
    {
      id: 16,
      title: qaTranslations?.menuDeliveryReturnCancellation,
      icon: <LockOpenIcon />,
      href: "/qa",
      button: { text: qaTranslations?.deliverySeeAllArticlesBtn },
      links: [],
      subMenu: [
        {
          id: 17,
          title: qaTranslations?.questionAboutDelayedOrIncorrectDeliveryTitle,
          content:
            qaTranslations?.questionAboutDelayedOrIncorrectDeliveryContent,
        },
        {
          id: 18,
          title: qaTranslations?.iHaveAReturnQuestionTitle,
          content: qaTranslations?.iHaveAReturnQuestionContent,
        },
      ],
    },
    {
      id: 19,
      title: qaTranslations?.menuOther,
      icon: <LockOpenIcon />,
      href: "/qa",
      button: { text: qaTranslations?.otherSeeAllArticlesBtn },
      links: [],
      subMenu: [
        {
          id: 20,
          title: qaTranslations?.ihaveAlreadyPaidButMyPaymentNotRegisteredTitle,
          content:
            qaTranslations?.ihaveAlreadyPaidButMyPaymentNotRegisteredContent,
        },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      {menu.map((item) => (
        <Accordion
          key={item.id}
          style={{ marginBottom: "24px" }}
          sx={{
            "& > .MuiButtonBase-root.MuiAccordionSummary-root": {
              padding: "24px 40px 24px 24px",
            },
            ".MuiButtonBase-root.MuiAccordionSummary-root.Mui-expanded": {
              minHeight: "0 !important",
            },
          }}
        >
          <AccordionSummary
            sx={{
              padding: 0,
              ".MuiAccordionSummary-content, .MuiAccordionSummary-content.Mui-expanded":
                {
                  margin: 0,
                },
            }}
            expandIcon={<ExpandMoreIcon style={{ color: "#222222" }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Link className={styles.link} href={item.href}>
              <div className={styles.titleContainer}>
                <div className={styles.icon}>{item.icon}</div>
                <div className={styles.title}>{item.title}</div>
              </div>
            </Link>
          </AccordionSummary>
          <AccordionDetails style={{ padding: "0 24px 24px 24px" }}>
            {item.subMenu.map((subItem) => (
              <Accordion key={subItem.id} style={{ marginBottom: "10px" }}>
                <AccordionSummary
                  sx={{
                    "&.MuiButtonBase-root.MuiAccordionSummary-root": {
                      padding: "18.5px 16px 18.5px 24px",
                    },
                    ".MuiAccordionSummary-content": {
                      margin: 0,
                    },
                  }}
                  expandIcon={<ExpandMoreIcon style={{ color: "#222222" }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <div className={styles.subTitleContainer}>
                    <span className={styles.subTitle}>{subItem.title}</span>
                  </div>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    padding: "0px 24px 16px",
                    "& > ul": {
                      listStyle: "inside",
                    },
                    "& > ol": {
                      marginLeft: "18px",
                    },
                    "& > blockquote": {
                      color: "#666",
                      paddingLeft: "3em",
                      borderLeft: "0.5em #eee solid",
                      margin: "24px",
                    },
                    "& > p > img": {
                      maxWidth: "400px",
                    },
                  }}
                >
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    transformImageUri={(uri) =>
                      uri.startsWith("https") ? uri : `${STRAPI_HOST_URL}${uri}`
                    }
                  >
                    {DOMpurify.sanitize(subItem.content)}
                  </ReactMarkdown>
                </AccordionDetails>
              </Accordion>
            ))}
            <div className={styles.buttons}>
              <Button width="fit-content" onClick={() => {}}>
                {item.button.text}
              </Button>
              {item.links && (
                <div className={styles.links}>
                  {item.links.map((link, index) => (
                    <TransparentButton
                      key={`${link.text}-${index}`}
                      color="secondary"
                      width="fit-content"
                      onClick={() => {}}
                      icon={link.icon}
                    >
                      {link.text}
                    </TransparentButton>
                  ))}
                </div>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};
