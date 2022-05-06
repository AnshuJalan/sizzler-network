import { useEffect } from "react";
import { Link } from "react-router-dom";

// Hooks
import { useActions, useTypedSelector } from "../hooks";

// Components
import Button from "../components/Button";
import ProposalCard from "../components/cards/ProposalCard";

const Governance = () => {
  const { getAllProposals } = useActions();

  const { proposals } = useTypedSelector((state) => state.proposals);

  useEffect(() => {
    getAllProposals();
  }, [getAllProposals]);

  return (
    <div className="px-5 sm:px-40 mt-44 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link to="/governance/new">
          <Button onClick={() => true}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
              <i className="bi bi-plus-circle" />
              <span>New Proposal</span>
            </div>
          </Button>
        </Link>
        {/* Uncomment for filtering */}
        {/* <div className="flex justify-center items-center font-medium bg-card hover:opacity-80 transition-opacity duration-200 cursor-pointer shadow-sm">
          <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
            <i className="bi bi-funnel-fill text-info" />
            <span>All Proposals</span>
          </div>
        </div> */}
      </div>
      {/* Data */}
      <div className="flex flex-col gap-y-8">
        {proposals.map((proposal, index) => (
          <ProposalCard
            key={index}
            proposalId={proposal.ID}
            title={proposal.title}
            descriptionLink={proposal.descriptionLink}
            lambda={proposal.lambda}
            sizzler={proposal.handler}
            upVotes={proposal.upVotes}
            downVotes={proposal.downVotes}
            status={proposal.status}
          />
        ))}
      </div>
    </div>
  );
};

export default Governance;
