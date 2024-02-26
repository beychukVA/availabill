import { createSlice } from "@reduxjs/toolkit";

interface UIstate {
  sidebarOpen: boolean;
}

const initialState = {
  sidebarOpen: false,
} as UIstate;

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
