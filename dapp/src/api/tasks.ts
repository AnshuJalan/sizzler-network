import axios from "axios";
import BigNumber from "bignumber.js";

// Globals
import { indexerURL } from "../common/global";

export interface Task {
  contract: string;
  entrypoint: string;
  metadata: string;
  owner: string;
  tip: string;
  credits: string;
  estimatedFee: number | undefined;
  lastExecuted: string | undefined;
}

export const getAllTasks = async (): Promise<Task[]> => {
  const res_: { data: Task[] } = await axios.get(`${indexerURL}/tasks`);

  const tasks: Task[] = [];

  res_.data.forEach((task: Task) => {
    tasks.push({
      ...task,
      tip: new BigNumber(task.tip).dividedBy(10 ** 18).toFixed(2),
      credits: new BigNumber(task.credits).dividedBy(10 ** 18).toFixed(2),
    });
  });

  return tasks;
};
