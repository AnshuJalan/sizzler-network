import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";

// Globals
import { network } from "./global";

export const wallet = new BeaconWallet({
  name: "Sizzler Network Dapp",
  // @ts-ignore - taquito NetworkType does not have Jakartanet reference
  preferredNetwork: network as NetworkType,
});
