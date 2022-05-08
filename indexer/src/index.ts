import { config } from "./config";
import { scheduleJobs } from "./jobs";
import { connectDB, initDB } from "./db";
import { TzktProvider } from "./infrastructure/TzktProvider";

(async () => {
  try {
    const tzktProvider = new TzktProvider(config.tzktURL);
    await connectDB();
    await initDB(tzktProvider);
    const crontab = scheduleJobs(tzktProvider);
    crontab.start();
  } catch (err) {
    console.error(err.message);
  }
})();
