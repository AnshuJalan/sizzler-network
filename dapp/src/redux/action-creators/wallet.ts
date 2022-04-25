import { Dispatch } from "redux";
import { NetworkType } from "@airgap/beacon-sdk";

// Wallet
import { wallet } from "../../common/wallet";

// Globals
import { network } from "../../common/global";

// Actions and types
import { WalletAction } from "../actions";
import * as t from "../types";

export const connectWallet =
  (requestPermission: boolean) =>
  async (dispatch: Dispatch<WalletAction>): Promise<void> => {
    if (!requestPermission) {
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        const accountPkh = await wallet.getPKH();

        dispatch({
          type: t.WalletActionTypes.CONNECT_WALLET,
          payload: {
            accountPkh,
          },
        });
      }
    } else {
      // @ts-ignore
      await wallet.requestPermissions({ network: { type: network as NetworkType } });

      const accountPkh = await wallet.getPKH();

      dispatch({
        type: t.WalletActionTypes.CONNECT_WALLET,
        payload: {
          accountPkh,
        },
      });
    }
  };
