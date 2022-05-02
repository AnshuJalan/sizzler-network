import { Reducer } from "redux";

// Actions and types
import { TasksAction } from "../actions";
import { Task } from "../../api/tasks";
import * as t from "../types";

interface TasksState {
  loading: boolean;
  tasks: Task[];
}

const initialState: TasksState = {
  loading: true,
  tasks: [],
};

export const tasksReducer: Reducer<TasksState, TasksAction> = (
  state = initialState,
  action
): TasksState => {
  switch (action.type) {
    case t.TasksActionTypes.GET_ALL_TASKS: {
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
