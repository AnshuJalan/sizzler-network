import * as t from "../types";

export enum Status {
  LOADING,
  SUCCESS,
  FAILURE,
}

export interface SetLoaderAction {
  type: t.LoaderActionTypes.SET_LOADER;
  payload: {
    status: Status | null;
    text: string;
  };
}
