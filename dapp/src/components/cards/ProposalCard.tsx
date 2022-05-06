import React from "react";
import { Tooltip } from "flowbite-react";

// Operations
import { endVoting, execute, flushProposal, vote, Vote } from "../../operations/governance";

// Types
import { Status } from "../../redux/actions/loader";

// Hooks
import { useActions } from "../../hooks";

// Components
import Button from "../Button";

interface IProposalCard {
  proposalId: string;
  title: string;
  descriptionLink: string;
  sizzler: string;
  upVotes: number;
  downVotes: number;
  status: any;
}

const ProposalCard = ({
  proposalId,
  title,
  descriptionLink,
  sizzler,
  upVotes,
  downVotes,
  status,
}: IProposalCard) => {
  const { setLoader } = useActions();

  const onUpVote = async () => {
    try {
      setLoader(Status.LOADING, `Up-voting proposal #${proposalId}`);
      await vote(proposalId, Vote.UP_VOTE);
      setLoader(Status.SUCCESS, "Voting successful!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  const onDownVote = async () => {
    try {
      setLoader(Status.LOADING, `Down-voting proposal #${proposalId}`);
      await vote(proposalId, Vote.UP_VOTE);
      setLoader(Status.SUCCESS, "Voting successful!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  const onExecute = async () => {
    try {
      setLoader(Status.LOADING, `Executing proposal #${proposalId}`);
      await execute(proposalId);
      setLoader(Status.SUCCESS, "Execution successful!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  const onEndVoting = async () => {
    try {
      setLoader(Status.LOADING, `Ending vote for proposal #${proposalId}`);
      await endVoting(proposalId);
      setLoader(Status.SUCCESS, "Vote ended successful!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  const onRemove = async () => {
    try {
      setLoader(Status.LOADING, `Removing proposal #${proposalId}`);
      await flushProposal(proposalId);
      setLoader(Status.SUCCESS, "Proposal removed!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  const getQuorumGradient = (): string => {
    const quorumThreshold = Math.max(upVotes + downVotes, 5);

    let upPercentage = Math.ceil((upVotes / quorumThreshold) * 100);
    let downPercentage = upPercentage + Math.ceil((downVotes / quorumThreshold) * 100);

    upPercentage = upPercentage === 0 ? 1 : upPercentage;
    downPercentage = downPercentage <= upPercentage ? upPercentage + 1 : downPercentage;

    return `linear-gradient(to right, #E45826 0%, #E45826 ${upPercentage}%, #F0A500 ${upPercentage}%, #F0A500 ${downPercentage}%, #88888840 ${downPercentage}%, #88888840 100%)`;
  };

  const formattedStatus = (() => {
    if (Object.keys(status)[0] === "voting")
      return (
        <React.Fragment>
          Voting
          <Tooltip
            content={`Ends at ${new Date(status.voting).toLocaleString()}`}
            className="rounded-t-none rounded-b-none"
          >
            {" "}
            <i className="bi bi-info-circle-fill text-sm opacity-50 cursor-pointer"></i>
          </Tooltip>
        </React.Fragment>
      );
    else if (Object.keys(status)[0] === "timelocked")
      return (
        <React.Fragment>
          Timelocked
          <Tooltip
            content={`Ends at ${new Date(status.timelocked).toLocaleString()}`}
            className="rounded-t-none rounded-b-none"
          >
            {" "}
            <i className="bi bi-info-circle-fill text-sm opacity-50 cursor-pointer"></i>
          </Tooltip>
        </React.Fragment>
      );
    else if (Object.keys(status)[0] === "passed") return "Passed";
    else return "Failed";
  })();

  return (
    <div className="bg-card shadow-sm py-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 pb-2 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <i className="text-icon text-lg bi bi-bank2" />
            <span className="text-secondary font-semibold ml-2 hover:underline cursor-pointer">
              {title}
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
            style={{ backgroundImage: getQuorumGradient() }}
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
          <span>{`# ${proposalId}`}</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Sizzler</span>
          <span>{`${sizzler.slice(0, 8)}...${sizzler.slice(-7)}`}</span>
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
          <span>{formattedStatus}</span>
        </div>
      </div>

      <React.Fragment>
        {/* Divider */}
        <div className="bg-label opacity-20 h-0.5" />
        {/* Actions */}
        <div className="grid sm:inline-grid grid-cols-2 sm:grid-cols-5 gap-3 px-4 pt-2">
          <Button onClick={onUpVote}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
              <i className="bi bi-hand-thumbs-up" />
              Up Vote
            </div>
          </Button>
          <Button onClick={onDownVote}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
              <i className="bi bi-hand-thumbs-down" />
              Down Vote
            </div>
          </Button>
          <Button onClick={onEndVoting}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
              <i className="bi bi-stopwatch" />
              End Voting
            </div>
          </Button>
          <Button onClick={onExecute}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
              <i className="bi bi-check-square" />
              Execute
            </div>
          </Button>
          <Button onClick={onRemove}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
              <i className="bi bi-x-square" />
              Remove
            </div>
          </Button>
        </div>
      </React.Fragment>
    </div>
  );
};

export default ProposalCard;
