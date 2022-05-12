import { Router, Request, Response } from "express";
import { DatabaseClient } from "../../infrastructure/DatabaseClient";

const build = (databaseClient: DatabaseClient): Router => {
  const router = Router();

  router.get("/:address", async (req: Request, res: Response) => {
    let sizzler = await databaseClient.models.sizzler.findOne({ address: req.params.address });
    res.json(sizzler ? sizzler : {}).status(200);
  });

  return router;
};

export default build;
