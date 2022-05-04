import axios from "axios";
import BigNumber from "bignumber.js";
import { WalletParamsWithKind, OpKind } from "@taquito/taquito";

// Tezos instance
import { tezos } from "../common/wallet";

// Store
import { store } from "..";

// Globals
import { sizzlerManagerAddress, lpTokenAddress, tzktURL } from "../common/global";

export const deposit = async (amount: string): Promise<string> => {
  try {
    const key = {
      owner: store.getState().wallet.accountPkh,
      operator: sizzlerManagerAddress,
      token_id: 0,
    };

    const lpInstance = await tezos.wallet.at(lpTokenAddress);
    const smInstance = await tezos.wallet.at(sizzlerManagerAddress);

    // Check if sizzlerManager is operator
    const res_ = await axios.get(
      `${tzktURL}/contracts/${lpTokenAddress}/bigmaps/operators/keys/${JSON.stringify(key)}`
    );

    const opList: WalletParamsWithKind[] = [];

    if (!res_.data) {
      opList.push({
        kind: OpKind.TRANSACTION,
        ...lpInstance.methods.update_operators([{ add_operator: key }]).toTransferParams(),
      });
    }

    opList.push({
      kind: OpKind.TRANSACTION,
      ...smInstance.methods.deposit(new BigNumber(amount).multipliedBy(10 ** 6)).toTransferParams(),
    });

    const batch = tezos.wallet.batch(opList);
    const op = await batch.send();
    await op.confirmation(1);

    return op.opHash;
  } catch (err) {
    throw err;
  }
};

export const confirmDeposit = async () => {
  try {
    const smInstance = await tezos.wallet.at(sizzlerManagerAddress);

    const op = await smInstance.methods.confirm_deposit().send();

    await op.confirmation(1);
    return op.opHash;
  } catch (err) {
    throw err;
  }
};

export const withdraw = async (amount: string) => {
  try {
    const smInstance = await tezos.wallet.at(sizzlerManagerAddress);

    const op = await smInstance.methods
      .withdraw(new BigNumber(amount).multipliedBy(10 ** 6))
      .send();

    await op.confirmation(1);
    return op.opHash;
  } catch (err) {
    throw err;
  }
};

export const confirmWithdrawal = async () => {
  try {
    const smInstance = await tezos.wallet.at(sizzlerManagerAddress);

    const op = await smInstance.methods.confirm_withdrawal().send();

    await op.confirmation(1);
    return op.opHash;
  } catch (err) {
    throw err;
  }
};
