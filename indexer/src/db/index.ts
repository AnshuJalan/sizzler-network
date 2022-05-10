import mongoose from "mongoose";

import Meta from "./models/Meta";

import { config } from "../config";
import { TzktProvider } from "../infrastructure/TzktProvider";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbURL);
    console.log(`> Connected to mongodb at ${config.mongodbURL}`);
  } catch (err) {
    throw err;
  }
};

export const initDB = async (tzktProvider: TzktProvider): Promise<void> => {
  try {
    const existingMeta = await Meta.findOne();
    if (!existingMeta) {
      const tasksBigMapLevels = await tzktProvider.getBigMapLevels(config.contractToTask);
      const sizzlersBigMapLevels = await tzktProvider.getBigMapLevels(config.deposits);
      const meta = new Meta({
        taskIndexLastLevel: tasksBigMapLevels[0],
        logIndexLastLevel: tasksBigMapLevels[0],
        sizzlerIndex: {
          mainLastLevel: sizzlersBigMapLevels[0],
          depositsLastLevel: sizzlersBigMapLevels[0],
          withdrawalsLastLevel: sizzlersBigMapLevels[0],
        },
      });
      await meta.save();
      console.log(
        `> Initialized genesis indexing level for tasks and logs as ${tasksBigMapLevels[0]}`
      );
      console.log(
        `> Initialized genesis indexing level for sizzlers as ${sizzlersBigMapLevels[0]}`
      );
    }
  } catch (err) {
    throw err;
  }
};
