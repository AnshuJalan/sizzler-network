import { Reducer } from "redux";

// Actions and types
import * as t from "../types";
import { WalletAction } from "../actions";
import { Sizzler } from "../../api/wallet";

interface WalletState {
  isConnected: boolean;
  sizzleBalance: string;
  lpBalance: string;
  accountPkh: string;
  sizzler: Sizzler | null;
}

const initialState: WalletState = {
  isConnected: false,
  sizzleBalance: "0.00",
  lpBalance: "0.00",
  accountPkh: "",
  sizzler: null,
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
