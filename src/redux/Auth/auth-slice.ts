import {
  IConfirmLogin,
  ICurrentUser,
  IForgotLoginPassword,
  ILogin,
  ILoginResponse,
} from "@/components/OnboardingSteps/Login/types/ILogin";
import {
  INewPassword,
  IOnboardingResponse,
  IOneTimePassword,
  IRegister,
  IRegisterCode,
  IRegisterConfirmPhoneCode,
  IRegisterDataCode,
  IRegisterPasswordCode,
  IRegisterPhoneCode,
  IRegisterResponse,
  ISetDataResponse,
} from "@/components/OnboardingSteps/Registration/types/IRegistration";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const { token } = (getState() as RootState).user;
      if (token && endpoint !== "login") {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<ICurrentUser, string>({
      query: (token) => ({
        url: "/auth/me",
        method: "POST",
      }),
      providesTags: ["Auth"],
    }),
    login: builder.mutation<ILoginResponse, ILogin>({
      query: ({ username, password }) => ({
        url: "/auth/login",
        method: "POST",
        params: {
          username,
          password,
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    confirmLogin: builder.mutation<ILoginResponse, IConfirmLogin>({
      query: ({ access_token, code }) => ({
        url: "/auth/confirm",
        method: "POST",
        params: {
          access_token,
          code,
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    forgotLoginPassword: builder.mutation<void, IForgotLoginPassword>({
      query: ({ email }) => ({
        url: "/auth/reset-password",
        method: "POST",
        params: {
          email,
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<IRegisterResponse, IRegister>({
      query: ({ email, language }) => ({
        url: "/auth/register",
        method: "POST",
        params: {
          email,
          language,
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    registerCode: builder.mutation<IOnboardingResponse, IRegisterCode>({
      query: ({ code }) => ({
        url: `/auth/register/${code}`,
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    setPhone: builder.mutation<IOnboardingResponse, IRegisterPhoneCode>({
      query: ({ code, phoneNumber }) => ({
        url: `/auth/onboarding/set-phone-number/${code}`,
        method: "POST",
        params: phoneNumber
          ? {
              phoneNumber,
            }
          : {},
      }),
      invalidatesTags: ["Auth"],
    }),
    confirmPhone: builder.mutation<
      IOnboardingResponse,
      IRegisterConfirmPhoneCode
    >({
      query: ({ code }) => ({
        url: `/auth/onboarding/confirm-phone-number/${code}`,
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    setPassword: builder.mutation<IOnboardingResponse, IRegisterPasswordCode>({
      query: ({ code, password }) => ({
        url: `/auth/onboarding/set-password/${code}`,
        method: "POST",
        params: {
          password,
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    setNewPassword: builder.mutation<ISetDataResponse, INewPassword>({
      query: ({ code, password }) => ({
        url: `/auth/set-password/${code}`,
        method: "POST",
        params: {
          password,
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    setUserData: builder.mutation<ISetDataResponse, IRegisterDataCode>({
      query: ({ code, gender, firstName, name, birthDate }) => ({
        url: `/auth/onboarding/set-data/${code}`,
        method: "POST",
        params: {
          gender,
          firstName,
          name,
          birthDate,
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    oneTimePasswordCode: builder.query<
      { code: string },
      { reference: string; passwordType?: string }
    >({
      query: ({ reference, passwordType }) => ({
        url: "/oneTimePassword",
        method: "GET",
        params: {
          reference,
          passwordType,
        },
      }),
      providesTags: ["Auth"],
    }),
    oneTimePassword: builder.mutation<void, IOneTimePassword>({
      query: ({ reference, passwordType }) => ({
        url: "/oneTimePassword/resend",
        method: "POST",
        params: {
          reference,
          passwordType,
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    // logout: builder.mutation({
    // 	query: (token) => ({
    // 		url: '/logout',
    // 		method: 'POST',
    // 		headers: {
    // 			Authorization: `Bearer ${token}`,
    // 		},
    // 	}),
    // 	invalidatesTags: ['Auth'],
    // }),
  }),
});

export const {
  useLoginMutation,
  useConfirmLoginMutation,
  useForgotLoginPasswordMutation,
  useRegisterMutation,
  useRegisterCodeMutation,
  useSetPhoneMutation,
  useSetUserDataMutation,
  useSetPasswordMutation,
  useSetNewPasswordMutation,
  useConfirmPhoneMutation,
  useOneTimePasswordMutation,
  // useLogoutMutation,
  useGetCurrentUserQuery,
  useOneTimePasswordCodeQuery,
} = authApi;
