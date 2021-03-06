import { Dispatch } from "redux";
import { NetworkType } from "@airgap/beacon-sdk";

// Wallet
import { wallet } from "../../common/wallet";

// API
import { getSizzleBalance, getLpBalance } from "../../api/wallet";
import { getSizzler } from "../../api/sizzler";

// Globals
import { network } from "../../common/global";

// Actions and types
import { WalletAction } from "../actions";
import * as t from "../types";

export const connectWallet =
  (requestPermission: boolean) =>
  async (dispatch: Dispatch<WalletAction>): Promise<void> => {
    try {
      if (!requestPermission) {
        const activeAccount = await wallet.client.getActiveAccount();
        if (activeAccount) {
          const accountPkh = await wallet.getPKH();
          const sizzleBalance = await getSizzleBalance(accountPkh);
          const lpBalance = await getLpBalance(accountPkh);
          const sizzler = await getSizzler(accountPkh);

          dispatch({
            type: t.WalletActionTypes.CONNECT_WALLET,
            payload: {
              sizzleBalance,
              lpBalance,
              accountPkh,
              sizzler,
            },
          });
        }
      } else {
        // @ts-ignore
        await wallet.requestPermissions({ network: { type: network as NetworkType } });

        const accountPkh = await wallet.getPKH();
        const sizzleBalance = await getSizzleBalance(accountPkh);
        const lpBalance = await getLpBalance(accountPkh);
        const sizzler = await getSizzler(accountPkh);

        dispatch({
          type: t.WalletActionTypes.CONNECT_WALLET,
          payload: {
            sizzleBalance,
            lpBalance,
            accountPkh,
            sizzler,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
