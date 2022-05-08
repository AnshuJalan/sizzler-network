import axios from "axios";

import { GetBigMapUpdatesOptions, GetOperationOptions } from "../types";

export class TzktProvider {
  private _tzktURL: string;

  constructor(tzktURL: string) {
    this._tzktURL = tzktURL;
  }

  getOperation = async (options: GetOperationOptions): Promise<any> => {
    try {
      const res = await axios.get(
        `${this._tzktURL}/operations/transaction${this._formatQueries(options)}`
      );
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  getBigMapUpdates = async (options: GetBigMapUpdatesOptions): Promise<any> => {
    try {
      const res = await axios.get(
        `${this._tzktURL}/bigmaps/updates?bigmap=${options.id}&level=${options.level}`
      );
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  private _formatQueries = (options: GetOperationOptions): string => {
    if (options.hash) {
      return `/${options.hash}`;
    } else {
      let queryString = `?${options.contract}`;
      if (options.entrypoint) {
        queryString += `&${options.entrypoint}`;
      }
      if (options.level) {
        queryString += `&${options.level}`;
      }
      return queryString;
    }
  };
}
