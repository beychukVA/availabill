import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";
import {
  IAdditionalEmail,
  IAdditionalEmailConfirmation,
  IAdditionalEmails,
  IAdditionalEmailsResponse,
  IAddress,
  IAddressResponse,
  IChangeName,
  IChangeNameResponse,
  IChangePasswordResponse,
  IChangePaswword,
  IChangePhoneNumber,
  IChangePrimaryEmail,
  IConfirmationEmailResponse,
  IConfirmChangePhoneNumber,
  IConfirmPrimaryEmail,
  IDeactivationAccount,
  IDeleteAccount,
  IDeleteAdditionEmail,
  IDeletePhoneNumber,
} from "./types/IProfile";

export const profileApi = createApi({
  reducerPath: "profile",
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
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    changeUserInfo: builder.mutation<IChangeNameResponse, IChangeName>({
      query: ({ userId, gender, name, firstName, birthDate, language }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        params: {
          gender,
          name,
          firstName,
          birthDate,
          language,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
    changePrimaryEmail: builder.mutation<string, IChangePrimaryEmail>({
      query: ({ userId, email }) => ({
        url: `/users/${userId}/change-email`,
        method: "POST",
        params: {
          email,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
    confirmPrimaryEmail: builder.mutation<string, IConfirmPrimaryEmail>({
      query: ({ userId, code }) => ({
        url: `/users/${userId}/change-email/confirm`,
        method: "POST",
        params: {
          code,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
    changePassword: builder.mutation<IChangePasswordResponse, IChangePaswword>({
      query: ({ userId, oldPassword, newPassword }) => ({
        url: `/users/${userId}/change-password`,
        method: "POST",
        params: {
          oldPassword,
          newPassword,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
    addAdditionalEmail: builder.mutation<string, IAdditionalEmail>({
      query: ({ email }) => ({
        url: `/accounts/link`,
        method: "POST",
        params: {
          email,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
    confirmAdditionalEmail: builder.mutation<
      IConfirmationEmailResponse,
      IAdditionalEmailConfirmation
    >({
      query: ({ code }) => ({
        url: `/accounts/link/${code}`,
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),
    deleteAdditionalEmail: builder.mutation<string, IDeleteAdditionEmail>({
      query: ({ userId, email, password, type }) => ({
        url: `/users/${userId}/emails/${email}`,
        method: "DELETE",
        params: {
          password,
          type,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
    getAdditionEmails: builder.query<
      IAdditionalEmailsResponse,
      IAdditionalEmails
    >({
      query: ({ userId, page = 0, size = 20 }) => ({
        url: `/users/${userId}/emails`,
        method: "GET",
        params: {
          page,
          size,
        },
      }),
      providesTags: ["Profile"],
    }),
    changePhoneNumber: builder.mutation<string, IChangePhoneNumber>({
      query: ({ userId, phoneNumber }) => ({
        url: `/users/${userId}/change-phone-number`,
        method: "POST",
        params: {
          phoneNumber,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
    confirmChangePhoneNumber: builder.mutation<
      string,
      IConfirmChangePhoneNumber
    >({
      query: ({ userId, code }) => ({
        url: `/users/${userId}/change-phone-number/confirm`,
        method: "POST",
        params: {
          code,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
    confirmNewPhoneNumber: builder.mutation<string, IConfirmChangePhoneNumber>({
      query: ({ userId, code }) => ({
        url: `/users/${userId}/change-phone-number/confirm-phone-number`,
        method: "POST",
        params: {
          code,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
    deletePhoneNumber: builder.mutation<string, IDeletePhoneNumber>({
      query: ({ userId, password }) => ({
        url: `/users/${userId}/phone-number`,
        method: "DELETE",
        params: {
          password,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
    updateAddress: builder.mutation<IAddressResponse, IAddress>({
      query: ({ userId, country, city, zipCode, street }) => ({
        url: `/users/${userId}/address`,
        method: "PUT",
        params: {
          country,
          city,
          zipCode,
          street,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
    requestDeactivationAccount: builder.mutation<string, IDeactivationAccount>({
      query: ({ userId }) => ({
        url: `/users/${userId}/deactivate`,
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),
    deleteAccount: builder.mutation<string, IDeleteAccount>({
      query: ({ userId, code }) => ({
        url: `/users/${userId}`,
        method: "DELETE",
        params: {
          code,
        },
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useDeleteAccountMutation,
  useRequestDeactivationAccountMutation,
  useChangeUserInfoMutation,
  useChangePrimaryEmailMutation,
  useConfirmPrimaryEmailMutation,
  useChangePasswordMutation,
  useAddAdditionalEmailMutation,
  useConfirmAdditionalEmailMutation,
  useDeleteAdditionalEmailMutation,
  useDeletePhoneNumberMutation,
  useGetAdditionEmailsQuery,
  useChangePhoneNumberMutation,
  useConfirmChangePhoneNumberMutation,
  useConfirmNewPhoneNumberMutation,
  useUpdateAddressMutation,
} = profileApi;
