import { ConnectWalletAction } from "./wallet";
import { GetAllTasksActions } from "./tasks";
import { SetLoaderAction } from "./loader";
import { GetAllProposals } from "./proposals";

export type WalletAction = ConnectWalletAction;
export type TasksAction = GetAllTasksActions;
export type LoaderAction = SetLoaderAction;
export type ProposalsAction = GetAllProposals;
