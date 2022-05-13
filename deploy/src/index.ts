import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";

// Types and utlities
import { deploySZL, deployGovernor, deployManagers } from "./deploy";

const tezos = new TezosToolkit(`https://${process.argv[3]}.smartpy.io`);

tezos.setProvider({
  signer: new InMemorySigner(process.env.PRIVATE_KEY as string),
});

// Deployment segment choice
const deployChoice: number = parseInt(process.argv[2]);

// System admin before governor
const ADMIN = "tz1ZczbHu1iLWRa88n9CUiCKDGex5ticp19S";

// Deploy SZL
if (deployChoice == 1) {
  deploySZL({ tezos, admin: ADMIN });
}
// Deploy Managers
else if (deployChoice == 2) {
  const DECIMALS = 10 ** 18;
  const SIZZLE_LP_TOKEN = "KT1WpUCeyMJk1na7sPfDaiy8v6ZNh3TP5RWE";
  const SIZZLE_LP_TOKEN_ID = 0;
  const DEPOSIT_DELAY = 300; // 5 minutes
  const WITHDRAW_DELAY = 300;
  const LP_TOKENS_PER_TASK = 1.5 * 10 ** 6;
  const TASK_LIMIT_RESET_PERIOD = 120; // 2 minutes
  const DEV_ADDRESS = "tz1eUzpKnk5gKLYw4HWs2sWsynfbT7ypGxNM";
  const SIZZLER_RATE = [5 * DECIMALS, 60];
  const DEV_RATE = [1 * DECIMALS, 60];

  deployManagers({
    admin: ADMIN,
    tezos,
    sizzleLpToken: SIZZLE_LP_TOKEN,
    sizzleLpTokenID: SIZZLE_LP_TOKEN_ID,
    stakingParameters: {
      depositDelay: DEPOSIT_DELAY,
      withdrawalDelay: WITHDRAW_DELAY,
    },
    taskParameters: {
      lpTokensPerTask: LP_TOKENS_PER_TASK,
      taskLimitResetPeriod: TASK_LIMIT_RESET_PERIOD,
    },
    devAddress: DEV_ADDRESS,
    mintingRates: {
      sizzler: SIZZLER_RATE,
      dev: DEV_RATE,
    },
  });
} else if (deployChoice == 3) {
  const VOTING_PERIOD = 300; // 5 minutes
  const QUORUM_THRESHOLD = 5;
  const PROPOSAL_THRESHOLD = 1;
  const TIMELOCK_PERIOD = 300; // 5 minutes

  deployGovernor({
    tezos,
    governanceParameters: {
      votingPeriod: VOTING_PERIOD,
      quorumThreshold: QUORUM_THRESHOLD,
      proposalThreshold: PROPOSAL_THRESHOLD,
      timelockPeriod: TIMELOCK_PERIOD,
    },
  });
} else {
  console.log(">> Error: Invalid depoyment choice");
}
