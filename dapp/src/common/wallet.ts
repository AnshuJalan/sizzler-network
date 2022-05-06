import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";
import { TezosToolkit } from "@taquito/taquito";

// Globals
import { network, rpcNode } from "./global";

// Beacon Wallet instance
export const wallet = new BeaconWallet({
  name: "Sizzler Network Dapp",
  preferredNetwork: network as NetworkType,
});

// Tezos instance
export const tezos = new TezosToolkit(rpcNode);
tezos.setWalletProvider(wallet);
