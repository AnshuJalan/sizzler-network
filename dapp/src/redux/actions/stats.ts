import * as t from "../types";

export interface GetStatsAction {
  type: t.StatsActionTypes.GET_STATS;
  payload: {
    taskManager: {
      activeTasks: number;
      totalTasksLimit: number;
    };
    sizzlerManager: {
      sizzlers: number;
      lpPerTask: string;
      depositDelay: number;
      withdrawalDelay: number;
      resetPeriod: number;
    };
    minter: {
      emissionRate: string;
    };
    sizzle: {
      totalSupply: string;
    };
  };
}
