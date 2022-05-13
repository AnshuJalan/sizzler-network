import { Config } from "./types";

export const config: Config = {
  // URLs
  tzktURL: process.env.TZKT_URL || "https://api.ithacanet.tzkt.io/v1",
  mongodbURL: process.env.MONGO_DB_URL || "mongodb://localhost:27017/sizzler-network",

  // Ports
  serverPort: process.env.PORT || "3001",

  // Bigmap IDs
  contractToTask: process.env.CONTRACT_TO_TASK || "77120",
  sizzlers: process.env.SIZZLERS || "77118",
  deposits: process.env.DEPOSITS || "77117",
  withdrawals: process.env.WITHDRAWALS || "77119",

  // Contracts
  taskManager: process.env.TASK_MANAGER || "KT1F8y2x8aBz3jmi3NbBsk7qibm3WQSYnVyZ",
  sizzlerManager: process.env.SIZZLER_MANAGER || "KT1PbPHZN59VGg1GCHGmPdfCXyWXSC7GohNu",
  sizzleToken: process.env.SIZZLE_TOKEN || "KT1E6Gg3tsWKaHgHTGGjjwWqqgoAJPkD6EHN",
  minter: process.env.MINTER || "KT1AAnVMaY6mkbLHa6KDq2T38V8mLADwAxay",
};
