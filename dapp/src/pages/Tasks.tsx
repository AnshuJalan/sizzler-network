import { useEffect } from "react";
import { Link } from "react-router-dom";

// Components
import Button from "../components/Button";
import TaskCard from "../components/cards/TaskCard";

// Hooks
import { useActions, useTypedSelector } from "../hooks";

const Tasks = () => {
  const { getAllTasks } = useActions();

  const { accountPkh } = useTypedSelector((state) => state.wallet);
  const { tasks } = useTypedSelector((state) => state.tasks);

  // Fetch tasks on page load
  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  return (
    <div className="min-h-screen">
      <div className="px-5 sm:px-40 pt-44 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/tasks/new">
            <Button onClick={() => true}>
              <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
                <i className="bi bi-plus-circle" />
                <span>New Task</span>
              </div>
            </Button>
          </Link>
          <div className="flex justify-center items-center font-medium bg-card hover:opacity-80 transition-opacity duration-200 shadow-sm">
            <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
              <i className="bi bi-info-circle-fill text-info" />
              <span>Showing all tasks</span>
            </div>
          </div>
        </div>
        {/* Data */}
        <div className="flex flex-col gap-y-8">
          {tasks.map((task, index) => (
            <TaskCard
              key={index}
              owner={task.owner}
              contract={task.contract}
              estimatedFee={task.estimatedFee}
              entrypoint={task.entrypoint}
              metadata={task.metadata}
              tip={task.tip}
              creditsRemaining={task.credits}
              lastExecuted={task.lastExecuted}
              isYour={accountPkh === task.owner}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
