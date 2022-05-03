import { Reducer } from "redux";

// Actions and types
import * as t from "../types";
import { LoaderAction } from "../actions";

enum Status {
  LOADING,
  SUCCESS,
  FAILURE,
}

interface LoaderState {
  status: Status | null;
  text: string;
}

const initialState: LoaderState = {
  status: null,
  text: "New task request succesful!",
};

export const loaderReducer: Reducer<LoaderState, LoaderAction> = (
  state = initialState,
  action
): LoaderState => {
  switch (action.type) {
    case t.LoaderActionTypes.SET_LOADER: {
      return {
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
