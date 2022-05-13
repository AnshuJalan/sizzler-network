import axios from "axios";
import BigNumber from "bignumber.js";

// Globals
import { indexerURL } from "../common/global";

export interface Log {
  task: {
    contract: string;
    entrypoint: string;
    metadata: string;
  };
  opHash: string;
  sizzler: string;
  sizzleMinted: string;
  tip: string;
  completedAt: string;
}

export const getAllLogs = async (): Promise<Log[]> => {
  try {
    const res_: { data: Log[] } = await axios.get(`${indexerURL}/logs`);

    const logs: Log[] = [];

    res_.data.forEach((log: Log) => {
      logs.push({
        ...log,
        sizzleMinted: new BigNumber(log.sizzleMinted).dividedBy(10 ** 18).toFixed(2),
        tip: new BigNumber(log.tip).dividedBy(10 ** 18).toFixed(2),
      });
    });

    return logs;
  } catch (err) {
    throw err;
  }
};
