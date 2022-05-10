import Meta from "../db/models/Meta";
import Sizzler from "../db/models/Sizzler";

import { config } from "../config";
import { TzktProvider } from "../infrastructure/TzktProvider";
import { BigMapUpdateActions, SizzlersBigMapUpdate, DepositWithdrawalBigMapUpdate } from "../types";

export class SizzlersIndexer {
  private _tzktProvider: TzktProvider;

  constructor(tzktProvider: TzktProvider) {
    this._tzktProvider = tzktProvider;
  }

  index = async (): Promise<void> => {
    try {
      await this._indexDeposits();
      await this._indexSizzler();
      await this._indexWithdrawals();
    } catch (err) {
      throw err;
    }
  };

  private _indexSizzler = async (): Promise<void> => {
    try {
      const [firstLevel, lastLevel] = await this._getSizzlersIndexingLevels();
      if (firstLevel === lastLevel) return;
      const sizzlersBigMapUpdates = await this._tzktProvider.getBigMapUpdates<SizzlersBigMapUpdate>(
        {
          id: config.sizzlers,
          firstLevel: firstLevel + 1,
          lastLevel,
        }
      );
      for (const update of sizzlersBigMapUpdates) {
        switch (update.action) {
          case BigMapUpdateActions.ADD_KEY:
          case BigMapUpdateActions.UPDATE_KEY: {
            await Sizzler.findOneAndUpdate(
              { address: update.content.key },
              {
                stake: update.content.value.stake,
                taskLimit: update.content.value.task_limit,
                taskCounter: update.content.value.task_counter,
                lastResetAt: update.content.value.last_reset_at,
              }
            );
            break;
          }
          default: {
          }
        }
      }

      console.log(`> Indexed Sizzlers from level ${firstLevel} to ${lastLevel}`);

      await Meta.findOneAndUpdate(
        {},
        {
          $set: {
            "sizzlerIndex.mainLastLevel": lastLevel,
          },
        }
      );
    } catch (err) {
      throw err;
    }
  };

  private _indexDeposits = async (): Promise<void> => {
    try {
      const [firstLevel, lastLevel] = await this._getDepositsIndexingLevels();
      if (firstLevel === lastLevel) return;
      const depositsBigMapUpdates =
        await this._tzktProvider.getBigMapUpdates<DepositWithdrawalBigMapUpdate>({
          id: config.deposits,
          firstLevel: firstLevel + 1,
          lastLevel,
        });
      for (const update of depositsBigMapUpdates) {
        switch (update.action) {
          case BigMapUpdateActions.ADD_KEY: {
            const sizzler = new Sizzler({
              address: update.content.key,
              deposit: {
                amount: update.content.value.amount,
                confirmationAt: update.content.value.confirmation_at,
              },
            });
            await sizzler.save();
            break;
          }
          case BigMapUpdateActions.UPDATE_KEY: {
            await Sizzler.findOneAndUpdate(
              { address: update.content.key },
              {
                deposit: {
                  amount: update.content.value.amount,
                  confirmationAt: update.content.value.confirmation_at,
                },
              }
            );
            break;
          }
          default: {
          }
        }
      }

      console.log(`> Indexed Deposits from level ${firstLevel} to ${lastLevel}`);

      await Meta.findOneAndUpdate(
        {},
        {
          $set: {
            "sizzlerIndex.depositsLastLevel": lastLevel,
          },
        }
      );
    } catch (err) {
      throw err;
    }
  };

  private _indexWithdrawals = async (): Promise<void> => {
    try {
      const [firstLevel, lastLevel] = await this._getWithdrawalsIndexingLevels();
      if (firstLevel === lastLevel) return;
      const withdrawalsBigMapUpdates =
        await this._tzktProvider.getBigMapUpdates<DepositWithdrawalBigMapUpdate>({
          id: config.withdrawals,
          firstLevel: firstLevel + 1,
          lastLevel,
        });
      for (const update of withdrawalsBigMapUpdates) {
        switch (update.action) {
          case BigMapUpdateActions.ADD_KEY:
          case BigMapUpdateActions.UPDATE_KEY: {
            await Sizzler.findOneAndUpdate(
              { address: update.content.key },
              {
                withdrawal: {
                  amount: update.content.value.amount,
                  confirmationAt: update.content.value.confirmation_at,
                },
              }
            );
            break;
          }
          default: {
          }
        }
      }

      console.log(`> Indexed Withdrawals from level ${firstLevel} to ${lastLevel}`);

      await Meta.findOneAndUpdate(
        {},
        {
          $set: {
            "sizzlerIndex.withdrawalsLastLevel": lastLevel,
          },
        }
      );
    } catch (err) {
      throw err;
    }
  };

  private _getSizzlersIndexingLevels = async (): Promise<[number, number]> => {
    try {
      const meta = await Meta.findOne();
      const sizzlersBigMapLevels = await this._tzktProvider.getBigMapLevels(config.sizzlers);
      return [meta.sizzlerIndex.mainLastLevel, sizzlersBigMapLevels[1]];
    } catch (err) {
      throw err;
    }
  };

  private _getDepositsIndexingLevels = async (): Promise<[number, number]> => {
    try {
      const meta = await Meta.findOne();
      const depositsBigMapLevels = await this._tzktProvider.getBigMapLevels(config.deposits);
      return [meta.sizzlerIndex.depositsLastLevel, depositsBigMapLevels[1]];
    } catch (err) {
      throw err;
    }
  };

  private _getWithdrawalsIndexingLevels = async (): Promise<[number, number]> => {
    try {
      const meta = await Meta.findOne();
      const withdrawalsBigMapLevels = await this._tzktProvider.getBigMapLevels(config.withdrawals);
      return [meta.sizzlerIndex.withdrawalsLastLevel, withdrawalsBigMapLevels[1]];
    } catch (err) {
      throw err;
    }
  };
}
