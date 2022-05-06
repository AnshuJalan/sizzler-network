import IPFS from "ipfs-http-client";

// Tezos instance
import { tezos } from "../common/wallet";

// Store
import { store } from "..";

// Globals
import { governorAddress } from "../common/global";

export interface IPropose {
  title: string;
  lambda: Array<any>;
  description: string;
}

export const propose = async (params: IPropose): Promise<string> => {
  try {
    const client = IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
    const { cid } = await client.add(
      JSON.stringify({ ...params, handler: store.getState().wallet.accountPkh })
    );

    const gInstance = await tezos.wallet.at(governorAddress);

    const op = await gInstance.methods
      .propose(params.title, `https://ipfs.infura.io/ipfs/${cid}`, params.lambda)
      .send();

    await op.confirmation(1);

    return op.opHash;
  } catch (err) {
    throw err;
  }
};

// Left-Right pairing of Michelson 'or'
export enum Vote {
  UP_VOTE = "Right",
  DOWN_VOTE = "Left",
}

export const vote = async (proposalId: string, voteType: Vote): Promise<string> => {
  try {
    const op = await tezos.wallet
      .transfer({
        to: governorAddress,
        amount: 0,
        parameter: {
          entrypoint: "vote",
          value: {
            prim: "Pair",
            args: [
              {
                int: proposalId,
              },
              {
                prim: voteType,
                args: [
                  {
                    prim: "Unit",
                  },
                ],
              },
            ],
          },
        },
      })
      .send();

    await op.confirmation(1);

    return op.opHash;
  } catch (err) {
    throw err;
  }
};

export const endVoting = async (proposalId: string): Promise<string> => {
  try {
    const gInstance = await tezos.wallet.at(governorAddress);

    const op = await gInstance.methods.end_voting(proposalId).send();

    await op.confirmation(1);

    return op.opHash;
  } catch (err) {
    throw err;
  }
};

export const execute = async (proposalId: string): Promise<string> => {
  try {
    const gInstance = await tezos.wallet.at(governorAddress);

    const op = await gInstance.methods.execute(proposalId).send();

    await op.confirmation(1);

    return op.opHash;
  } catch (err) {
    throw err;
  }
};

export const flushProposal = async (proposalId: string): Promise<string> => {
  try {
    const gInstance = await tezos.wallet.at(governorAddress);

    const op = await gInstance.methods.flush_proposal(proposalId).send();

    await op.confirmation(1);

    return op.opHash;
  } catch (err) {
    throw err;
  }
};
