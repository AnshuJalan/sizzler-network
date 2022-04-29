import React from "react";
import { Tooltip } from "flowbite-react";

// Components
import Button from "../Button";

// Hooks
import { useWindowDimensions } from "../../hooks";

interface ITaskCard {
  creator: string;
  contract: string;
  entrypoint: string;
  tip: string;
  creditsRemaining: string;
  estimatedFee: string;
  lastExecuted: string;
  metadata: string;
  isYour?: boolean;
}

const TaskCard = ({
  creator,
  contract,
  entrypoint,
  tip,
  creditsRemaining,
  estimatedFee,
  lastExecuted,
  metadata,
  isYour = false,
}: ITaskCard) => {
  const { width } = useWindowDimensions();

  return (
    <div className="bg-card shadow-sm py-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <i className="text-icon text-lg bi bi-wallet-fill" />
            <span className="text-secondary font-semibold ml-2 hover:underline cursor-pointer">
              {width < 1280 ? `${creator.slice(0, 5)}...${creator.slice(-2)}` : creator}
            </span>
          </div>
          <div className="flex items-center">
            <i className="text-icon text-lg bi bi-file-earmark-code-fill" />
            <span className="text-secondary font-semibold ml-2 hover:underline cursor-pointer">
              {width < 1280 ? `${contract.slice(0, 5)}...${contract.slice(-2)}` : contract}
            </span>
          </div>
        </div>
        <Tooltip content="View Metadata" className="rounded-t-none rounded-b-none">
          <i className="bi bi-info-circle-fill text-xl text-info cursor-pointer"></i>
        </Tooltip>
      </div>
      {/* Divider */}
      <div className="bg-label opacity-20 h-0.5" />
      {/* Details */}
      <div className="grid grid-cols-2 lg:grid-cols-5 py-3 gap-y-3 font-medium">
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Entrypoint</span>
          <span>{entrypoint}</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Estimated Fee</span>
          <span>{estimatedFee} ꜩ</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Tip</span>
          <span>{tip} SZL</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Credits Remaining</span>
          <span>{creditsRemaining} SZL</span>
        </div>
        <div className="flex flex-col items-center gap-y-2 col-span-2 lg:col-span-1">
          <span className="text-label">Last Executed</span>
          <span>{lastExecuted || "-"}</span>
        </div>
      </div>
      {isYour && (
        <React.Fragment>
          {/* Divider */}
          <div className="bg-label opacity-20 h-0.5" />
          {/* Actions */}
          <div className="grid sm:inline-grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 pt-2">
            <Button onClick={() => true}>
              <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
                <i className="bi bi-cash-coin" />
                Update Tip
              </div>
            </Button>
            <Button onClick={() => true}>
              <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
                <i className="bi bi-credit-card-2-back" />
                Add Credits
              </div>
            </Button>
            <Button onClick={() => true}>
              <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
                <i className="bi bi-wallet" />
                Add Credits
              </div>
            </Button>
            <Button onClick={() => true}>
              <div className="flex items-center justify-center gap-x-3 px-3 py-1 text-sm">
                <i className="bi bi-x-square" />
                Remove Task
              </div>
            </Button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default TaskCard;
