import type { I18n } from "@lingui/core";
import { en, de, fr, it } from "make-plural/plurals";
import { IType } from "@/components/common/Input/types/IType";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";

export const BASE_STRAPI_URL = "https://ava-cms.zguwbqapos.cfd/api";
export const STRAPI_HOST_URL = "https://ava-cms.zguwbqapos.cfd";

export const getStrapiTranslations = async (url: string) => {
  const blob = await fetch(`${BASE_STRAPI_URL}/${url}`);
  const main = await blob.json();

  return main.data.attributes;
};

export const getStrapiSidebarTranslations = async (locale: string = "de") => {
  const blobSidebar = await fetch(
    `${BASE_STRAPI_URL}/sidebar?locale=${locale}`
  );
  const sidebar = await blobSidebar.json();

  return sidebar.data.attributes;
};

export async function loadTranslation(locale: string, isProduction = true) {
  let data;
  if (isProduction) {
    data = await import(`./locales/${locale}/messages`);
  } else {
    data = await import(`@lingui/loader!./locales/${locale}/messages.po`);
  }

  return data.messages;
}

export function initTranslation(i18n: I18n): void {
  i18n.loadLocaleData({
    en: { plurals: en },
    de: { plurals: de },
    fr: { plurals: fr },
    it: { plurals: it },
  });
}

export const getTranslation = async (ctx: any) => {
  const translation = await loadTranslation(
    ctx.locale || ctx.defaultLocale || "de",
    process.env.NODE_ENV === "production"
  );

  return translation;
};

export const getWidth = (width: number | "full-width" | "fit-content") => {
  if (width === "full-width") {
    return "100%";
  }

  return width === "fit-content" ? "fit-content" : `${width}px`;
};

export const getInputType = (type: IType) => {
  if (type === "tel") {
    return "text";
  }

  return type === "passwordConfirm" ? "password" : type;
};

export type InvoiceStatus =
  | "OPEN"
  | "UNKNOWN"
  | "PARTIAL"
  | "FULL"
  | "CANCELLED"
  | "OVERDUE";

export const InvoiceStatusColor: { [key in InvoiceStatus]: string } = {
  OPEN: "green",
  UNKNOWN: "black",
  PARTIAL: "#f39200",
  FULL: "red",
  CANCELLED: "red",
  OVERDUE: "tomato",
};

export const tableColumns: {
  title: string;
  width: number;
}[] = [
  { title: "Datum", width: 15 },
  { title: "Händler", width: 20 },
  { title: "Betrag", width: 15 },
  { title: "Fällig am", width: 15 },
  { title: "Rechnungsstatus", width: 15 },
  { title: "Rechnungskopie", width: 12 },
  { title: "Actions", width: 8 },
];

export const inboxTableColumns: {
  title: string;
  width: number;
}[] = [
  { title: "Actions", width: 5 },
  { title: "Title", width: 75 },
  { title: "Date", width: 20 },
];

export const accordionTableColumns: {
  title: string;
  width: number;
}[] = [
  { title: "Datum", width: 24 },
  { title: "Filiale", width: 24 },
  { title: "Betrag", width: 24 },
  { title: "Kartennummer", width: 24 },
  { title: "Actions", width: 4 },
];

// TODO: find a better way to type RTK QUERY errors
export const displayAPIErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined
) =>
  "data" in error! && "message" in (error.data as { message: string })
    ? ((error.data as { message: string }).message as string)
    : JSON.stringify(error);

export const numberWithCommas = (number: string | number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");

export const toFixedAmount = (amount: number) => {
  const value = amount % 1 !== 0 ? amount.toFixed(2) : amount;

  return numberWithCommas(value);
};

export const pluckError = (error: any, fallbackTxt: string) =>
  error?.data?.message || error?.error || error?.message || fallbackTxt;

export const hideCardNumber = (cardNumber: string | undefined) =>
  cardNumber ? `.... ${cardNumber.slice(cardNumber.length - 4)}` : "";
