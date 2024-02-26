import { createAction } from "@reduxjs/toolkit";
import { AuthActionTypes } from "./types/AuthActionTypes";

const token = createAction(
  AuthActionTypes.AUTH_TOKEN,
  (tkn: string, expires_at: string) => ({
    payload: {
      token: tkn,
      expires_at,
    },
  })
);

export { token };
