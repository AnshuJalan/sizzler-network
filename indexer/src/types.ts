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

export interface SizzlersBigMapUpdate {
  action: BigMapUpdateActions;
  content: {
    key: string;
    value: {
      stake: string;
      task_limit: string;
      task_counter: string;
      last_reset_at: string;
    };
  };
}

export interface DepositWithdrawalBigMapUpdate {
  action: BigMapUpdateActions;
  content: {
    key: string;
    value: {
      amount: string;
      confirmation_at: string;
    };
  };
}

export interface TaskCompletionOperation {
  hash: string;
  timestamp: string;
  sender: {
    address: string;
  };
  parameter: {
    value: string;
  };
}

export interface TaskOperationDetails {
  tip: number;
  sizzleMinted: number;
  fee: number;
}
