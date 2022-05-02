import { Reducer } from "redux";

// Actions and types
import { WalletAction } from "../actions";
import * as t from "../types";

interface WalletState {
  isConnected: boolean;
  sizzleBalance: string;
  lpBalance: string;
  accountPkh: string;
}

const initialState: WalletState = {
  isConnected: false,
  sizzleBalance: "0.00",
  lpBalance: "0.00",
  accountPkh: "",
};

export const walletReducer: Reducer<WalletState, WalletAction> = (
  state = initialState,
  action
): WalletState => {
  switch (action.type) {
    case t.WalletActionTypes.CONNECT_WALLET: {
      return {
        isConnected: true,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
