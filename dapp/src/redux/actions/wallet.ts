import * as t from "../types";
import { Sizzler } from "../../api/sizzler";

export interface ConnectWalletAction {
  type: t.WalletActionTypes.CONNECT_WALLET;
  payload: {
    sizzleBalance: string;
    lpBalance: string;
    accountPkh: string;
    sizzler: Sizzler | null;
  };
}
