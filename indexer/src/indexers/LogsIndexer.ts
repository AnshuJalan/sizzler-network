import Log from "../db/models/Log";
import Meta from "../db/models/Meta";
import Task from "../db/models/Task";

import { config } from "../config";
import { TzktProvider } from "../infrastructure/TzktProvider";
import { TaskCompletionOperation, TaskOperationDetails } from "../types";

export class LogsIndexer {
  private _tzktProvider: TzktProvider;

  constructor(tzktProvider: TzktProvider) {
    this._tzktProvider = tzktProvider;
  }

  index = async (): Promise<void> => {
    try {
      const [firstLevel, lastLevel] = await this._getIndexingLevels();
      if (firstLevel === lastLevel) return;
      const taskCompletionOperations =
        await this._tzktProvider.getOperationByContract<TaskCompletionOperation>({
          contract: config.taskManager,
          entrypoint: "complete_task",
          firstLevel: firstLevel + 1,
          lastLevel,
        });
      for (const op of taskCompletionOperations) {
        const opDetails = await this._getOperationDetails(op.hash);
        const task = await Task.findOne({ contract: op.sender.address });
        const log = new Log({
          task: task._id,
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

      await Meta.findOneAndUpdate({}, { logIndexLastLevel: lastLevel });
    } catch (err) {
      throw err;
    }
  };

  private _getOperationDetails = async (hash: string): Promise<TaskOperationDetails> => {
    const fullOperation: any[] = await this._tzktProvider.getOperationByHash(hash);
    const tipOp = fullOperation.find(
      (op: any) =>
        op.sender.address === config.taskManager && op.target.address === config.sizzleToken
    );
    const sizzleMintedOp = fullOperation.find(
      (op: any) => op.sender.address === config.minter && op.target.address === config.sizzleToken
    );
    const fee = fullOperation.reduce((total, op) => total + (op.bakerFee + op.storageFee), 0);
    return {
      tip: tipOp ? tipOp.parameter.value : 0,
      sizzleMinted: sizzleMintedOp ? sizzleMintedOp.parameter.value.value : 0,
      fee,
    };
  };

  private _getIndexingLevels = async (): Promise<[number, number]> => {
    try {
      const meta = await Meta.findOne();
      const contractLevels = await this._tzktProvider.getContractLevels(config.taskManager);
      return [meta.logIndexLastLevel, contractLevels[1]];
    } catch (err) {
      throw err;
    }
  };
}
