import { Router, Response } from "express";
import { DatabaseClient } from "../../infrastructure/DatabaseClient";

const build = (databaseClient: DatabaseClient): Router => {
  const router = Router();

  router.get("/", async (_, res: Response) => {
    try {
      const sizzlersAggr = await databaseClient.models.sizzler.aggregate([
        { $group: { _id: null, sizzlers: { $sum: 1 }, totalTasksLimit: { $sum: "$taskLimit" } } },
      ]);
      delete sizzlersAggr[0]._id;

      const tasksAggr = await databaseClient.models.task.aggregate([
        { $group: { _id: null, activeTasks: { $sum: 1 } } },
      ]);
      delete tasksAggr[0]._id;

      res.json({ ...sizzlersAggr[0], ...tasksAggr[0] }).status(200);
    } catch (err) {
      res.json({ sizzlers: 0, totalTasksLimit: 0, activeTasks: 0 });
    }
  });

  return router;
};

export default build;
