import React, { useState } from "react";
import { Tooltip } from "flowbite-react";
import { Spinner } from "flowbite-react";

// Components
import Button from "../components/Button";

// Hooks
import { useActions, useTypedSelector } from "../hooks";

// Types
import { Status } from "../redux/actions/loader";

// Operations
import { faucet } from "../operations/faucet";
import { deposit, confirmDeposit, withdraw, confirmWithdrawal } from "../operations/sizzler";

// Assets
import tQPLP from "../assets/tQPLP.png";
import SizzlerHat from "../assets/sizzler_hat.png";

// Local types
enum Error {
  DEPOSIT = "Invalid deposit amount",
  WITHDRAWAL = "Invalid withdrawal amount",
}

const Bond = () => {
  const [selected, setSelected] = useState<number>(0); // 0- deposit, 1- withdraw
  const [depositVal, setDepositVal] = useState<string>("");
  const [withdrawVal, setWithdrawVal] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);

  const { sizzler, isConnected } = useTypedSelector((state) => state.wallet);
  const { loading, sizzlerManager, taskManager } = useTypedSelector((state) => state.stats);
  const { setLoader } = useActions();

  // deposit operation
  const onDeposit = async () => {
    try {
      setError(null);

      if (Number.isNaN(parseFloat(depositVal)) || parseFloat(depositVal) === 0) {
        setError(Error.DEPOSIT);
        return;
      }

      setLoader(Status.LOADING, "Depositing...");

      await deposit(depositVal);

      setLoader(Status.SUCCESS, "Deposit successful!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  // deposit confirmation operation
  const onDepositConfirm = async () => {
    try {
      setLoader(Status.LOADING, "Confirming deposit...");

      await confirmDeposit();

      setLoader(Status.SUCCESS, "Deposit confirmed!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  // withdraw operation
  const onWithdraw = async () => {
    try {
      setError(null);

      if (Number.isNaN(parseFloat(withdrawVal)) || parseFloat(withdrawVal) === 0) {
        setError(Error.WITHDRAWAL);
        return;
      }

      setLoader(Status.LOADING, "Withdrawing...");

      await withdraw(withdrawVal);

      setLoader(Status.SUCCESS, "Withdrawal successful!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  // Withdrawal confirmation operation
  const onWithdrawalConfirm = async () => {
    try {
      setLoader(Status.LOADING, "Confirming withdrawal...");

      await confirmWithdrawal();

      setLoader(Status.SUCCESS, "Withdrawal confirmed!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  // On Faucet
  const onFaucet = async () => {
    try {
      setLoader(Status.LOADING, "Getting tQPLP tokens..");

      await faucet();

      setLoader(Status.SUCCESS, "5 tQPLP tokens received!");
    } catch (err: any) {
      setLoader(Status.FAILURE, err.message);
    }
  };

  const depositSection = (
    <React.Fragment>
      {/* Confirm deposit header */}
      {sizzler && sizzler.deposit && sizzler.deposit.amount !== "0" && (
        <div className="inline-flex flex-col md:flex-row items-center justify-between gap-x-3 gap-y-3 border-2 border-secondary p-4 mt-8">
          <div className="font-medium">
            You can confirm your deposit after:{" "}
            {new Date(sizzler.deposit.confirmationAt).toLocaleString()}
          </div>
          <Button
            disabled={new Date() < new Date(sizzler.deposit.confirmationAt)}
            onClick={onDepositConfirm}
          >
            <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
              <i className="bi bi-check-square" />
              Confirm Deposit
            </div>
          </Button>
        </div>
      )}
      {/* Deposit input */}
      <div className="inline-flex flex-col items-center my-8 mx-auto w-full md:w-8/12">
        <div className="flex items-center px-5 w-full">
          <div className="flex items-center gap-x-2 p-2 bg-secondary bg-opacity-90">
            <img src={tQPLP} alt="tQPLP token" className="w-10" />
            <span className="text-white font-semibold hidden md:block">SZL/kUSD tQPLP</span>
          </div>
          <input
            value={depositVal}
            type="number"
            onChange={(e) => setDepositVal(e.target.value)}
            className="p-2 flex-grow bg-primary font-medium placeholder-placeholder placeholder-opacity-40 border-none focus:ring-transparent"
            placeholder="Enter tQPLP to deposit"
          />
        </div>
        {error === Error.DEPOSIT && (
          <div className="text-secondary text-sm mt-1 px-5 self-start">
            <i className="bi bi-exclamation-triangle"></i>
            {Error.DEPOSIT}
          </div>
        )}
        {/* Confirmation delay warning */}
        {sizzler && sizzler.deposit && sizzler.deposit.amount !== "0" && (
          <div className="text-secondary text-sm mt-1 px-5 self-start">
            <i className="bi bi-exclamation-triangle"></i>
            You have a pending deposit confirmation. Confirm it before depositing more to prevent
            delays.
          </div>
        )}
        <div className="mt-3">
          <Button disabled={!isConnected} onClick={onDeposit}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
              Deposit
            </div>
          </Button>
        </div>
      </div>
    </React.Fragment>
  );

  const withdrawSection = (
    <React.Fragment>
      {/* Confirm withdrawal header */}
      {sizzler && sizzler.withdrawal && sizzler.withdrawal.amount !== "0" && (
        <div className="inline-flex flex-col md:flex-row items-center justify-between gap-x-3 gap-y-3 border-2 border-secondary p-4 mt-8">
          <div className="font-medium">
            You can confirm your withdrawal after:{" "}
            {new Date(sizzler.withdrawal.confirmationAt).toLocaleString()}
          </div>
          <Button
            disabled={new Date() < new Date(sizzler.withdrawal.confirmationAt)}
            onClick={onWithdrawalConfirm}
          >
            <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
              <i className="bi bi-check-square" />
              Confirm Withdrawal
            </div>
          </Button>
        </div>
      )}
      {/* Withdraw input */}
      <div className="inline-flex flex-col items-center my-8 mx-auto w-full md:w-8/12">
        <div className="flex items-center px-5 w-full">
          <div className="flex items-center gap-x-2 p-2 bg-secondary bg-opacity-90">
            <img src={tQPLP} alt="tQPLP token" className="w-10" />
            <span className="text-white font-semibold hidden md:block">SZL/kUSD tQPLP</span>
          </div>
          <input
            value={withdrawVal}
            type="number"
            onChange={(e) => setWithdrawVal(e.target.value)}
            className="p-2 flex-grow bg-primary font-medium placeholder-placeholder placeholder-opacity-40 border-none focus:ring-transparent"
            placeholder="Enter tQPLP to withdraw"
          />
        </div>
        {error === Error.WITHDRAWAL && (
          <div className="text-secondary text-sm mt-1 px-5 self-start">
            <i className="bi bi-exclamation-triangle"></i>
            {Error.WITHDRAWAL}
          </div>
        )}
        {/* Confirmation delay warning */}
        {sizzler && sizzler.withdrawal && sizzler.withdrawal.amount !== "0" && (
          <div className="text-secondary text-sm mt-1 px-5 self-start">
            <i className="bi bi-exclamation-triangle"></i>
            You have a pending withdrawal confirmation. Confirm it before withdrawing more to
            prevent delays.
          </div>
        )}
        <div className="mt-3">
          <Button disabled={!isConnected} onClick={onWithdraw}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
              Withdraw
            </div>
          </Button>
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <div className="bg-card mx-5 lg:mx-auto mt-44 mb-36 lg:mt-36 lg:w-8/12 text-center \">
      <div className="flex flex-row gap-x-4 items-center justify-evenly bg-secondary p-8 text-white font-semibold">
        <img src={SizzlerHat} alt="sizzler hat" className="w-16 lg:w-20" />
        <div className="flex flex-col items-center text-center gap-y-3">
          <div className="text-sm lg:text-2xl">
            Bond LP tokens from Quipuswap's SZL-kUSD Pool to become a Sizzler.
          </div>
          <a href="/technical_paper.pdf" target="_blank" rel="noreferrer">
            <div className="border-white border-2 p-2 cursor-pointer">Learn More</div>
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 font-medium p-6">
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">Min Bond Value</div>
          <div>
            {loading ? (
              <Spinner className="fill-secondary text-primary" />
            ) : (
              `${sizzlerManager.lpPerTask} tQPLP`
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">Sizzlers</div>
          <div>
            {loading ? (
              <Spinner className="fill-secondary text-primary" />
            ) : (
              sizzlerManager.sizzlers
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">Total Voting Power</div>
          <div>
            {loading ? (
              <Spinner className="fill-secondary text-primary" />
            ) : (
              taskManager.totalTasksLimit
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">Your Bond Value</div>
          <div>{sizzler && sizzler.stake ? `${sizzler.stake} tQPLP` : "-"}</div>
        </div>
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">
            Your Voting Power{" "}
            <Tooltip
              content="This is also the number of tasks available for you every 10 minutes."
              className="rounded-t-none rounded-b-none"
            >
              <i className="bi bi-info-circle-fill text-base text-info cursor-pointer"></i>
            </Tooltip>
          </div>
          <div>{sizzler && sizzler.taskLimit ? sizzler.taskLimit : "-"}</div>
        </div>
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">
            Tasks Remaining{" "}
            {sizzler && (
              <Tooltip
                content={`Resets every 10 minutes. Last reset at ${new Date(
                  sizzler.lastResetAt
                ).toLocaleString()}`}
                className="rounded-t-none rounded-b-none"
              >
                <i className="bi bi-info-circle-fill text-base text-info cursor-pointer"></i>
              </Tooltip>
            )}
          </div>
          <div>{sizzler && sizzler.taskLimit ? sizzler.taskLimit - sizzler.taskCounter : "-"} </div>
        </div>
      </div>
      <div className="bg-primary p-3 mx-5 mt-3 mb-8 lg:mx-10 font-medium">
        <i className="bi bi-info-circle-fill text-base text-info cursor-pointer"></i> Every stake of{" "}
        {sizzlerManager.lpPerTask} tQPLP token, gives you 1 voting power and 1 task limit every{" "}
        {sizzlerManager.resetPeriod} minutes. Deposits and withdrawals take{" "}
        {sizzlerManager.depositDelay} minutes to confirm.
      </div>
      <div className="flex text-center justify-center gap-x-4 font-medium text">
        <div onClick={() => setSelected(0)} className="flex flex-col items-center gap-y-1">
          <span className={`cursor-pointer ${selected !== 0 && "opacity-60"}`}>Deposit</span>
          {selected === 0 && <div className="h-0.5 w-1/2 bg-black"></div>}
        </div>
        <div onClick={() => setSelected(1)} className="flex flex-col items-center gap-y-1">
          <span className={`cursor-pointer ${selected !== 1 && "opacity-60"}`}>Withdraw</span>
          {selected === 1 && <div className="h-0.5 w-1/2 bg-black"></div>}
        </div>
      </div>
      {selected === 0 ? depositSection : withdrawSection}
      <div onClick={onFaucet} className="text-center text-secondary pb-8 px-5 ">
        {" "}
        <span className="hover:underline cursor-pointer">
          <i className="bi bi-info-circle" /> Click here to get 5 dummy tQPLP tokens on testnet
        </span>
      </div>
    </div>
  );
};

export default Bond;
