import axios from "axios";
import BigNumber from "bignumber.js";

import { indexerURL } from "../common/global";

export interface Sizzler {
  stake: string;
  taskCounter: number;
  taskLimit: number;
  lastResetAt: Date;
  deposit: {
    amount: string;
    confirmationAt: Date;
  };
  withdrawal: {
    amount: string;
    confirmationAt: Date;
  };
}

export const getSizzler = async (address: string): Promise<Sizzler | null> => {
  const res_ = await axios.get(`${indexerURL}/sizzlers/${address}`);

  if (res_.data.address) {
    delete res_.data.address;
    return {
      ...res_.data,
      stake: new BigNumber(res_.data.stake).dividedBy(10 ** 6).toFixed(2),
    };
  }

  return null;
};
