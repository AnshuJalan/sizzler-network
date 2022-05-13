import mongoose from "mongoose";

import * as models from "./db";
import { DatabaseClient } from "./infrastructure/DatabaseClient";
import { TzktProvider } from "./infrastructure/TzktProvider";

export interface GetOperationByContractOptions {
  contract: string;
  entrypoint: string;
  firstLevel: number;
  lastLevel: number;
}

export interface GetBigMapUpdatesOptions {
  id: string;
  firstLevel: number;
  lastLevel: number;
}

export enum BigMapUpdateActions {
  ADD_KEY = "add_key",
  UPDATE_KEY = "update_key",
  REMOVE_KEY = "remove_key",
}

export interface ContractToTaskBigMapUpdate {
  action: BigMapUpdateActions;
  content: {
    key: string;
    value: {
      tip: string;
      owner: string;
      credits: string;
      metadata: string;
      entrypoint: string;
    };
  };
}

export interface SizzlersBigMapUpdate {
  action: BigMapUpdateActions;
  content: {
    key: string;
    value: {
      stake: string;
      task_limit: string;
      task_counter: string;
      last_reset_at: string;
    };
  };
}

export interface DepositWithdrawalBigMapUpdate {
  action: BigMapUpdateActions;
  content: {
    key: string;
    value: {
      amount: string;
      confirmation_at: string;
    };
  };
}

export interface TaskCompletionOperation {
  hash: string;
  timestamp: string;
  sender: {
    address: string;
  };
  parameter: {
    value: string;
  };
}

export interface TaskOperationDetails {
  tip: number;
  sizzleMinted: number;
  fee: number;
}

export interface Config {
  tzktURL: string;
  mongodbURL: string;
  serverPort: string;
  contractToTask: string;
  sizzlers: string;
  deposits: string;
  withdrawals: string;
  taskManager: string;
  sizzlerManager: string;
  sizzleToken: string;
  minter: string;
}

export interface Models {
  meta: mongoose.Model<models.Meta>;
  log: mongoose.Model<models.Log>;
  sizzler: mongoose.Model<models.Sizzler>;
  task: mongoose.Model<models.Task>;
}

export interface IndexerDependencies {
  config: Config;
  tzktProvider: TzktProvider;
  databaseClient: DatabaseClient;
}
