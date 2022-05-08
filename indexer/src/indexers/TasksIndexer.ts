import { config } from "config";
import { TzktProvider } from "infrastructure/TzktProvider";

export class TasksIndexer {
  private _tzktProvider: TzktProvider;

  constructor(tzktProvider: TzktProvider) {
    this._tzktProvider = tzktProvider;
  }

  index = async () => {};

  private indexLevel = async () => {};

  private indexFull = async () => {};

  private _getIndexingLevels = (): [number, number] => {
    return [0, 0];
  };
}
