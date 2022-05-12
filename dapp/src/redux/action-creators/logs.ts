import { Dispatch } from "redux";

// Types and Actions
import * as t from "../types";
import { LogsAction } from "../actions";

// API
import { getAllLogs as getAllLogsAPI } from "../../api/logs";

export const getAllLogs = () => async (dispatch: Dispatch<LogsAction>) => {
  const logs = await getAllLogsAPI();
  dispatch({
    type: t.LogsActionTypes.GET_ALL_LOGS,
    payload: {
      logs,
    },
  });
};
