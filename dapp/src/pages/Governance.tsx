import { Link } from "react-router-dom";

// Components
import Button from "../components/Button";
import ProposalCard from "../components/cards/ProposalCard";

const Governance = () => {
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
        <div className="flex justify-center items-center font-medium bg-card hover:opacity-80 transition-opacity duration-200 cursor-pointer shadow-sm">
          <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
            <i className="bi bi-funnel-fill text-info" />
            <span>All Proposals</span>
          </div>
        </div>
      </div>
      {/* Data */}
      <div className="flex flex-col gap-y-8">
        <ProposalCard
          proposalId="# 23"
          sizzler="tz1ZczL...419S"
          metadata="ipfs://"
          type="New Task Request"
          upVotes={102}
          downVotes={23}
          status="Voting ends in 6:30:24"
        />

        <ProposalCard
          proposalId="# 23"
          sizzler="tz1ZczL...419S"
          metadata="ipfs://"
          type="New Task Request"
          upVotes={54}
          downVotes={15}
          status="Voting ends in 6:30:24"
        />
      </div>
    </div>
  );
};

export default Governance;
