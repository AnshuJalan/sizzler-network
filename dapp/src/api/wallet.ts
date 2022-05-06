import axios from "axios";
import BigNumber from "bignumber.js";

// Globals
import { tzktURL, sizzleAddress, sizzlerManagerAddress, lpTokenAddress } from "../common/global";

export const getSizzleBalance = async (address: string): Promise<string> => {
  const res_ = await axios.get(
    `${tzktURL}/contracts/${sizzleAddress}/bigmaps/balances/keys/${address}`
  );

  if (!res_.data) {
    return "0.00";
  } else {
    const balance = new BigNumber(res_.data.value.balance).dividedBy(10 ** 18);
    return balance.toFixed(2);
  }
};

export const getLpBalance = async (address: string): Promise<string> => {
  const res_ = await axios.get(
    `${tzktURL}/contracts/${lpTokenAddress}/bigmaps/ledger/keys/${address}`
  );

  if (!res_.data) {
    return "0.00";
  } else {
    const balance = new BigNumber(res_.data.value).dividedBy(10 ** 6);
    return balance.toFixed(2);
  }
};

export interface Sizzler {
  stake: string;
  votingPower: string;
  tasksRemaining: number;
  lastReset: string;
  deposit: string;
  depositConfirmation: string;
  withdrawal: string;
  withdrawalConfirmation: string;
}

export const getSizzler = async (address: string): Promise<Sizzler | null> => {
  const res_ = await axios.get(
    `${tzktURL}/contracts/${sizzlerManagerAddress}/bigmaps/sizzlers/keys/${address}`
  );
  const res__ = await axios.get(
    `${tzktURL}/contracts/${sizzlerManagerAddress}/bigmaps/deposits/keys/${address}`
  );
  const res___ = await axios.get(
    `${tzktURL}/contracts/${sizzlerManagerAddress}/bigmaps/withdrawals/keys/${address}`
  );

  if (!res__.data) {
    return null;
  } else {
    return {
      stake: res_.data
        ? new BigNumber(res_.data.value.stake).dividedBy(10 ** 6).toFixed(2)
        : "0.00",
      votingPower: res_.data ? res_.data.value.task_limit : "0",
      tasksRemaining: res_.data
        ? parseInt(res_.data.value.task_limit) - parseInt(res_.data.value.task_counter)
        : 0,
      lastReset: res_.data ? res_.data.value.last_reset_at : "",
      deposit: res__.data
        ? new BigNumber(res__.data.value.amount).dividedBy(10 ** 6).toFixed(2)
        : "0.00",
      depositConfirmation: res__.data ? res__.data.value.confirmation_at : "",
      withdrawal: res___.data
        ? new BigNumber(res___.data.value.amount).dividedBy(10 ** 6).toFixed(2)
        : "0.00",
      withdrawalConfirmation: res___.data ? res___.data.value.confirmation_at : "",
    };
  }
};
