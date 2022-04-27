import { Link } from "react-router-dom";
// Components
import Button from "../components/Button";
import TaskCard from "../components/cards/TaskCard";

const Tasks = () => {
  return (
    <div className="px-5 sm:px-40 mt-44 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link to="/tasks/new">
          <Button onClick={() => true}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
              <i className="bi bi-plus-circle-fill" />
              <span>New Task</span>
            </div>
          </Button>
        </Link>
        <div className="flex justify-center items-center font-medium bg-card hover:opacity-80 transition-opacity duration-200 cursor-pointer shadow-sm">
          <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
            <i className="bi bi-funnel-fill text-info" />
            <span>All Tasks</span>
          </div>
        </div>
      </div>
      {/* Data */}
      <div className="flex flex-col gap-y-8">
        <TaskCard
          creator="tz1eUzpKnk5gKLYw4HWs2sWsynfbT7ypGxNM"
          contract="KT1L6XCiQ4zwZWNzAjYpa615GusV3MN6uNiN"
          estimatedFee="0.057"
          entrypoint="recharge_farm"
          metadata=""
          tip="12.5"
          creditsRemaining="25"
          lastExecuted="15-04-2022 04:54:12"
        />
        <TaskCard
          creator="tz1eUzpKnk5gKLYw4HWs2sWsynfbT7ypGxNM"
          contract="KT1L6XCiQ4zwZWNzAjYpa615GusV3MN6uNiN"
          estimatedFee="0.057"
          entrypoint="recharge_farm"
          metadata=""
          tip="12.5"
          creditsRemaining="25"
          lastExecuted="-"
          isYour
        />
        <TaskCard
          creator="tz1eUzpKnk5gKLYw4HWs2sWsynfbT7ypGxNM"
          contract="KT1L6XCiQ4zwZWNzAjYpa615GusV3MN6uNiN"
          estimatedFee="0.057"
          entrypoint="recharge_farm"
          metadata=""
          tip="12.5"
          creditsRemaining="25"
          lastExecuted="15-04-2022 04:54:12"
        />
        <TaskCard
          creator="tz1eUzpKnk5gKLYw4HWs2sWsynfbT7ypGxNM"
          contract="KT1L6XCiQ4zwZWNzAjYpa615GusV3MN6uNiN"
          estimatedFee="0.057"
          entrypoint="recharge_farm"
          metadata=""
          tip="12.5"
          creditsRemaining="25"
          lastExecuted="15-04-2022 04:54:12"
        />
      </div>
    </div>
  );
};

export default Tasks;
