import { Reducer } from "redux";

// Actions and types
import { WalletAction } from "../actions";
import * as t from "../types";

interface WalletState {
  isConnected: boolean;
  accountPkh: string;
}

const initialState: WalletState = {
  isConnected: false,
  accountPkh: "",
};

export const walletReducer: Reducer<WalletState, WalletAction> = (state = initialState, action): WalletState => {
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
