import { ReactNode } from "react";
import { Tooltip } from "flowbite-react";

// Hooks
import { useWindowDimensions } from "../../hooks";

interface ILogCard {
  headerIcon: string;
  headerText: string;
  headerLink: string;
  operationHash: string;
  bodyData: { caption: string; value: ReactNode }[];
  metadata: string;
}

const LogCard = ({
  headerIcon,
  headerLink,
  headerText,
  operationHash,
  bodyData,
  metadata,
}: ILogCard) => {
  const { width } = useWindowDimensions();

  return (
    <div className="bg-card shadow-sm py-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center">
          <i className={`text-icon text-lg ${headerIcon}`} />
          <span className="text-secondary font-semibold ml-2 hover:underline cursor-pointer">
            {headerText} {width > 1024 && `(${operationHash})`}
          </span>
        </div>
        {metadata && (
          <Tooltip content="View Metadata" className="rounded-t-none rounded-b-none">
            <i className="bi bi-info-circle-fill text-xl text-info cursor-pointer"></i>
          </Tooltip>
        )}
      </div>
      {/* Divider */}
      <div className="bg-label opacity-20 h-0.5" />
      {/* Details */}
      <div className="grid grid-cols-2 lg:grid-cols-5 py-3 gap-y-3 font-medium">
        {bodyData.map((data, index) => (
          <div
            key={index}
            className={`flex flex-col items-center gap-y-2 ${
              index === bodyData.length - 1 && "col-span-2"
            } lg:col-span-1`}
          >
            <span className="text-label">{data.caption}</span>
            <span>{data.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogCard;
