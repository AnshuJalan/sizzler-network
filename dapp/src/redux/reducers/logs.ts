import { Reducer } from "redux";

// Actions and types
import { LogsAction } from "../actions";
import { Log } from "../../api/logs";
import * as t from "../types";

interface LogsState {
  loading: boolean;
  logs: Log[];
}

const initialState: LogsState = {
  loading: true,
  logs: [],
};

export const logsReducer: Reducer<LogsState, LogsAction> = (
  state = initialState,
  action
): LogsState => {
  switch (action.type) {
    case t.LogsActionTypes.GET_ALL_LOGS: {
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
