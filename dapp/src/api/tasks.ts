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
}

export const getAllTasks = async (): Promise<Task[]> => {
  const res_: { data: any } = await axios.get(`${indexerURL}/tasks`);

  const tasks: Task[] = [];

  res_.data.forEach((taskItem: any) => {
    tasks.push({
      ...taskItem,
      tip: new BigNumber(taskItem.tip).dividedBy(10 ** 18).toFixed(2),
      credits: new BigNumber(taskItem.credits).dividedBy(10 ** 18).toFixed(2),
    });
  });

  return tasks;
};
