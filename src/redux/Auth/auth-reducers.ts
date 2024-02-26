import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { token } from "./auth-actions";

export const userReducer = createReducer(
  {},
  {
    [token.type]: (_, action: PayloadAction<string>) => action.payload,
  }
);
