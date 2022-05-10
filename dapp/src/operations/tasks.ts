import BigNumber from "bignumber.js";
import IPFS from "ipfs-http-client";
import { WalletParamsWithKind, OpKind } from "@taquito/taquito";

// Tezos instance
import { tezos } from "../common/wallet";

// Operations
import { propose } from "./governance";

// Globals
import { taskManagerAddress, sizzleAddress } from "../common/global";

interface NewTaskParams {
  owner: string;
  contract: string;
  entrypoint: string;
  description: string;
}

export const requestNewTask = async (params: NewTaskParams): Promise<string> => {
  try {
    const client = IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
    const { cid } = await client.add(JSON.stringify({ ...params }));

    const proposalLambda = [
      { prim: "NIL", args: [{ prim: "operation" }] },
      {
        prim: "PUSH",
        args: [{ prim: "address" }, { string: taskManagerAddress }],
      },
      {
        prim: "CONTRACT",
        args: [
          {
            prim: "pair",
            args: [
              { prim: "address", annots: ["%contract"] },
              {
                prim: "pair",
                args: [
                  { prim: "string", annots: ["%entrypoint"] },
                  {
                    prim: "pair",
                    args: [
                      { prim: "address", annots: ["%owner"] },
                      { prim: "string", annots: ["%metadata"] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        annots: ["%add_task"],
      },
      {
        prim: "IF_NONE",
        args: [
          [{ prim: "PUSH", args: [{ prim: "int" }, { int: "23" }] }, { prim: "FAILWITH" }],
          [],
        ],
      },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
      {
        prim: "PUSH",
        args: [{ prim: "string" }, { string: `https://ipfs.infura.io/ipfs/${cid}` }],
      },
      {
        prim: "PUSH",
        args: [{ prim: "address" }, { string: params.owner }],
      },
      { prim: "PUSH", args: [{ prim: "string" }, { string: params.entrypoint }] },
      {
        prim: "PUSH",
        args: [{ prim: "address" }, { string: params.contract }],
      },
      { prim: "PAIR", args: [{ int: "4" }] },
      { prim: "DIG", args: [{ int: "4" }] },
      { prim: "DROP" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
    ];

    // New task requests are sent for approval as proposals
    const opHash = await propose({
      title: "New Task Request",
      description: params.description,
      lambda: proposalLambda,
    });

    return opHash;
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
