import axios from "axios";
import BigNumber from "bignumber.js";

import { tzktURL, sizzlerManagerAddress } from "./global";

export interface Parameters {
  depositDelay: number;
  withdrawalDelay: number;
  lpPerTask: string;
  resetPeriod: number;
}

export const parameters: Promise<Parameters> = (async () => {
  const res_ = await axios.get(`${tzktURL}/contracts/${sizzlerManagerAddress}/storage`);
  return {
    depositDelay: parseInt(res_.data.staking_parameters.deposit_delay) / 60,
    withdrawalDelay: parseInt(res_.data.staking_parameters.withdrawal_delay) / 60,
    lpPerTask: new BigNumber(res_.data.task_parameters.lp_tokens_per_task)
      .dividedBy(10 ** 6)
      .toFixed(1),
    resetPeriod: parseInt(res_.data.task_parameters.task_limit_reset_period) / 60,
  };
})();
