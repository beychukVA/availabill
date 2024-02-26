import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { InvoiceStatus } from "@/utils";
import type { RootState } from "../../store";

export type ICurrentUserAccounts = {
  name: string;
  id: number;
  email: string;
  account_type: string;
};

export type IUserTransactions = {
  amount: number;
  baseStatus: string;
  creationDate: string;
  dunningLevel: string | null;
  id: number;
  modificationDate: string;
  dueDate: string;
  openAmout: number;
  paymentStatus: InvoiceStatus;
  rateModel: string | null;
  requestedPaymentMethod: string | null;
  status: InvoiceStatus;
  submAmount: number;
  type: string;
  transactionNo: number;
  merchant: {
    address: unknown;
    email: string;
    id: number;
    name: string;
  };
};

export type IUserLatestTransactions = {
  id: number;
  store: string;
  transactionNo: number;
  amount: number;
  creationDate: string;
  token: {
    token: string;
  };
};

export type ICardAccountToken = {
  id: number;
  token: string;
  expiryDate: string;
  tokenStatus: "VALUD" | "BLOCKED" | "EXPIRED";
  creationDate: string;
  tokenLine1: string;
  tokenLine2: string;
  tokenLine3: string;
  lockReason: string;
  tokenLimit: string;
  tokenNo: number;
  scanStatus: "NOT_SCANNED" | "RE_SCAN_REQUIRED" | "SCANNED" | "SCANNED_AVA";
  embossingStatus: "NO" | "TEMP" | "VIRTUAL" | "PHYSICAL";
  cardholder: string;
};

export type ICardAccount = {
  accountType: string;
  effectiveLimit: number;
  id: number;
  invoiceChannel: null;
  limit: number;
  reservedAmount: number;
  status: string;
  contractNo: number;
  merchant: {
    name: string;
    id: number;
    email: string;
    address: unknown;
  };
};

export type ICardAccountPerson = {
  id: number;
  customerType: string;
  gender: string;
  title: string;
  firstName: string;
  name: string;
  language: string;
  dateOfBirth: string;
  fixnetPhoneNumber: string;
  mobilePhoneNumber: string;
  businessPhoneNumber: string;
  email: string;
  companyName: string;
  companyUID: string;
  companyLegalForm: string;
  companyLegalFormOther: string;
  companyContact: string;
  companyFoundationDate: string;
  nationality: string;
  foreignStatus: string;
  inSwitzerlandSince: string;
  civilStatus: string;
  annualIncome: number;
};

export type ICardAccountInfo = {
  id: number;
  limit: number;
  effectiveLimit: number;
  reservedAmount: number;
  status: string;
  accountType: string;
  invoiceChannel: string;
  merchant: {
    id: number;
    name: string;
    email: string;
    address: {
      id: number;
      type: string;
      country: string;
      city: string;
      zipCode: string;
      street: string;
      streetExtension: string;
      houseNumber: string;
      addon: string;
      regionCode: string;
    };
  };
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

type ICurrentUserAccountResponse = IPaginatedResponse & {
  content: ICurrentUserAccounts[];
};

export type IUserTransactionsResponse = IPaginatedResponse & {
  content: IUserTransactions[];
};

type IUserLatestTransactionsResponse = IPaginatedResponse & {
  content: IUserLatestTransactions[];
};

type ICardAccountTokens = IPaginatedResponse & {
  content: ICardAccountToken[];
};

type IMerchant = {
  address: unknown;
  email: string;
  id: number;
  name: string;
};

type IMerchantsResponse = IPaginatedResponse & {
  content: IMerchant[];
};

type IBasket = {
  amount: number;
  article: string;
  id: number;
  itemId: number;
  netAmount: number;
  productGrouop: string;
  quantity: number;
  singleAmount: number;
  unit: string;
  vatPercentage: number;
  verAmount: number;
};

type IBasketResponse = IPaginatedResponse & {
  content: IBasket[];
};

export const accountsApi = createApi({
  reducerPath: "accounts",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).user;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Account"],
  endpoints: (builder) => ({
    getCurrentUserAccounts: builder.query<
      ICurrentUserAccountResponse,
      { token: string; userId: number | undefined }
    >({
      query: ({ token, userId }) => ({
        url: `/users/${userId}/accounts`,
        method: "GET",
        params: {
          page: 0,
          amount: 20,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getUserTransactions: builder.query<
      IUserTransactionsResponse,
      {
        token: string;
        userId: number | undefined;
        page: number;
        startDate?: string;
        endDate?: string;
        startAmount?: number;
        endAmount?: number;
        status?: string;
        merchantId?: number;
        isInvoice?: boolean;
      }
    >({
      query: ({
        token,
        userId,
        page,
        startDate = "",
        endDate = "",
        startAmount = 0,
        endAmount = 0,
        status = "",
        merchantId,
        isInvoice = false,
      }) => ({
        url: `/users/${userId}/transactions`,
        method: "GET",
        params: {
          page,
          amount: 5,
          startDate,
          endDate,
          startAmount,
          endAmount,
          status,
          merchantId,
          isInvoice,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getMerchants: builder.query<IMerchantsResponse, string>({
      query: (token) => ({
        url: "merchants",
        method: "GET",
        params: {
          page: 0,
          amount: 100,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getCardAccountTotalTransaction: builder.query<
      IMerchantsResponse,
      {
        token: string;
        cardAccountId: number;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({ token, cardAccountId, startDate, endDate }) => ({
        url: `cardAccounts/${cardAccountId}/transactions/total`,
        method: "GET",
        params: {
          startDate,
          endDate,
          accountType: "CARDS",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getOpenUserTransactions: builder.query<
      IUserTransactionsResponse,
      { token: string; userId: number | undefined }
    >({
      query: ({ token, userId }) => ({
        url: `/users/${userId}/transactions`,
        method: "GET",
        params: {
          status: "OPEN",
          dunning: false,
          page: 0,
          amount: 1,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getOverdueUserTransactions: builder.query<
      IUserTransactionsResponse,
      { token: string; userId: number | undefined }
    >({
      query: ({ token, userId }) => ({
        url: `/users/${userId}/transactions`,
        method: "GET",
        params: {
          status: "OPEN",
          dunning: true,
          page: 0,
          amount: 1,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getUserInterestStatements: builder.query<
      IUserTransactionsResponse,
      {
        token: string;
        userId: number | undefined;
        contractNo: string;
        year: string;
        merchantId: string;
        page: number;
        amount: number;
      }
    >({
      query: ({
        token,
        userId,
        contractNo,
        year,
        merchantId,
        amount = 10,
        page = 0,
      }) => ({
        url: `/users/${userId}/transactions`,
        method: "GET",
        params: {
          page,
          amount,
          contractNo,
          year,
          merchantId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getLatestTransaction: builder.query<
      IUserLatestTransactionsResponse,
      { token: string; userId: number | undefined }
    >({
      query: ({ token, userId }) => ({
        url: `/users/${userId}/transactions`,
        method: "GET",
        params: {
          page: 0,
          amount: 1,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getTransactionsMaxAmount: builder.query<
      IUserLatestTransactionsResponse,
      { token: string; userId: number | undefined }
    >({
      query: ({ token, userId }) => ({
        url: `/users/${userId}/transactions`,
        method: "GET",
        params: {
          page: 0,
          amount: 1,
          sortDirection: "DESC",
          sortColumn: "amount",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getCardAccount: builder.query<
      ICardAccount,
      { token: string; cardAccountId: number | undefined }
    >({
      query: ({ token, cardAccountId }) => ({
        url: `/cardAccounts/${cardAccountId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getCardAccountPerson: builder.query<
      ICardAccountPerson,
      { token: string; cardAccountId: number | undefined }
    >({
      query: ({ token, cardAccountId }) => ({
        url: `/accounts/${cardAccountId}/person`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getCardAccountInfo: builder.query<
      ICardAccountInfo,
      { token: string; cardAccountId: number | undefined }
    >({
      query: ({ token, cardAccountId }) => ({
        url: `/accounts/${cardAccountId}/cardAccount`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getTransactionsBasket: builder.query<
      IBasketResponse,
      { token: string; transactionId: number }
    >({
      query: ({ token, transactionId }) => ({
        url: `/transactions/${transactionId}/basket`,
        method: "GET",
        params: {
          page: 0,
          amount: 100,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getCardAccountTransactions: builder.query<
      IUserLatestTransactionsResponse,
      {
        token: string;
        cardAccountId: number | undefined;
        page?: number;
        amount?: number;
        startDate?: string;
        endDate?: string;
        status?: string;
        startAmount?: number;
        endAmount?: number;
      }
    >({
      query: ({
        token,
        cardAccountId,
        startAmount = undefined,
        endAmount = undefined,
        startDate,
        endDate,
        amount = 10,
        page = 0,
        status,
      }) => ({
        url: `/cardAccounts/${cardAccountId}/transactions`,
        method: "GET",
        params: {
          page,
          amount,
          startAmount,
          endAmount,
          startDate,
          endDate,
          sortDirection: "DESC",
          status,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getCardAccountTransactionsMaxAmount: builder.query<
      IUserLatestTransactionsResponse,
      {
        token: string;
        cardAccountId: number | undefined;
      }
    >({
      query: ({ token, cardAccountId }) => ({
        url: `/cardAccounts/${cardAccountId}/transactions`,
        method: "GET",
        params: {
          page: 0,
          amount: 1,
          sortDirection: "DESC",
          sortColumn: "amount",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    getCardAccountTokens: builder.query<
      ICardAccountTokens,
      {
        token: string;
        cardAccountId: number | undefined;
        amount?: number;
        page?: number;
      }
    >({
      query: ({ token, cardAccountId, amount = 10, page = 0 }) => ({
        url: `/cardAccounts/${cardAccountId}/tokens`,
        method: "GET",
        params: {
          amount,
          page,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["Account"],
    }),
    objectToInvoice: builder.mutation<
      { id: number },
      { transactionId: number; phoneNumber: string }
    >({
      query: ({ transactionId, phoneNumber }) => ({
        url: `/transactions/${transactionId}/requests/recall`,
        method: "POST",
        body: {
          phoneNumber,
        },
      }),
    }),
    changeAddress: builder.mutation<
      any,
      {
        accountId: number;
        country: string;
        city: string;
        zipCode: string;
        street: string;
      }
    >({
      query: ({ accountId, country, city, zipCode, street }) => ({
        url: `/accounts/${accountId}/requests/addressChange`,
        method: "POST",
        body: {
          country,
          city,
          zipCode,
          street,
        },
      }),
    }),
    extendPaymentPeriod: builder.mutation<
      { id: number },
      { transactionId: number }
    >({
      query: ({ transactionId }) => ({
        url: `/transactions/${transactionId}/requests/dunningStop`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCurrentUserAccountsQuery,
  useGetUserTransactionsQuery,
  useGetOpenUserTransactionsQuery,
  useGetOverdueUserTransactionsQuery,
  useGetLatestTransactionQuery,
  useGetTransactionsMaxAmountQuery,
  useGetUserInterestStatementsQuery,
  useGetCardAccountQuery,
  useGetCardAccountTransactionsQuery,
  useGetMerchantsQuery,
  useGetTransactionsBasketQuery,
  useObjectToInvoiceMutation,
  useExtendPaymentPeriodMutation,
  useGetCardAccountTokensQuery,
  useGetCardAccountTransactionsMaxAmountQuery,
  useGetCardAccountPersonQuery,
  useGetCardAccountInfoQuery,
  useGetCardAccountTotalTransactionQuery,
  useChangeAddressMutation,
} = accountsApi;
