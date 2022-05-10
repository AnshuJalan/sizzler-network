import { Crontab } from "./infrastructure/Crontab";
import { LogsIndexer } from "./indexers/LogsIndexer";
import { TasksIndexer } from "./indexers/TasksIndexer";
import { SizzlersIndexer } from "./indexers/SizzlersIndexer";
import { TzktProvider } from "./infrastructure/TzktProvider";

export const scheduleJobs = (tzktProvider: TzktProvider): Crontab => {
  const crontab = new Crontab();
  const every10Seconds = "*/10 * * * * *";

  crontab.register(() => new TasksIndexer(tzktProvider).index(), every10Seconds);
  crontab.register(() => new LogsIndexer(tzktProvider).index(), every10Seconds);
  crontab.register(() => new SizzlersIndexer(tzktProvider).index(), every10Seconds);

  return crontab;
};
