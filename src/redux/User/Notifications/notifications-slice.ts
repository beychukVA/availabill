import { IPaginatedResponse } from "@/utility/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";

export type INotificationList = {
  id: number;
  title: string;
  body: string;
  date: string;
  user: {
    id: number;
    email: string;
    gender: string;
    name: string;
    firstName: string;
  };
};

export type INotification = {
  id: number;
  title: string;
  body: string;
  date: string;
  user: {
    id: number;
    email: string;
    gender: string;
    name: string;
    firstName: string;
  };
};

export const notificationsApi = createApi({
  reducerPath: "notifications",
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
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<
      IPaginatedResponse & {
        content: INotificationList[];
      },
      { userId: number; page: number }
    >({
      query: ({ userId, page }) => ({
        url: `/users/${userId}/notifications`,
        method: "GET",
        params: {
          page,
          amount: 10,
        },
      }),
      providesTags: ["Notifications"],
    }),
    getNotification: builder.query<INotification, number>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useGetNotificationQuery } =
  notificationsApi;
