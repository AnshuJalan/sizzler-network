import { Router, Response } from "express";
import { DatabaseClient } from "../../infrastructure/DatabaseClient";

const build = (databaseClient: DatabaseClient): Router => {
  const router = Router();

  router.get("/", async (_, res: Response) => {
    const logs = await databaseClient.models.log
      .find({})
      .populate("task", ["contract", "entrypoint", "metadata"]);
    res.json(logs).status(200);
  });

  return router;
};

export default build;
