import mongoose from "mongoose";

import { Config, Models } from "../types";
import { TzktProvider } from "./TzktProvider";

export class DatabaseClient {
  models: Models;

  private _tzktProvider: TzktProvider;
  private _config: Config;

  constructor(config: Config, models: Models, tzktProvider: TzktProvider) {
    this.models = models;
    this._tzktProvider = tzktProvider;
    this._config = config;
  }

  connect = async () => {
    try {
      await mongoose.connect(this._config.mongodbURL);
      console.log(`> Connected to mongodb at ${this._config.mongodbURL}`);
    } catch (err) {
      throw err;
    }
  };

  init = async () => {
    try {
      const existingMeta = await this.models.meta.findOne();
      if (!existingMeta) {
        const tasksBigMapLevels = await this._tzktProvider.getBigMapLevels(
          this._config.contractToTask
        );
        const sizzlersBigMapLevels = await this._tzktProvider.getBigMapLevels(
          this._config.deposits
        );
        const meta = new this.models.meta({
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
}
