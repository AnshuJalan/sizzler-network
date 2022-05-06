import { Reducer } from "redux";

// Actions and types
import { ProposalsAction } from "../actions";
import { Proposal } from "../../api/proposals";
import * as t from "../types";

interface ProposalsState {
  loading: boolean;
  proposals: Proposal[];
}

const initialState: ProposalsState = {
  loading: true,
  proposals: [],
};

export const proposalsReducer: Reducer<ProposalsState, ProposalsAction> = (
  state = initialState,
  action
): ProposalsState => {
  switch (action.type) {
    case t.ProposalsActionTypes.GET_ALL_PROPOSALS: {
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
