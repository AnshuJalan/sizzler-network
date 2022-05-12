import { useEffect } from "react";

// Components
import LogCard from "../components/cards/LogCard";

// Hooks
import { useActions, useTypedSelector } from "../hooks";

const Logs = () => {
  const { getAllLogs } = useActions();

  const { logs } = useTypedSelector((state) => state.logs);

  // Load logs on component mounting
  useEffect(() => {
    getAllLogs();
  }, [getAllLogs]);

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
          <LogCard key={index} {...log} />
        ))}
      </div>
    </div>
  );
};

export default Logs;
