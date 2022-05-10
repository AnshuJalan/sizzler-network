import { TzktProvider } from "../infrastructure/TzktProvider";
import {
  Models,
  Config,
  IndexerDependencies,
  BigMapUpdateActions,
  ContractToTaskBigMapUpdate,
} from "../types";

export class TasksIndexer {
  private _config: Config;
  private _models: Models;
  private _tzktProvider: TzktProvider;

  constructor({ databaseClient, tzktProvider, config }: IndexerDependencies) {
    this._tzktProvider = tzktProvider;
    this._models = databaseClient.models;
    this._config = config;
  }

  index = async (): Promise<void> => {
    try {
      const [firstLevel, lastLevel] = await this._getIndexingLevels();
      if (firstLevel === lastLevel) return;
      const tasksBigMapUpdates =
        await this._tzktProvider.getBigMapUpdates<ContractToTaskBigMapUpdate>({
          id: this._config.contractToTask,
          firstLevel: firstLevel + 1,
          lastLevel,
        });

      for (const update of tasksBigMapUpdates) {
        switch (update.action) {
          case BigMapUpdateActions.ADD_KEY: {
            const task = new this._models.task({
              contract: update.content.key,
              ...update.content.value,
            });
            await task.save();
            break;
          }
          case BigMapUpdateActions.UPDATE_KEY: {
            await this._models.task.findOneAndUpdate(
              { contract: update.content.key },
              { ...update.content.value }
            );
            break;
          }
          case BigMapUpdateActions.REMOVE_KEY: {
            await this._models.task.findOneAndRemove({ contract: update.content.key });
            break;
          }
          default: {
          }
        }
      }
      console.log(`> Indexed Tasks from level ${firstLevel} to ${lastLevel}`);
      await this._models.meta.findOneAndUpdate({}, { taskIndexLastLevel: lastLevel });
    } catch (err) {
      throw err;
    }
  };

  private _getIndexingLevels = async (): Promise<[number, number]> => {
    try {
      const meta = await this._models.meta.findOne();
      const taskBigMapLevels = await this._tzktProvider.getBigMapLevels(
        this._config.contractToTask
      );
      return [meta.taskIndexLastLevel, taskBigMapLevels[1]];
    } catch (err) {
      throw err;
    }
  };
}
