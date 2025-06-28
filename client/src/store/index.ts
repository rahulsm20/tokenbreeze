import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice.ts";

const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
});

export default store;
