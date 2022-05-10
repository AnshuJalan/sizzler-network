import Meta from "../db/models/Meta";
import Task from "../db/models/Task";

import { config } from "../config";
import { TzktProvider } from "../infrastructure/TzktProvider";
import { BigMapUpdateActions, ContractToTaskBigMapUpdate } from "../types";

export class TasksIndexer {
  private _tzktProvider: TzktProvider;

  constructor(tzktProvider: TzktProvider) {
    this._tzktProvider = tzktProvider;
  }

  index = async (): Promise<void> => {
    try {
      const [firstLevel, lastLevel] = await this._getIndexingLevels();
      if (firstLevel === lastLevel) return;
      const tasksBigMapUpdates =
        await this._tzktProvider.getBigMapUpdates<ContractToTaskBigMapUpdate>({
          id: config.contractToTask,
          firstLevel: firstLevel + 1,
          lastLevel,
        });

      for (const update of tasksBigMapUpdates) {
        switch (update.action) {
          case BigMapUpdateActions.ADD_KEY: {
            const task = new Task({
              contract: update.content.key,
              ...update.content.value,
            });
            await task.save();
            break;
          }
          case BigMapUpdateActions.UPDATE_KEY: {
            await Task.findOneAndUpdate(
              { contract: update.content.key },
              { ...update.content.value }
            );
            break;
          }
          case BigMapUpdateActions.REMOVE_KEY: {
            await Task.findOneAndRemove({ contract: update.content.key });
            break;
          }
          default: {
          }
        }
      }
      console.log(`> Indexed Tasks from level ${firstLevel} to ${lastLevel}`);
      await Meta.findOneAndUpdate({}, { taskIndexLastLevel: lastLevel });
    } catch (err) {
      throw err;
    }
  };

  private _getIndexingLevels = async (): Promise<[number, number]> => {
    try {
      const meta = await Meta.findOne();
      const taskBigMapLevels = await this._tzktProvider.getBigMapLevels(config.contractToTask);
      return [meta.taskIndexLastLevel, taskBigMapLevels[1]];
    } catch (err) {
      throw err;
    }
  };
}
