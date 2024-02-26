import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { createSlice } from "@reduxjs/toolkit";
import {
  IBillsTranslations,
  ICardAccountTranslations,
  IContactUsTranslations,
  IDashboardTranslations,
  IDisableAccountConfirmation,
  IDisableAccountSuccess,
  IInboxTranslations,
  IOnboardingTranslations,
  IProfileTranslations,
  IQaAccountsTranslations,
  IQaRegistrationCardTranslations,
  IQATranslations,
  ISidebarTranslations,
} from "@/utility/types";

interface ITranslations {
  onboardingTranslations: IOnboardingTranslations | null;
  dashboardTranslations: IDashboardTranslations | null;
  billsTranslations: IBillsTranslations | null;
  cardAccountTranslations: ICardAccountTranslations | null;
  profileTranslations: IProfileTranslations | null;
  dataProtectionTranslations: { custom: string } | null;
  sidebarTranslations: ISidebarTranslations | null;
  inboxTranslations: IInboxTranslations | null;
  qaTranslations: IQATranslations | null;
  qaAccountsTranslations: IQaAccountsTranslations | null;
  qaRegistrationCardTranslations: IQaRegistrationCardTranslations | null;
  contactUsTranslations: IContactUsTranslations | null;
  disableAccountConfirmation: IDisableAccountConfirmation | null;
  disableAccountSuccess: IDisableAccountSuccess | null;
}

const initialState = {
  onboardingTranslations: null,
  dashboardTranslations: null,
  billsTranslations: null,
  cardAccountTranslations: null,
  profileTranslations: null,
  dataProtectionTranslations: null,
  sidebarTranslations: null,
  inboxTranslations: null,
  qaTranslations: null,
  qaAccountsTranslations: null,
  qaRegistrationCardTranslations: null,
  contactUsTranslations: null,
  disableAccountConfirmation: null,
  disableAccountSuccess: null,
} as ITranslations;

const translationsSlice = createSlice({
  name: "translations",
  initialState,
  reducers: {
    setOnboardingTranslations(state, { payload }) {
      state.onboardingTranslations = payload;
    },
    setDashboardTranslations(state, { payload }) {
      state.dashboardTranslations = payload;
    },
    setBillsTranslations(state, { payload }) {
      state.billsTranslations = payload;
    },
    setCardAccountTranslations(state, { payload }) {
      state.cardAccountTranslations = payload;
    },
    setProfileTranslations(state, { payload }) {
      state.profileTranslations = payload;
    },
    setDataProtectionTranslations(state, { payload }) {
      state.dataProtectionTranslations = payload;
    },
    setSidebarTranslations(state, { payload }) {
      state.sidebarTranslations = payload;
    },
    setInboxTranslations(state, { payload }) {
      state.inboxTranslations = payload;
    },
    setQATranslations(state, { payload }) {
      state.qaTranslations = payload;
    },
    setQaAccountsTranslations(state, { payload }) {
      state.qaAccountsTranslations = payload;
    },
    setQaRegistrationCardTranslations(state, { payload }) {
      state.qaRegistrationCardTranslations = payload;
    },
    setContactUsTranslations(state, { payload }) {
      state.contactUsTranslations = payload;
    },
    setDisableAccountConfirmationTranslations(state, { payload }) {
      state.disableAccountConfirmation = payload;
    },
    setDisableAccountSuccessTranslations(state, { payload }) {
      state.disableAccountSuccess = payload;
    },
  },
});

interface ITranslationsStrapiResponse {
  id: number;
  attributes: unknown;
}

export const strapiApi = createApi({
  reducerPath: "strapi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://ava-cms.zguwbqapos.cfd/api" }),
  tagTypes: ["Onboarding"],
  endpoints: (builder) => ({
    getOnboardingTranslations: builder.query<
      ITranslationsStrapiResponse,
      { locale: string }
    >({
      query: () => ({
        url: `/onboarding`,
        method: "GET",
      }),
      providesTags: ["Onboarding"],
    }),
  }),
});

export const { useGetOnboardingTranslationsQuery } = strapiApi;

export const {
  setOnboardingTranslations,
  setDashboardTranslations,
  setBillsTranslations,
  setCardAccountTranslations,
  setProfileTranslations,
  setDataProtectionTranslations,
  setSidebarTranslations,
  setInboxTranslations,
  setQATranslations,
  setQaAccountsTranslations,
  setQaRegistrationCardTranslations,
  setContactUsTranslations,
  setDisableAccountConfirmationTranslations,
  setDisableAccountSuccessTranslations,
} = translationsSlice.actions;

export default translationsSlice.reducer;
