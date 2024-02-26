import { configureStore, Reducer } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  FLUSH,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import logger from "redux-logger";
import { authApi } from "./Auth/auth-slice";
import { userReducer } from "./Auth/auth-reducers";
import { IUser } from "./Auth/types/IUser";
import { accountsApi } from "./User/Accounts/account-slice";
import uiSlice from "./UI/ui-slice";
import translationSlice, { strapiApi } from "./Strapi/strapi-slice";
import { profileApi } from "./User/Profile/profile-slice";
import { cardsApi } from "./User/Cards/cards-slice";
import { notificationsApi } from "./User/Notifications/notifications-slice";

const persistConfig = {
  key: "user",
  storage,
};

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [accountsApi.reducerPath]: accountsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [cardsApi.reducerPath]: cardsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [strapiApi.reducerPath]: strapiApi.reducer,
    ui: uiSlice,
    translations: translationSlice,
    user: persistReducer<IUser>(persistConfig, userReducer as Reducer),
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    authApi.middleware,
    accountsApi.middleware,
    profileApi.middleware,
    cardsApi.middleware,
    notificationsApi.middleware,
    strapiApi.middleware,
  ],
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const persistor = persistStore(store);

export { store, persistor };
