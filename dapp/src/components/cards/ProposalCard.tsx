import React from "react";

// Components
import Button from "../Button";

interface IProposalCard {
  type: string;
  proposalId: string;
  sizzler: string;
  metadata: string;
  upVotes: number;
  downVotes: number;
  status: string;
}

const ProposalCard = ({
  type,
  proposalId,
  sizzler,
  metadata,
  upVotes,
  downVotes,
  status,
}: IProposalCard) => {
  // Temp constant
  const quorumThreshold = Math.max(upVotes + downVotes, 100);

  const upPercentage = Math.ceil((upVotes / quorumThreshold) * 100);
  const downPercentage = upPercentage + Math.ceil((downVotes / quorumThreshold) * 100);

  const quorumGradientString = `linear-gradient(to right, #E45826 0%, #E45826 ${upPercentage}%, #F0A500 ${upPercentage}%, #F0A500 ${downPercentage}%, #88888840 ${downPercentage}%, #88888840 100%)`;

  console.log(quorumGradientString);

  return (
    <div className="bg-card shadow-sm py-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 pb-2 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <i className="text-icon text-lg bi bi-bank2" />
            <span className="text-secondary font-semibold ml-2 hover:underline cursor-pointer">
              {type}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-y-1 w-full lg:w-1/2">
          <div className="flex justify-between item-center w-full font-semibold text-sm">
            <span>
              <span className="text-secondary">Up votes</span> /{" "}
              <span className="text-info">Down Votes</span>
            </span>
            Quorum
          </div>
          <div
            style={{ backgroundImage: quorumGradientString }}
            className="rounded-full h-2 w-full"
          ></div>
        </div>
      </div>
      {/* Divider */}
      <div className="bg-label opacity-20 h-0.5" />
      {/* Details */}
      <div className="grid grid-cols-2 lg:grid-cols-5 py-3 gap-y-3 font-medium">
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Proposal ID</span>
          <span>{proposalId}</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Sizzler</span>
          <span>{sizzler}</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Up Votes</span>
          <span>{upVotes}</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Down Votes</span>
          <span>{downVotes}</span>
        </div>
        <div className="flex flex-col items-center gap-y-2 col-span-2 lg:col-span-1">
          <span className="text-label">Status</span>
          <span>{status}</span>
        </div>
      </div>

      <React.Fragment>
        {/* Divider */}
        <div className="bg-label opacity-20 h-0.5" />
        {/* Actions */}
        <div className="grid sm:inline-grid grid-cols-2 sm:grid-cols-5 gap-3 px-4 pt-2">
          <Button onClick={() => true}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
              <i className="bi bi-hand-thumbs-up" />
              Up Vote
            </div>
          </Button>
          <Button onClick={() => true}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
              <i className="bi bi-hand-thumbs-down" />
              Down Vote
            </div>
          </Button>
          <Button onClick={() => true}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
              <i className="bi bi-stopwatch" />
              End Voting
            </div>
          </Button>
          <Button onClick={() => true}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
              <i className="bi bi-check-square" />
              Execute
            </div>
          </Button>
          {/* <Button onClick={() => true}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
              <i className="bi bi-x-square" />
              Remove
            </div>
          </Button> */}
        </div>
      </React.Fragment>
    </div>
  );
};

export default ProposalCard;
