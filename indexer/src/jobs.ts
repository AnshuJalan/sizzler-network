import { IndexerDependencies } from "./types";
import { Crontab } from "./infrastructure/Crontab";
import { LogsIndexer } from "./indexers/LogsIndexer";
import { TasksIndexer } from "./indexers/TasksIndexer";
import { SizzlersIndexer } from "./indexers/SizzlersIndexer";

export const scheduleJobs = (dependencies: IndexerDependencies): Crontab => {
  const crontab = new Crontab();
  const every10Seconds = "*/10 * * * * *";

  crontab.register(() => new TasksIndexer(dependencies).index(), every10Seconds);
  crontab.register(() => new LogsIndexer(dependencies).index(), every10Seconds);
  crontab.register(() => new SizzlersIndexer(dependencies).index(), every10Seconds);

  return crontab;
};
