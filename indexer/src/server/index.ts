import cors from "cors";
import express, { Express } from "express";

import { buildRouter } from "./routers";
import { DatabaseClient } from "../infrastructure/DatabaseClient";

export const getExpressServer = (databaseClient: DatabaseClient): Express => {
  const app = express();
  app.use("/", buildRouter(databaseClient));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  return app;
};
