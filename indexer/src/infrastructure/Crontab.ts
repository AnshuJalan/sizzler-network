import { CronJob } from "cron";

export class Crontab {
  private _jobs: CronJob[] = [];

  register = (job: () => Promise<void>, pattern: string): void => {
    let isTaskRunning = false;
    this._jobs.push(
      new CronJob({
        cronTime: pattern,
        onTick: async () => {
          if (isTaskRunning) {
            return;
          } else {
            isTaskRunning = true;
            try {
              await job();
            } catch (err) {
              console.error(err);
            } finally {
              isTaskRunning = false;
            }
          }
        },
      })
    );
  };

  start = (): void => {
    this._jobs.forEach((job) => job.start());
  };

  stop = (): void => {
    this._jobs.forEach((job) => job.stop());
  };
}
