export interface GetOperationByContractOptions {
  contract: string;
  entrypoint: string;
  firstLevel: number;
  lastLevel: number;
}

export interface GetBigMapUpdatesOptions {
  id: string;
  firstLevel: number;
  lastLevel: number;
}

export enum BigMapUpdateActions {
  ADD_KEY = "add_key",
  UPDATE_KEY = "update_key",
  REMOVE_KEY = "remove_key",
}

export interface ContractToTaskBigMapUpdate {
  action: BigMapUpdateActions;
  content: {
    key: string;
    value: {
      tip: string;
      owner: string;
      credits: string;
      metadata: string;
      entrypoint: string;
    };
  };
}
