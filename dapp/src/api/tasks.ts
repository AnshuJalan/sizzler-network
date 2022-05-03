import axios from "axios";
import BigNumber from "bignumber.js";

// Globals
import { taskManagerAddress, tzktURL } from "../common/global";

export interface Task {
  contract: string;
  entypoint: string | undefined;
  metadata: string;
  owner: string;
  tip: string;
  credits: string;
}

export const getAllTasks = async (): Promise<Task[]> => {
  const res_: { data: any } = await axios.get(
    `${tzktURL}/contracts/${taskManagerAddress}/bigmaps/contract_to_task/keys`
  );

  const tasks: Task[] = [];

  res_.data.forEach((taskItem: any) =>
    tasks.push({
      contract: taskItem.key,
      ...taskItem.value,
      tip: new BigNumber(taskItem.value.tip).dividedBy(10 ** 18).toFixed(2),
      credits: new BigNumber(taskItem.value.credits).dividedBy(10 ** 18).toFixed(2),
    })
  );

  return tasks;
};
