import { Models } from "./types";
import Log from "./db/models/Log";
import Meta from "./db/models/Meta";
import Task from "./db/models/Task";
import Sizzler from "./db/models/Sizzler";

import { Config, IndexerDependencies } from "./types";
import { TzktProvider } from "./infrastructure/TzktProvider";
import { DatabaseClient } from "./infrastructure/DatabaseClient";

export const buildDependencies = (config: Config): IndexerDependencies => {
  const models: Models = {
    meta: Meta,
    log: Log,
    task: Task,
    sizzler: Sizzler,
  };

  const tzktProvider = new TzktProvider(config.tzktURL);
  const databaseClient = new DatabaseClient(config, models, tzktProvider);

  return {
    config,
    tzktProvider,
    databaseClient,
  };
};
