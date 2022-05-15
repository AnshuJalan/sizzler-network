import { MichelsonMap } from "@taquito/taquito";

// Tezos instance
import { tezos } from "../common/wallet";

// Store
import { store } from "..";

// Globals
import { lpTokenAddress } from "../common/global";

export const faucet = async (): Promise<string> => {
  try {
    const instance = await tezos.wallet.at(lpTokenAddress);
    const op = await instance.methods
      .mint(store.getState().wallet.accountPkh, new MichelsonMap(), 0)
      .send();
    await op.confirmation(1);
    return op.opHash;
  } catch (err) {
    throw err;
  }
};
