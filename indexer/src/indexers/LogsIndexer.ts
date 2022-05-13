import { TzktProvider } from "../infrastructure/TzktProvider";
import {
  IndexerDependencies,
  TaskCompletionOperation,
  TaskOperationDetails,
  Config,
  Models,
} from "../types";

export class LogsIndexer {
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
      const taskCompletionOperations =
        await this._tzktProvider.getOperationByContract<TaskCompletionOperation>({
          contract: this._config.taskManager,
          entrypoint: "complete_task",
          firstLevel: firstLevel + 1,
          lastLevel,
        });
      for (const op of taskCompletionOperations) {
        const opDetails = await this._getOperationDetails(op.hash);
        const task = await this._models.task.findOne({
          contract: op.sender.address,
        });
        const log = new this._models.log({
          task: task._id,
          opHash: op.hash,
          sizzler: op.parameter.value,
          sizzleMinted: opDetails.sizzleMinted,
          tip: opDetails.tip,
          completedAt: new Date(op.timestamp),
        });
        await log.save();

        task.estimatedFee = opDetails.fee;
        task.lastExecuted = new Date(op.timestamp);
        await task.save();
      }

      console.log(`> Indexed Task completion logs from level ${firstLevel} to ${lastLevel}`);

      await this._models.meta.findOneAndUpdate({}, { logIndexLastLevel: lastLevel });
    } catch (err) {
      throw err;
    }
  };

  private _getOperationDetails = async (hash: string): Promise<TaskOperationDetails> => {
    const fullOperation: any[] = await this._tzktProvider.getOperationByHash(hash);
    const tipOp = fullOperation.find(
      (op: any) =>
        op.sender.address === this._config.taskManager &&
        op.target.address === this._config.sizzleToken
    );
    const sizzleMintedOp = fullOperation.find(
      (op: any) =>
        op.sender.address === this._config.minter && op.target.address === this._config.sizzleToken
    );
    const fee = fullOperation.reduce((total, op) => total + (op.bakerFee + op.storageFee), 0);
    return {
      tip: tipOp ? tipOp.parameter.value.value : 0,
      sizzleMinted: sizzleMintedOp ? sizzleMintedOp.parameter.value.value : 0,
      fee,
    };
  };

  private _getIndexingLevels = async (): Promise<[number, number]> => {
    try {
      const meta = await this._models.meta.findOne();
      const contractLevels = await this._tzktProvider.getContractLevels(this._config.taskManager);
      return [meta.logIndexLastLevel, contractLevels[1]];
    } catch (err) {
      throw err;
    }
  };
}
