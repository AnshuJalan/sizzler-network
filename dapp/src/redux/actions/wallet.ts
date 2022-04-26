import * as t from "../types";

export interface ConnectWalletAction {
  type: t.WalletActionTypes.CONNECT_WALLET;
  payload: {
    xtzBalance: string;
    accountPkh: string;
  };
}
