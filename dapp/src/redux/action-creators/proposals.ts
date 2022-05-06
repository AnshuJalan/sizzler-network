import { Dispatch } from "redux";

// Types and Actions
import * as t from "../types";
import { ProposalsAction } from "../actions";

// API
import { getAllProposals as getAllProposalsAPI } from "../../api/proposals";

export const getAllProposals = () => async (dispatch: Dispatch<ProposalsAction>) => {
  const proposals = await getAllProposalsAPI();
  dispatch({
    type: t.ProposalsActionTypes.GET_ALL_PROPOSALS,
    payload: {
      proposals,
    },
  });
};
