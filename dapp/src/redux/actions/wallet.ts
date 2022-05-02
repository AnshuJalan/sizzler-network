import * as t from "../types";

export interface ConnectWalletAction {
  type: t.WalletActionTypes.CONNECT_WALLET;
  payload: {
    sizzleBalance: string;
    lpBalance: string;
    accountPkh: string;
  };
}
