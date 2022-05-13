import axios from "axios";
import BigNumber from "bignumber.js";

// Globals
import { tzktURL, sizzleAddress, lpTokenAddress } from "../common/global";

export const getSizzleBalance = async (address: string): Promise<string> => {
  try {
    const res_ = await axios.get(
      `${tzktURL}/contracts/${sizzleAddress}/bigmaps/balances/keys/${address}`
    );

    if (!res_.data) {
      return "0.00";
    } else {
      const balance = new BigNumber(res_.data.value.balance).dividedBy(10 ** 18);
      return balance.toFixed(2);
    }
  } catch (err) {
    throw err;
  }
};

export const getLpBalance = async (address: string): Promise<string> => {
  try {
    const res_ = await axios.get(
      `${tzktURL}/contracts/${lpTokenAddress}/bigmaps/ledger/keys/${address}`
    );

    if (!res_.data) {
      return "0.00";
    } else {
      const balance = new BigNumber(res_.data.value).dividedBy(10 ** 6);
      return balance.toFixed(2);
    }
  } catch (err) {
    throw err;
  }
};
