import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";

export type ICardAccounts = {
  id: number;
  limit: number;
  effectiveLimit: number;
  contractNo: number;
  reservedAmount: number;
  status: string;
  accountType: string;
  invoiceChannel: string;
};

type IPaginatedResponse = {
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  pageable: unknown;
  sort: unknown;
};

type ICardAccountsResponse = IPaginatedResponse & {
  content: ICardAccounts[];
};

export const cardsApi = createApi({
  reducerPath: "cards",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).user;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Cards"],
  endpoints: (builder) => ({
    getCardAccounts: builder.query<ICardAccountsResponse, { amount: number }>({
      query: ({ amount }) => ({
        url: "/cardAccounts",
        method: "GET",
        params: {
          page: 0,
          amount,
        },
      }),
      providesTags: ["Cards"],
    }),
    changeName: builder.mutation<
      any,
      {
        firstName: string;
        lastName: string;
        gender: "M" | "F";
        tokenId: number;
        formData: FormData;
      }
    >({
      query: ({ gender, firstName, lastName, tokenId, formData }) => ({
        url: `/tokens/${tokenId}/requests/changeName`,
        method: "POST",
        params: {
          gender,
          firstName,
          name: lastName,
        },
        body: formData,
      }),
    }),
    increaseLimit: builder.mutation<
      any,
      {
        newLimit: string;
        tokenId: number;
        formData: FormData;
      }
    >({
      query: ({ newLimit, tokenId, formData }) => ({
        url: `/tokens/${tokenId}/requests/changeLimit`,
        method: "POST",
        params: {
          newLimit,
        },
        body: formData,
      }),
    }),
    decreaseLimit: builder.mutation<
      any,
      {
        newLimit: string;
        tokenId: number;
      }
    >({
      query: ({ newLimit, tokenId }) => ({
        url: `/tokens/${tokenId}/requests/changeLimit`,
        method: "POST",
        params: {
          newLimit,
        },
      }),
    }),
    sendMonthlyInvoice: builder.mutation<
      any,
      {
        email: string;
        cardAccountId: number;
      }
    >({
      query: ({ email, cardAccountId }) => ({
        url: `/cardAccounts/${cardAccountId}/requests/changeInvoiceChannel`,
        method: "POST",
        params: {
          email,
        },
      }),
    }),
    confirmMonthlyInvoice: builder.mutation<
      any,
      {
        code: string;
        cardAccountId: number;
      }
    >({
      query: ({ code, cardAccountId }) => ({
        url: `/cardAccounts/${cardAccountId}/requests/changeInvoiceChannel/${code}`,
        method: "POST",
      }),
    }),
    changeEmail: builder.mutation<
      any,
      {
        email: string;
        cardAccountId: number;
      }
    >({
      query: ({ email, cardAccountId }) => ({
        url: `/cardAccounts/${cardAccountId}/requests/changeEmail`,
        method: "POST",
        params: {
          email,
        },
      }),
    }),
    confirmEmail: builder.mutation<
      any,
      {
        code: string;
        cardAccountId: number;
      }
    >({
      query: ({ code, cardAccountId }) => ({
        url: `/cardAccounts/${cardAccountId}/requests/changeEmail/${code}`,
        method: "POST",
      }),
    }),
    linkCard: builder.mutation<
      { message: string },
      { dateOfBirth: string; token: string }
    >({
      query: ({ dateOfBirth, token }) => ({
        url: "/cardAccounts/link",
        method: "POST",
        params: {
          dateOfBirth,
          token,
        },
      }),
    }),
    lockCard: builder.mutation<any, { lockReason: string; tokenId: number }>({
      query: ({ lockReason, tokenId }) => ({
        url: `/tokens/${tokenId}/requests/lock`,
        method: "POST",
        params: {
          lockReason,
        },
      }),
    }),
    registerCard: builder.mutation<
      { message: string },
      { code: string; token: string }
    >({
      query: ({ code, token }) => ({
        url: `/cardAccounts/link/${code}`,
        method: "POST",
        params: {
          token,
        },
      }),
    }),
  }),
});

export const {
  useGetCardAccountsQuery,
  useLinkCardMutation,
  useLockCardMutation,
  useRegisterCardMutation,
  useChangeNameMutation,
  useIncreaseLimitMutation,
  useDecreaseLimitMutation,
  useChangeEmailMutation,
  useConfirmEmailMutation,
  useSendMonthlyInvoiceMutation,
  useConfirmMonthlyInvoiceMutation,
} = cardsApi;
