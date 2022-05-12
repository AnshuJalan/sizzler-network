import axios from "axios";
import { Dispatch } from "redux";
import BigNumber from "bignumber.js";

import {
  tzktURL,
  indexerURL,
  sizzleAddress,
  minterAddress,
  sizzlerManagerAddress,
} from "../../common/global";

// Types and Actions
import * as t from "../types";
import { StatsAction } from "../actions";

export const getStats = () => async (dispatch: Dispatch<StatsAction>) => {
  try {
    const indexer_: any = await axios.get(`${indexerURL}/stats`);
    const sizzlerManager_ = await axios.get(
      `${tzktURL}/contracts/${sizzlerManagerAddress}/storage`
    );
    const minter_ = await axios.get(`${tzktURL}/contracts/${minterAddress}/storage`);
    const sizzle_ = await axios.get(`${tzktURL}/contracts/${sizzleAddress}/storage`);

    dispatch({
      type: t.StatsActionTypes.GET_STATS,
      payload: {
        taskManager: {
          activeTasks: indexer_.data.activeTasks,
          totalTasksLimit: indexer_.data.totalTasksLimit,
        },
        sizzlerManager: {
          sizzlers: indexer_.data.sizzlers,
          depositDelay: parseInt(sizzlerManager_.data.staking_parameters.deposit_delay) / 60,
          withdrawalDelay: parseInt(sizzlerManager_.data.staking_parameters.withdrawal_delay) / 60,
          lpPerTask: new BigNumber(sizzlerManager_.data.task_parameters.lp_tokens_per_task)
            .dividedBy(10 ** 6)
            .toFixed(1),
          resetPeriod: parseInt(sizzlerManager_.data.task_parameters.task_limit_reset_period) / 60,
        },
        minter: {
          emissionRate: new BigNumber(minter_.data.mint_rates.sizzler.nat_0)
            .plus(minter_.data.mint_rates.dev.nat_0)
            .dividedBy(10 ** 18)
            .toFixed(0),
        },
        sizzle: {
          totalSupply: new BigNumber(sizzle_.data.totalSupply).dividedBy(10 ** 18).toFixed(0),
        },
      },
    });
  } catch (err) {
    throw err;
  }
};
