import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WalletState {
  info: {
    address: string;
    balance: number;
    balanceInUSD: number;
  };
  transactions: {
    from: string;
    to: string;
    amount: number;
    date: Date;
    status: string;
    type: string;
  }[];
}

const initialState: WalletState = {
  info: {
    address: "",
    balance: 0,
    balanceInUSD: 0,
  },
  transactions: [],
};

const walletSlice = createSlice({
  name: "walletData",
  initialState,
  reducers: {
    setWalletData: (state, action: PayloadAction<WalletState>) => {
      state.info = action.payload.info;
      state.transactions = action.payload.transactions;
    },
  },
});

export const { setWalletData } = walletSlice.actions;
export default walletSlice.reducer;
