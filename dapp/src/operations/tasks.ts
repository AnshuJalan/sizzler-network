import * as IPFS from "ipfs-http-client";

// Tezos instance
import { tezos } from "../common/wallet";

// Globals
import { taskManagerAddress } from "../common/global";

interface INewTask {
  owner: string;
  contract: string;
  entrypoint: string;
  description: string;
}

export const requestNewTask = async (params: INewTask): Promise<string> => {
  try {
    const client = IPFS.create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
    const { cid } = await client.add(JSON.stringify({ ...params }));
    const tmInstance = await tezos.wallet.at(taskManagerAddress);
    console.log(`https://ipfs.infura.io/ipfs/${cid}`);
    const op = await tmInstance.methods
      .add_task(params.contract, params.owner, `https://ipfs.infura.io/ipfs/${cid}`)
      .send();
    await op.confirmation(1);
    return op.opHash;
  } catch (err) {
    throw err;
  }
};
