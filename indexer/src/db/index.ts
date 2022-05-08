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
      const taskBigMapLevels = await tzktProvider.getBigMapLevels(config.contractToTask);
      const meta = new Meta({
        taskIndexLastLevel: taskBigMapLevels[0],
        logIndexLastLevel: taskBigMapLevels[0],
      });
      await meta.save();
      console.log(`> Initialized genesis indexing level ${taskBigMapLevels[0]}`);
    }
  } catch (err) {
    throw err;
  }
};

// Export all models
export * from "./models/Task";
export * from "./models/Log";
