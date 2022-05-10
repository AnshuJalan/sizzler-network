import { config } from "./config";
import { scheduleJobs } from "./jobs";
import { buildDependencies } from "./dependencies";

(async () => {
  try {
    const dependencies = buildDependencies(config);
    await dependencies.databaseClient.connect();
    await dependencies.databaseClient.init();
    const crontab = scheduleJobs(dependencies);
    crontab.start();
  } catch (err) {
    console.error(err.message);
  }
})();
