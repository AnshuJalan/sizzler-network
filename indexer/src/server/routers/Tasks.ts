import { Router, Response } from "express";
import { DatabaseClient } from "../../infrastructure/DatabaseClient";

const build = (databaseClient: DatabaseClient): Router => {
  const router = Router();

  router.get("/", async (_, res: Response) => {
    const tasks = await databaseClient.models.task.find({});
    res.json(tasks).status(200);
  });

  return router;
};

export default build;
