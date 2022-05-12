import { Router } from "express";
import { DatabaseClient } from "../../infrastructure/DatabaseClient";

import TasksRouter from "./Tasks";
import LogsRouter from "./Logs";
import StatsRouter from "./Stats";
import SizzlersRouter from "./Sizzler";

export const buildRouter = (databaseClient: DatabaseClient): Router => {
  const router = Router();

  router.use("/tasks", TasksRouter(databaseClient));
  router.use("/logs", LogsRouter(databaseClient));
  router.use("/stats", StatsRouter(databaseClient));
  router.use("/sizzlers", SizzlersRouter(databaseClient));

  return router;
};
