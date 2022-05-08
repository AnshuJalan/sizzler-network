import axios from "axios";

import { GetBigMapUpdatesOptions, GetOperationByContractOptions } from "../types";

export class TzktProvider {
  private _tzktURL: string;

  constructor(tzktURL: string) {
    this._tzktURL = tzktURL;
  }

  getOperationByHash = async (hash: string): Promise<any> => {
    try {
      const res = await axios.get(
        `${this._tzktURL}/operations/transactions/${hash}?status=applied`
      );
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  getOperationByContract = async <T>(options: GetOperationByContractOptions): Promise<T[]> => {
    try {
      const res = await axios.get(`${this._tzktURL}/operations/transactions`, {
        params: {
          contract: options.contract,
          entrypoint: options.entrypoint,
          [`level.ge`]: options.firstLevel,
          [`level.le`]: options.lastLevel,
          status: "applied",
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  getBigMapUpdates = async <T>(options: GetBigMapUpdatesOptions): Promise<T[]> => {
    try {
      const res = await axios.get(
        `${this._tzktURL}/bigmaps/updates?bigmap=${options.id}&level.ge=${options.firstLevel}&level.le=${options.lastLevel}`
      );
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  getBigMapLevels = async (id: string): Promise<[number, number]> => {
    try {
      const res = await axios.get(`${this._tzktURL}/bigmaps/${id}`);
      return [res.data.firstLevel, res.data.lastLevel];
    } catch (err) {
      throw err;
    }
  };

  getContractLevels = async (contract: string): Promise<[number, number]> => {
    try {
      const res = await axios.get(`${this._tzktURL}/contracts/${contract}`);
      return [res.data.firstActivity, res.data.lastActivity];
    } catch (err) {
      throw err;
    }
  };
}
