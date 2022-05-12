import { Reducer } from "redux";

// Actions and types
import { StatsAction } from "../actions";
import * as t from "../types";

interface StatsState {
  loading: boolean;
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
}

const initialState: StatsState = {
  loading: true,
  taskManager: {
    activeTasks: 0,
    totalTasksLimit: 0,
  },
  sizzlerManager: {
    sizzlers: 0,
    lpPerTask: "",
    depositDelay: 0,
    withdrawalDelay: 0,
    resetPeriod: 0,
  },
  minter: {
    emissionRate: "",
  },
  sizzle: {
    totalSupply: "",
  },
};

export const statsReducer: Reducer<StatsState, StatsAction> = (
  state = initialState,
  action
): StatsState => {
  switch (action.type) {
    case t.StatsActionTypes.GET_STATS: {
      return {
        loading: false,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
