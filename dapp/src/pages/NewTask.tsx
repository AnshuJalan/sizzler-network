import { useState } from "react";
import { Link } from "react-router-dom";
import { validateAddress, validateContractAddress } from "@taquito/utils";

// Components
import Button from "../components/Button";

// Hooks
import { useActions } from "../hooks";

// Operations
import { requestNewTask as requestNewTaskOP } from "../operations/tasks";

// Tezos instance
import { tezos } from "../common/wallet";

// Types
import { Status } from "../redux/actions/loader";

// Local types
enum Error {
  OWNER = "Invalid Tezos address",
  CONTRACT = "Invalid Tezos contract address",
  ENTRYPOINT = "Specified contract does not contain this entrypoint",
  DESCRIPTION = "Description is too short (minimum 120 characters required)",
}

const NewTask = () => {
  // State
  const [owner, setOwner] = useState<string>("");
  const [contract, setContract] = useState<string>("");
  const [entrypoint, setEntrypoint] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);

  // Actions
  const { setLoader } = useActions();

  // Verifies inputs and sends relevant operation to the chain
  const requestNewTask = async () => {
    setError(null);

    try {
      if (validateAddress(owner) !== 3) {
        setError(Error.OWNER);
        return;
      }

      if (validateContractAddress(contract) !== 3) {
        setError(Error.CONTRACT);
        return;
      }

      setLoader(Status.LOADING, "Requesting new task...");

      // Create a contract instance to check for entrypoint correctness
      const contractInstance = await tezos.contract.at(contract);

      if (!contractInstance.entrypoints.entrypoints[entrypoint]) {
        setError(Error.ENTRYPOINT);
        return;
      }

      if (description.length < 120) {
        setError(Error.DESCRIPTION);
        return;
      }

      await requestNewTaskOP({ owner, contract, entrypoint, description });

      setLoader(Status.SUCCESS, "New task request successful!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  return (
    <div className="mx-5 lg:mx-40 mt-44 mb-20">
      <Link to="/tasks">
        <span className="text-secondary font-semibold text-base hover:opacity-70">
          <i className="bi bi-caret-left-fill" />
          Back
        </span>
      </Link>
      <div className="mt-2 p-4 lg:p-10 bg-card">
        {/* Heading */}
        <div className="font-bold text-3xl text-center">
          New T<span className="text-secondary">a</span>sk
        </div>
        <div className="mt-3 m-auto w-10/12 sm:w-1/2 text-center">
          Only bonded Sizzlers can add new tasks. New tasks are forwarded to the governance system
          for approval.
        </div>
        {/* Form */}
        <div className="flex flex-col gap-y-8 mt-10">
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Task Owner</div>
            <input
              value={owner}
              placeholder="tz 1/2/3 address"
              onChange={(e) => setOwner(e.target.value)}
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {error === Error.OWNER && (
              <div className="text-sm text-secondary">
                <i className="bi bi-exclamation-triangle mr-1"></i>
                {Error.OWNER}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Contract Address</div>
            <input
              value={contract}
              placeholder="KT1 contract address"
              onChange={(e) => setContract(e.target.value)}
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {error === Error.CONTRACT && (
              <div className="text-sm text-secondary">
                <i className="bi bi-exclamation-triangle mr-1"></i>
                {Error.CONTRACT}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Entrypoint</div>
            <input
              value={entrypoint}
              onChange={(e) => setEntrypoint(e.target.value)}
              placeholder="Alias of the entrypoint to be called"
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {error === Error.ENTRYPOINT && (
              <div className="text-sm text-secondary">
                <i className="bi bi-exclamation-triangle mr-1"></i>
                {Error.ENTRYPOINT}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Task Description</div>
            <textarea
              rows={15}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A detailed description of what is expected off a Sizzler."
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60  resize-none border-none focus:ring-2 focus:ring-secondary"
            />
            {error === Error.DESCRIPTION && (
              <div className="text-sm text-secondary">
                <i className="bi bi-exclamation-triangle mr-1"></i>
                {Error.DESCRIPTION}
              </div>
            )}
          </div>
          <div className="self-center">
            <Button onClick={requestNewTask}>
              <div className="px-3 py-2">Request New Task</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
