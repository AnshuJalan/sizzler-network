// Types and Actions
import { Status } from "../actions/loader";
import { LoaderAction } from "../actions";
import * as types from "../types";

export const setLoader = (status: Status | null, text: string = ""): LoaderAction => {
  return {
    type: types.LoaderActionTypes.SET_LOADER,
    payload: {
      status,
      text,
    },
  };
};
