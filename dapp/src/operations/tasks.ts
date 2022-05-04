import BigNumber from "bignumber.js";
import IPFS from "ipfs-http-client";
import { WalletParamsWithKind, OpKind } from "@taquito/taquito";

// Tezos instance
import { tezos } from "../common/wallet";

// Globals
import { taskManagerAddress, sizzleAddress } from "../common/global";

interface INewTask {
  owner: string;
  contract: string;
  entrypoint: string;
  description: string;
}

export const requestNewTask = async (params: INewTask): Promise<string> => {
  try {
    const client = IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
    const { cid } = await client.add(JSON.stringify({ ...params }));

    const tmInstance = await tezos.wallet.at(taskManagerAddress);

    const op = await tmInstance.methods
      .add_task(
        params.contract,
        params.entrypoint,
        params.owner,
        `https://ipfs.infura.io/ipfs/${cid}`
      )
      .send();
    await op.confirmation(1);
    return op.opHash;
  } catch (err) {
    throw err;
  }
};

export const updateTip = async (contract: string, amount: string): Promise<string> => {
  try {
    const tmInstance = await tezos.wallet.at(taskManagerAddress);

    const amountBN = new BigNumber(amount).multipliedBy(10 ** 18);

    const op = await tmInstance.methods.update_tip(contract, amountBN).send();
    await op.confirmation(1);
    return op.opHash;
  } catch (err) {
    throw err;
  }
};

export const addCredits = async (contract: string, amount: string): Promise<string> => {
  try {
    const tmInstance = await tezos.wallet.at(taskManagerAddress);
    const sizzleInstance = await tezos.wallet.at(sizzleAddress);

    const amountBN = new BigNumber(amount).multipliedBy(10 ** 18);

    const opList: WalletParamsWithKind[] = [
      {
        kind: OpKind.TRANSACTION,
        ...sizzleInstance.methods.approve(taskManagerAddress, amountBN).toTransferParams(),
      },
      {
        kind: OpKind.TRANSACTION,
        ...tmInstance.methods.add_credits(contract, amountBN).toTransferParams(),
      },
      {
        kind: OpKind.TRANSACTION,
        ...sizzleInstance.methods.approve(taskManagerAddress, 0).toTransferParams(),
      },
    ];

    const batch = tezos.wallet.batch(opList);
    const op = await batch.send();
    await op.confirmation(1);
    return op.opHash;
  } catch (err) {
    throw err;
  }
};

export const withdrawCredits = async (contract: string, amount: string): Promise<string> => {
  try {
    const tmInstance = await tezos.wallet.at(taskManagerAddress);

    const amountBN = new BigNumber(amount).multipliedBy(10 ** 18);

    const op = await tmInstance.methods.remove_credits(contract, amountBN).send();
    await op.confirmation(1);
    return op.opHash;
  } catch (err) {
    throw err;
  }
};

export const removeTask = async (contract: string): Promise<string> => {
  try {
    const tmInstance = await tezos.wallet.at(taskManagerAddress);
    const op = await tmInstance.methods.remove_task(contract).send();
    await op.confirmation(1);
    return op.opHash;
  } catch (err) {
    throw err;
  }
};
