import { TzktProvider } from "../infrastructure/TzktProvider";
import {
  Models,
  Config,
  IndexerDependencies,
  BigMapUpdateActions,
  SizzlersBigMapUpdate,
  DepositWithdrawalBigMapUpdate,
} from "../types";

export class SizzlersIndexer {
  private _config: Config;
  private _models: Models;
  private _tzktProvider: TzktProvider;

  constructor({ databaseClient, tzktProvider, config }: IndexerDependencies) {
    this._tzktProvider = tzktProvider;
    this._models = databaseClient.models;
    this._config = config;
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
          id: this._config.sizzlers,
          firstLevel: firstLevel + 1,
          lastLevel,
        }
      );
      for (const update of sizzlersBigMapUpdates) {
        switch (update.action) {
          case BigMapUpdateActions.ADD_KEY:
          case BigMapUpdateActions.UPDATE_KEY: {
            await this._models.sizzler.findOneAndUpdate(
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

      await this._models.meta.findOneAndUpdate(
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
          id: this._config.deposits,
          firstLevel: firstLevel + 1,
          lastLevel,
        });
      for (const update of depositsBigMapUpdates) {
        switch (update.action) {
          case BigMapUpdateActions.ADD_KEY: {
            const sizzler = new this._models.sizzler({
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
            await this._models.sizzler.findOneAndUpdate(
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

      await this._models.meta.findOneAndUpdate(
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
          id: this._config.withdrawals,
          firstLevel: firstLevel + 1,
          lastLevel,
        });
      for (const update of withdrawalsBigMapUpdates) {
        switch (update.action) {
          case BigMapUpdateActions.ADD_KEY:
          case BigMapUpdateActions.UPDATE_KEY: {
            await this._models.sizzler.findOneAndUpdate(
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

      await this._models.meta.findOneAndUpdate(
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
      const meta = await this._models.meta.findOne();
      const sizzlersBigMapLevels = await this._tzktProvider.getBigMapLevels(this._config.sizzlers);
      return [meta.sizzlerIndex.mainLastLevel, sizzlersBigMapLevels[1]];
    } catch (err) {
      throw err;
    }
  };

  private _getDepositsIndexingLevels = async (): Promise<[number, number]> => {
    try {
      const meta = await this._models.meta.findOne();
      const depositsBigMapLevels = await this._tzktProvider.getBigMapLevels(this._config.deposits);
      return [meta.sizzlerIndex.depositsLastLevel, depositsBigMapLevels[1]];
    } catch (err) {
      throw err;
    }
  };

  private _getWithdrawalsIndexingLevels = async (): Promise<[number, number]> => {
    try {
      const meta = await this._models.meta.findOne();
      const withdrawalsBigMapLevels = await this._tzktProvider.getBigMapLevels(
        this._config.withdrawals
      );
      return [meta.sizzlerIndex.withdrawalsLastLevel, withdrawalsBigMapLevels[1]];
    } catch (err) {
      throw err;
    }
  };
}
