import { Tooltip } from "flowbite-react";

// Globals
import { explorerURL } from "../../common/global";

// Hooks
import { useWindowDimensions } from "../../hooks";

interface LogCardProps {
  task: {
    contract: string;
    entrypoint: string;
    metadata: string;
  };
  opHash: string;
  sizzler: string;
  sizzleMinted: string;
  tip: string;
  completedAt: string;
}

const LogCard = ({ task, opHash, sizzleMinted, sizzler, tip, completedAt }: LogCardProps) => {
  const { width } = useWindowDimensions();

  return (
    <div className="bg-card shadow-sm py-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <i className={`text-icon text-lg bi bi-clipboard2-check-fill`} />
            <a href={`${explorerURL}/${opHash}`} target="_blank" rel="noreferrer">
              <span className="text-secondary font-semibold ml-2 hover:underline cursor-pointer">
                Task Completed
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <i className={`text-icon text-lg bi bi-wrench-adjustable`} />
            <a href={`${explorerURL}/${sizzler}`} target="_blank" rel="noreferrer">
              <span className="text-secondary font-semibold ml-2 hover:underline cursor-pointer">
                {width < 1280 ? `${sizzler.slice(0, 5)}...${sizzler.slice(-2)}` : sizzler}
              </span>
            </a>
          </div>
        </div>
        <a href={task.metadata} target="_blank" rel="noreferrer">
          <Tooltip content="View Metadata" className="rounded-t-none rounded-b-none">
            <i className="bi bi-info-circle-fill text-xl text-info cursor-pointer"></i>
          </Tooltip>
        </a>
      </div>
      {/* Divider */}
      <div className="bg-label opacity-20 h-0.5" />
      {/* Details */}
      <div className="grid grid-cols-2 lg:grid-cols-5 py-3 gap-y-3 font-medium">
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Contract</span>
          <span>{`${task.contract.slice(0, 7)}...${task.contract.slice(-5)}`}</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Entrpoint</span>
          <span>{task.entrypoint}</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Sizzle Minted</span>
          <span>{sizzleMinted} SZL</span>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <span className="text-label">Tip</span>
          <span>{tip} SZL</span>
        </div>
        <div className="flex flex-col items-center gap-y-2 col-span-2 lg:col-span-1">
          <span className="text-label">Completed At</span>
          <span>{new Date(completedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default LogCard;
