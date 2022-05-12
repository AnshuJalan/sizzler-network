// Types
import { LogsActionTypes } from "../types";
import { Log } from "../../api/logs";

export interface GetAllLogsAction {
  type: LogsActionTypes;
  payload: {
    logs: Log[];
  };
}
