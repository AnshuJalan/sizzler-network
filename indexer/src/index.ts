import dotenv from "dotenv";

import { config } from "./config";
import { scheduleJobs } from "./jobs";
import { getExpressServer } from "./server";
import { buildDependencies } from "./dependencies";

(async () => {
  try {
    dotenv.config();
    const dependencies = buildDependencies(config);
    await dependencies.databaseClient.connect();
    await dependencies.databaseClient.init();
    const crontab = scheduleJobs(dependencies);
    crontab.start();

    const server = getExpressServer(dependencies.databaseClient);
    server.listen(config.serverPort, () => {
      console.log(`> Express server listening to request on port: ${config.serverPort}`);
    });
  } catch (err) {
    console.error(err.message);
  }
})();
