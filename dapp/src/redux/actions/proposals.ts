import * as t from "../types";
import { Proposal } from "../../api/proposals";

export interface GetAllProposalsAction {
  type: t.ProposalsActionTypes.GET_ALL_PROPOSALS;
  payload: {
    proposals: Proposal[];
  };
}
