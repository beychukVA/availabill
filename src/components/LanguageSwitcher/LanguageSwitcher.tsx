import React, { useState } from "react";

import { t } from "@lingui/macro";
import { getStrapiTranslations } from "@/utils";
import { useAppDispatch } from "@/redux/store";
import { setOnboardingTranslations } from "@/redux/Strapi/strapi-slice";
import { useRouter } from "next/router";
import { useGetCurrentUserQuery } from "@/redux/Auth/auth-slice";
import { ISelectItem } from "../common/Select/types/ISelectItem";
import { Select } from "../common/Select/Select";

export const languages: ISelectItem[] = [
  {
    name: t`DE`,
    value: "de",
  },
  {
    name: t`EN`,
    value: "en",
  },
  {
    name: t`FR`,
    value: "fr",
  },
  {
    name: t`IT`,
    value: "it",
  },
];

export enum LanguageSelect {
  EN = "en",
  IT = "it",
  FR = "fr",
  DE = "de",
}

export type LOCALES = "en" | "de" | "fr" | "it";

export const LanguageSwitcher = () => {
  const router = useRouter();

  const handleSelect = async ({ value }: ISelectItem) => {
    router.push(router.pathname, router.pathname, {
      locale: value as LOCALES,
    });
  };

  return (
    <Select
      handleSelect={handleSelect}
      values={languages}
      selectedValue={router.locale!.split("-")[0] as LOCALES}
    />
  );
};
