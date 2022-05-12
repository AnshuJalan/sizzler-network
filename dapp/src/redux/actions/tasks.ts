// Types
import { TasksActionTypes } from "../types";
import { Task } from "../../api/tasks";

export interface GetAllTasksAction {
  type: TasksActionTypes;
  payload: {
    tasks: Task[];
  };
}
