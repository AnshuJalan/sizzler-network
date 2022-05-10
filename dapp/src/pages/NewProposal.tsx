import { useState } from "react";
import { Link } from "react-router-dom";

// Hooks
import { useActions } from "../hooks";

// Types
import { Status } from "../redux/actions/loader";

// Operations
import { propose, ProposeParams } from "../operations/governance";

// Components
import Button from "../components/Button";

// Local types
enum Error {
  TITLE = "Title length invalid (Between 8-48 characters)",
  DESCRIPTION = "Description is too short (Minimum 120 characters)",
  LAMBDA = "Please enter a valid proposal lambda",
}

const NewProposal = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [lambda, setLambda] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);

  const { setLoader } = useActions();

  const onPropose = async () => {
    try {
      setError(null);

      if (title.length < 8 || title.length > 48) {
        setError(Error.TITLE);
        return;
      } else if (description.length < 120) {
        setError(Error.DESCRIPTION);
        return;
      } else if (lambda.length === 0) {
        setError(Error.LAMBDA);
        return;
      }

      const params: ProposeParams = {
        title,
        description,
        lambda: JSON.parse(lambda.replace(" ", "")),
      };

      setLoader(Status.LOADING, "Submitting new proposal...");

      await propose(params);

      setLoader(Status.SUCCESS, "New proposal submitted!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  return (
    <div className="mx-5 lg:mx-40 mt-44 mb-20">
      <Link to="/governance">
        <span className="text-secondary font-semibold text-base hover:opacity-70">
          <i className="bi bi-caret-left-fill" />
          Back
        </span>
      </Link>
      <div className="mt-2 p-4 lg:p-10 bg-card">
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
            <div className="text-label font-medium text-lg">Proposal Title</div>
            <input
              value={title}
              placeholder="A concise title for the proposal"
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {error === Error.TITLE && (
              <div className="text-sm text-secondary">
                <i className="bi bi-exclamation-triangle mr-1"></i>
                {Error.TITLE}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Proposal Description</div>
            <textarea
              rows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A detailed description of the purpose of the proposal."
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60 resize-none border-none focus:ring-2 focus:ring-secondary"
            />
            {error === Error.DESCRIPTION && (
              <div className="text-sm text-secondary">
                <i className="bi bi-exclamation-triangle mr-1"></i>
                {Error.DESCRIPTION}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Proposal Lambda</div>
            <textarea
              rows={15}
              value={lambda}
              onChange={(e) => setLambda(e.target.value)}
              placeholder="Michelson lambda to be executed during generic proposal execution."
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60 resize-none border-none focus:ring-2 focus:ring-secondary"
            />
            {error === Error.LAMBDA && (
              <div className="text-sm text-secondary">
                <i className="bi bi-exclamation-triangle mr-1"></i>
                {Error.LAMBDA}
              </div>
            )}
          </div>
          <div className="self-center">
            <Button onClick={onPropose}>
              <div className="px-3 py-2">Submit New Proposal</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProposal;
