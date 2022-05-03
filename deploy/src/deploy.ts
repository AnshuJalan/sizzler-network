import fs from "fs";
import { OpKind, TezosToolkit, ParamsWithKind } from "@taquito/taquito";

import * as contractUtils from "./utils/contract";
import deployedAddresses from "./deployedAddresses.json";

export interface DeploySZLParams {
  tezos: TezosToolkit;
  admin: string;
}

export const deploySZL = async (params: DeploySZLParams): Promise<void> => {
  try {
    console.log("------------------------------------------------");
    console.log(` Deploying Sizzer Network's SZL FA1.2 Contract`);
    console.log("------------------------------------------------");

    // Prepare storage and contract for SZL FA1.2
    const szlStorage = `(Pair (Pair "${params.admin}" (Pair {} {Elt "" 0x697066733a2f2f64756d6d79})) (Pair None (Pair {Elt 0 (Pair 0 {Elt "decimals" 0x3138; Elt "icon" 0x697066733a2f2f64756d6d79; Elt "name" 0x53697a7a6c65; Elt "symbol" 0x535a4c})} 0)))`;
    const szlContract = contractUtils.loadContract("szl_fa12");

    // Deploy SZL FA1.2
    console.log("\n>> [1 / 1] Deploying SZL FA1.2");
    const szlAddress = await contractUtils.deployContract(szlContract, szlStorage, params.tezos);
    console.log(">>> SZL FA1.2 address: ", szlAddress);

    // Set deployment address
    deployedAddresses.SZL = szlAddress;

    fs.writeFile(
      `${__dirname}/deployedAddresses.json`,
      JSON.stringify(deployedAddresses),
      () => {}
    );

    console.log("\n-------------------------");
    console.log(` Deployment Completed`);
    console.log("-------------------------");
  } catch (err) {
    console.log(">> Error: ", err.message);
  }
};

export interface DeployManagersParams {
  // generic
  admin: string;
  tezos: TezosToolkit;

  // Sizzler Manager
  sizzleLpToken: string;
  sizzleLpTokenID: number;
  stakingParameters: {
    depositDelay: number;
    withdrawalDelay: number;
  };
  taskParameters: {
    lpTokensPerTask: number;
    taskLimitResetPeriod: number;
  };

  // Minter
  devAddress: string;
  mintingRates: {
    sizzler: number[];
    dev: number[];
  };
}

export const deployManagers = async (params: DeployManagersParams): Promise<void> => {
  try {
    console.log("------------------------------------------------");
    console.log(` Deploying Sizzer Network's Manager Contracts`);
    console.log("------------------------------------------------");

    // Prepare storage and contract for Sizzler Manager
    const sizzlerManagerStorage = `(Pair (Pair (Pair {} "${params.admin}") (Pair (Pair "${params.sizzleLpToken}" ${params.sizzleLpTokenID}) {})) (Pair (Pair (Pair ${params.stakingParameters.depositDelay} ${params.stakingParameters.withdrawalDelay}) "tz1RBkXZSiQb3fS7Sg3zbFdPMBFPJUNHdcFo") (Pair (Pair ${params.taskParameters.lpTokensPerTask} ${params.taskParameters.taskLimitResetPeriod}) {})))`;
    const sizzlerManagerContract = contractUtils.loadContract("sizzler_manager");

    // Deploy Sizzler Manager
    console.log("\n>> [1 / 4] Deploying Sizzler Manager");
    const sizzlerManagerAddress = await contractUtils.deployContract(
      sizzlerManagerContract,
      sizzlerManagerStorage,
      params.tezos
    );
    console.log(">>> Sizzler Manager address: ", sizzlerManagerAddress);

    // Prepare storage and contract for Task Manager
    const taskManagerStorage = `(Pair (Pair {} "${params.admin}") (Pair "tz1RBkXZSiQb3fS7Sg3zbFdPMBFPJUNHdcFo" (Pair "${deployedAddresses.SZL}" "${sizzlerManagerAddress}")))`;
    const taskManagerContract = contractUtils.loadContract("task_manager");

    // Deploy Task Manager
    console.log("\n>> [2 / 4] Deploying Task Manager");
    const taskManagerAddress = await contractUtils.deployContract(
      taskManagerContract,
      taskManagerStorage,
      params.tezos
    );
    console.log(">>> Task Manager address: ", taskManagerAddress);

    // Prepare storage and contract for Minter
    const minterStorage = `(Pair (Pair "${params.devAddress}" (Pair "${
      params.admin
    }" (Pair "${new Date().toISOString()}" "${new Date().toISOString()}"))) (Pair (Pair (Pair ${
      params.mintingRates.sizzler[0]
    } ${params.mintingRates.sizzler[1]}) (Pair ${params.mintingRates.dev[0]} ${
      params.mintingRates.dev[1]
    })) (Pair "${deployedAddresses.SZL}" "${taskManagerAddress}")))`;
    const minterContract = contractUtils.loadContract("minter");

    // Deploy Minter
    console.log("\n>> [3 / 4] Deploying Minter");
    const minterAddress = await contractUtils.deployContract(
      minterContract,
      minterStorage,
      params.tezos
    );
    console.log(">>> Minter address: ", minterAddress);

    // Set addresses
    deployedAddresses.TASK_MANAGER = taskManagerAddress;
    deployedAddresses.SIZZLER_MANAGER = sizzlerManagerAddress;
    deployedAddresses.MINTER = minterAddress;

    fs.writeFile(
      `${__dirname}/deployedAddresses.json`,
      JSON.stringify(deployedAddresses),
      () => {}
    );

    // Contract instances
    const smInstance = await params.tezos.contract.at(sizzlerManagerAddress);
    const tmInstance = await params.tezos.contract.at(taskManagerAddress);
    const sizzleInstance = await params.tezos.contract.at(deployedAddresses.SZL);

    const opList: ParamsWithKind[] = [
      {
        kind: OpKind.TRANSACTION,
        ...smInstance.methods.update_task_manager(taskManagerAddress).toTransferParams(),
      },
      {
        kind: OpKind.TRANSACTION,
        ...tmInstance.methods.update_minter(minterAddress).toTransferParams(),
      },
      {
        kind: OpKind.TRANSACTION,
        ...sizzleInstance.methods.updateMintAdmin(minterAddress).toTransferParams(),
      },
    ];

    console.log("\n>> [4 / 4] Updating addresses for inter-contract calls");

    const batch = params.tezos.contract.batch(opList);
    const op = await batch.send();
    await op.confirmation(1);

    console.log(">>> Operation Hash: ", op.hash);

    console.log("\n-------------------------");
    console.log(` Deployment Completed`);
    console.log("-------------------------");
  } catch (err) {
    console.log(">> Error: ", err.message);
  }
};

export interface DeployGovernorParams {
  tezos: TezosToolkit;
  governanceParameters: {
    votingPeriod: number;
    quorumThreshold: number;
    proposalThreshold: number;
    timelockPeriod: number;
  };
}

export const deployGovernor = async (params: DeployGovernorParams): Promise<void> => {
  try {
    console.log("------------------------------------------------");
    console.log(` Deploying Sizzer Network's Governor Contract`);
    console.log("------------------------------------------------");

    // Prepare storage and contract for Governor
    const governorStorage = `(Pair (Pair (Pair ${params.governanceParameters.votingPeriod} (Pair ${params.governanceParameters.quorumThreshold} (Pair ${params.governanceParameters.proposalThreshold} ${params.governanceParameters.timelockPeriod}))) {}) (Pair "${deployedAddresses.SIZZLER_MANAGER}" 0))`;
    const governorContract = contractUtils.loadContract("governor");

    // Deploy Governor
    console.log("\n>> [1 / 2] Deploying Governor");
    const governorAddress = await contractUtils.deployContract(
      governorContract,
      governorStorage,
      params.tezos
    );
    console.log(">>> Governor address: ", governorAddress);

    // Set address
    deployedAddresses.GOVERNOR = governorAddress;

    fs.writeFile(
      `${__dirname}/deployedAddresses.json`,
      JSON.stringify(deployedAddresses),
      () => {}
    );

    const smInstance = await params.tezos.contract.at(deployedAddresses.SIZZLER_MANAGER);
    const tmInstance = await params.tezos.contract.at(deployedAddresses.TASK_MANAGER);
    const sizzleInstance = await params.tezos.contract.at(deployedAddresses.SZL);
    const minterInstance = await params.tezos.contract.at(deployedAddresses.MINTER);

    const opList: ParamsWithKind[] = [
      {
        kind: OpKind.TRANSACTION,
        ...smInstance.methods.update_governor(governorAddress).toTransferParams(),
      },
      {
        kind: OpKind.TRANSACTION,
        ...tmInstance.methods.update_governor(governorAddress).toTransferParams(),
      },
      {
        kind: OpKind.TRANSACTION,
        ...minterInstance.methods.update_governor(governorAddress).toTransferParams(),
      },
      {
        kind: OpKind.TRANSACTION,
        ...sizzleInstance.methods.setAdministrator(governorAddress).toTransferParams(),
      },
    ];

    console.log("\n>> [2 / 2] Updating addresses for inter-contract calls");

    const batch = params.tezos.contract.batch(opList);
    const op = await batch.send();
    await op.confirmation(1);

    console.log(">>> Operation Hash: ", op.hash);

    console.log("\n-------------------------");
    console.log(` Deployment Completed`);
    console.log("-------------------------");
  } catch (err) {
    console.log(">> Error: ", err.message);
  }
};
