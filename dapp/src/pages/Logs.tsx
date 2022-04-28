// Components
import LogCard from "../components/cards/LogCard";

// Temp dummy
const logs = [
  {
    headerIcon: "bi bi-clipboard2-check-fill",
    headerText: "Task Completed",
    headerLink: "",
    operationHash: "oowXb6CsqDx9hdU1GQFMS7FQEvSaZsvzpk8fuoGMTjR5yCovziA",
    bodyData: [
      { caption: "Task ID", value: "# 124" },
      { caption: "Sizzler", value: "tz1Zcz...19S" },
      { caption: "SZL Minted", value: "12.5 SZL" },
      { caption: "Tip", value: "0.5 SZL" },
      { caption: "Completed At", value: "15-04-2022 04:54:12" },
    ],
    metadata: "ipfs://",
  },
  {
    headerIcon: "bi bi-clipboard2-check-fill",
    headerText: "Task Completed",
    headerLink: "",
    operationHash: "oowXb6CsqDx9hdU1GQFMS7FQEvSaZsvzpk8fuoGMTjR5yCovziA",
    bodyData: [
      { caption: "Task ID", value: "# 124" },
      { caption: "Sizzler", value: "tz1Zcz...19S" },
      { caption: "SZL Minted", value: "12.5 SZL" },
      { caption: "Tip", value: "0.5 SZL" },
      { caption: "Completed At", value: "15-04-2022 04:54:12" },
    ],
    metadata: "ipfs://",
  },
];

const Logs = () => {
  return (
    <div className="px-5 sm:px-40 mt-44 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-x-3 bg-card px-3 py-2 text-sm font-medium shadow-sm">
          <i className="bi bi-info-circle-fill text-info" />
          <span>This version only shows logs for the latest task completions.</span>
        </div>
        {/* Needed in future */}
        {/* <div className="flex justify-center items-center font-medium bg-card hover:opacity-80 transition-opacity duration-200 cursor-pointer shadow-sm">
          <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
            <i className="bi bi-funnel-fill text-info" />
            <span>All Tasks</span>
          </div>
        </div> */}
      </div>
      {/* Data */}
      <div className="flex flex-col gap-y-8">
        {logs.map((log, index) => (
          <LogCard
            key={index}
            headerIcon={log.headerIcon}
            headerText={log.headerText}
            headerLink={log.headerLink}
            operationHash={log.operationHash}
            bodyData={log.bodyData}
            metadata={log.metadata}
          />
        ))}
      </div>
    </div>
  );
};

export default Logs;
