import { ConnectWalletAction } from "./wallet";
import { GetAllTasksActions } from "./tasks";
import { SetLoaderAction } from "./loader";

export type WalletAction = ConnectWalletAction;
export type TasksAction = GetAllTasksActions;
export type LoaderAction = SetLoaderAction;
