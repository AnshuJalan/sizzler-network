import { Link } from "react-router-dom";

// Components
import Button from "../components/Button";

const NewTask = () => {
  return (
    <div className="mx-5 lg:mx-40 mt-44 mb-20">
      <Link to="/tasks">
        <span className="text-secondary font-semibold text-base hover:opacity-70">
          <i className="bi bi-caret-left-fill" />
          Back
        </span>
      </Link>
      <div className="mt-2 p-4 lg:p-10 bg-card shadow-md">
        {/* Heading */}
        <div className="font-bold text-3xl text-center">
          New T<span className="text-secondary">a</span>sk
        </div>
        <div className="mt-3 m-auto w-1/2 text-center">
          Only bonded Sizzlers can add new tasks. New tasks are forwarded to the governance system
          for approval.
        </div>
        <div className="flex flex-col gap-y-8 mt-10">
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Contract Address</div>
            <input
              placeholder="KT1 address"
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Entrypoint</div>
            <input
              placeholder="Alias of the entrypoint to be called"
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-label font-medium text-lg">Task Description</div>
            <textarea
              rows={15}
              placeholder="A detailed description of what is expected off a Sizzler."
              className="p-2 bg-primary w-full font-medium placeholder-placeholder placeholder-opacity-60  resize-none border-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="self-center">
            <Button onClick={() => true}>
              <div className="px-3 py-2">Request New Task</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
