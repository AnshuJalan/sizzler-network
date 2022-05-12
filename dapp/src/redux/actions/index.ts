import { ConnectWalletAction } from "./wallet";
import { GetAllTasksAction } from "./tasks";
import { SetLoaderAction } from "./loader";
import { GetAllProposalsAction } from "./proposals";
import { GetAllLogsAction } from "./logs";
import { GetStatsAction } from "./stats";

export type WalletAction = ConnectWalletAction;
export type TasksAction = GetAllTasksAction;
export type LoaderAction = SetLoaderAction;
export type ProposalsAction = GetAllProposalsAction;
export type LogsAction = GetAllLogsAction;
export type StatsAction = GetStatsAction;
