import { Config } from "./types";

export const config: Config = {
  // URLs
  tzktURL: "https://api.ithacanet.tzkt.io/v1",
  mongodbURL: "mongodb://localhost:27017/sizzler-network",

  // Bigmap IDs
  contractToTask: "66360",
  sizzlers: "66358",
  deposits: "66357",
  withdrawals: "66359",

  // Contracts
  taskManager: "KT1STHzVN5ixVVgZBdVNxButWdEDu6Jdj9hN",
  sizzlerManager: "KT1HzYUXzhmFq6Lwp7QE53WW3HGtEenzTaGE",
  sizzleToken: "KT1EAtFSR9jGP9oK7Nm6hXg4Xpmz4iXMXPFx",
  minter: "KT199pA4ePzYwLkJ3SsJK5pbB5Mn5gamMW8D",
};
