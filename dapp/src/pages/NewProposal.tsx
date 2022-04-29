import { Link } from "react-router-dom";

// Components
import Button from "../components/Button";

const NewProposal = () => {
  return (
    <div className="mx-5 lg:mx-40 mt-44 mb-20">
      <Link to="/governance">
        <span className="text-secondary font-semibold text-base hover:opacity-70">
          <i className="bi bi-caret-left-fill" />
          Back
        </span>
      </Link>
      <div className="mt-2 p-4 lg:p-10 bg-card shadow-md">
        {/* Heading */}
        <div className="font-bold text-3xl text-center">
          New Propos<span className="text-secondary">a</span>l
        </div>
        <div className="mt-3 m-auto w-10/12 sm:w-8/12 text-center">
          Only bonded Sizzlers can add new proposals. New proposals are forwarded to the governance
          system for approval. To add a new task request proposal, go{" "}
          <Link to="/tasks/new">
            <span className="text-secondary font-medium">here</span>
          </Link>
          .
        </div>
        <div className="flex flex-col gap-y-8 mt-10">
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Proposal Type</div>
            <input
              placeholder="Choose Proposal Type"
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Proposal Description</div>
            <textarea
              rows={10}
              placeholder="A detailed description of the purpose of the proposal."
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60  resize-none border-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Proposal Lambda</div>
            <textarea
              rows={15}
              placeholder="Michelson lambda to be executed during generic proposal execution."
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60  resize-none border-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="self-center">
            <Button onClick={() => true}>
              <div className="px-3 py-2">Submit New Proposal</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProposal;
