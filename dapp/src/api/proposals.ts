import axios from "axios";

// Globals
import { governorAddress, tzktURL } from "../common/global";

export interface Proposal {
  ID: string;
  title: string;
  descriptionLink: string;
  lambda: string;
  upVotes: number;
  downVotes: number;
  voters: { [key: string]: Object };
  handler: string;
  status: any;
}

export const getAllProposals = async (): Promise<Proposal[]> => {
  const res_ = await axios.get(
    `${tzktURL}/contracts/${governorAddress}/bigmaps/proposals/keys?active=true`
  );

  const proposals: Proposal[] = [];

  res_.data.forEach((proposal: any) => {
    proposals.push({
      ID: proposal.key,
      title: proposal.value.title,
      descriptionLink: proposal.value.description_link,
      lambda: proposal.value.proposal_lambda,
      upVotes: parseInt(proposal.value.up_votes),
      downVotes: parseInt(proposal.value.down_votes),
      voters: proposal.value.voters,
      handler: proposal.value.handler,
      status: proposal.value.status,
    });
  });

  return proposals;
};
