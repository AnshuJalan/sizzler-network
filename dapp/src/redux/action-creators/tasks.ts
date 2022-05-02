import { Dispatch } from "redux";

// Types and Actions
import * as t from "../types";
import { TasksAction } from "../actions";

// API
import { getAllTasks as getAllTasksAPI } from "../../api/tasks";

export const getAllTasks = () => async (dispatch: Dispatch<TasksAction>) => {
  const tasks = await getAllTasksAPI();
  dispatch({
    type: t.TasksActionTypes.GET_ALL_TASKS,
    payload: {
      tasks,
    },
  });
};
