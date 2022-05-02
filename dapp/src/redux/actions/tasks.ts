// Types
import { TasksActionTypes } from "../types";
import { Task } from "../../api/tasks";

export interface GetAllTasksActions {
  type: TasksActionTypes;
  payload: {
    tasks: Task[];
  };
}
