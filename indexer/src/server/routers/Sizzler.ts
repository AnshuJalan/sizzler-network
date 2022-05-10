import { Router, Request, Response } from "express";
import { DatabaseClient } from "../../infrastructure/DatabaseClient";

const build = (databaseClient: DatabaseClient): Router => {
  const router = Router();

  router.get("/", async (_, res: Response) => {
    let aggr = await databaseClient.models.sizzler.aggregate([
      {
        $group: { _id: null, sizzlers: { $sum: 1 }, totalTasks: { $sum: "$taskLimit" } },
      },
    ]);
    res.json(aggr[0]).status(200);
  });

  router.get("/:address", async (req: Request, res: Response) => {
    let sizzler = await databaseClient.models.sizzler.findOne({ address: req.params.address });
    res.json(sizzler ? sizzler : {}).status(200);
  });

  return router;
};

export default build;
