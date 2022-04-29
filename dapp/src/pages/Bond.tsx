import { Tooltip } from "flowbite-react";

// Components
import Button from "../components/Button";

// Assets
import tQPLP from "../assets/tQPLP.png";
import SizzlerHat from "../assets/sizzler_hat.png";

const Bond = () => {
  return (
    <div className="bg-card mx-5 lg:mx-auto mt-44 lg:mt-36 lg:w-8/12 text-center \">
      <div className="flex flex-row gap-x-4 items-center justify-evenly bg-secondary p-8 text-white font-semibold">
        <img src={SizzlerHat} alt="sizzler hat" className="w-16 lg:w-20" />
        <div className="flex flex-col items-center text-center gap-y-3 cursor-pointer">
          <div className="text-sm lg:text-2xl">
            Bond LP tokens from Quipuswap's SZL-kUSD Pool to become a Sizzler.
          </div>
          <div className="border-white border-2 p-2">Learn More</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 font-medium p-6">
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">Min Bond Value</div>
          <div>1.5 tQPLP</div>
        </div>
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">Sizzlers</div>
          <div>56</div>
        </div>
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">Total Voting Power</div>
          <div>2,425</div>
        </div>
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">Your Bond Value</div>
          <div>12.4 tQPLP</div>
        </div>
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">
            Your Voting Power{" "}
            <Tooltip
              content="This is also the number of tasks available for you every 12 hours."
              className="rounded-t-none rounded-b-none"
            >
              <i className="bi bi-info-circle-fill text-base text-info cursor-pointer"></i>
            </Tooltip>
          </div>
          <div>8</div>
        </div>
        <div className="flex flex-col items-center gap-y-2 text-lg">
          <div className="text-label">Tasks Remaining</div>
          <div>6</div>
        </div>
      </div>
      <div className="bg-primary p-3 mx-5 mt-3 mb-8 lg:mx-10 font-medium">
        <i className="bi bi-info-circle-fill text-base text-info cursor-pointer"></i> Every stake of
        1.5 tQPLP tokens, gives you 1 voting power and 1 task limit every 12 hours. Deposits and
        withdrawals take 12 hours to confirm.
      </div>
      <div className="flex text-center justify-center gap-x-4 font-medium text">
        <div className="flex flex-col items-center gap-y-1">
          <span className="cursor-pointer">Deposit</span>
          <div className="h-0.5 w-1/2 bg-black"></div>
        </div>
        <div className="flex flex-col items-center">
          <span className="cursor-pointer opacity-60">Withdraw</span>
          {/* <div className="h-0.5 w-1/2 bg-black"></div> */}
        </div>
      </div>
      <div className="inline-flex flex-col md:flex-row items-center justify-between gap-x-3 gap-y-3 border-2 border-secondary p-4 mt-8">
        <div className="font-medium">You can confirm your deposit in: 8:34:11</div>
        <Button onClick={() => true}>
          <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
            <i className="bi bi-check-square" />
            Confirm Deposit
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center my-8 pb-8">
        <div className="flex items-center px-5 w-full md:w-3/4">
          <div className="flex items-center gap-x-2 p-2 bg-secondary bg-opacity-90">
            <img src={tQPLP} alt="tQPLP token" className="w-10" />
            <span className="text-white font-semibold hidden md:block">SZL/kUSD tQPLP</span>
          </div>
          <input
            className="p-2 flex-grow bg-primary font-medium placeholder-placeholder placeholder-opacity-40 focus:outline-none"
            placeholder="Enter tQPLP to deposit"
          />
        </div>
        <div className="text-secondary text-sm mt-1 mb-3 px-5">
          <i className="bi bi-exclamation-triangle"></i>
          You have a pending deposit confirmation. Confirm it before depositing more to prevent
          delays.
        </div>
        <Button onClick={() => true}>
          <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">Deposit</div>
        </Button>
      </div>
    </div>
  );
};

export default Bond;
