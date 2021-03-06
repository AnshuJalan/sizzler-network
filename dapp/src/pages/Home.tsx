import { Spinner } from "flowbite-react";

// Hooks
import { useTypedSelector } from "../hooks";

// Assets
import Design from "../assets/design.png";

const Home = () => {
  const { isConnected } = useTypedSelector((state) => state.wallet);

  const { loading, taskManager, sizzlerManager, minter, sizzle } = useTypedSelector(
    (state) => state.stats
  );

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center gap-y-16 sm:gap-y-20 relative">
        <div
          className={`font-bold text-2xl sm:text-4xl w-10/12 md:w-1/2 text-center ${
            isConnected ? "mt-48 sm:mt-44 3xl:mt-64" : "mt-44 3xl:mt-64"
          }`}
        >
          Automate recurring smart contract tasks on Tezos by delegating them to S
          <span className="text-secondary">i</span>zzler Network
        </div>
        <div className="z-10 bg-card py-8 px-12 mb-5 sm:mb-0 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6 sm:gap-y-10 font-medium text-xl">
            <div className="flex flex-col gap-y-4 items-center">
              <div className="text-label">Active Tasks</div>
              <div>
                {loading ? (
                  <Spinner className="fill-secondary text-primary" />
                ) : (
                  taskManager.activeTasks
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-4 items-center">
              <div className="text-label">Total Tasks Limit</div>
              <div>
                {loading ? (
                  <Spinner className="fill-secondary text-primary" />
                ) : (
                  taskManager.totalTasksLimit
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-4 items-center">
              <div className="text-label">Sizzlers</div>
              <div>
                {loading ? (
                  <Spinner className="fill-secondary text-primary" />
                ) : (
                  sizzlerManager.sizzlers
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-4 items-center">
              <div className="text-label">SZL Supply</div>
              <div>
                {loading ? (
                  <Spinner className="fill-secondary text-primary" />
                ) : (
                  `${sizzle.totalSupply} SZL`
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-4 items-center">
              <div className="text-label">SZL Emission Rate</div>
              <div>
                {loading ? (
                  <Spinner className="fill-secondary text-primary" />
                ) : (
                  `${minter.emissionRate} SZL / min`
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-4 items-center">
              <div className="text-label">Min Bond Value</div>
              <div className="flex flex-col items-center gap-y-2">
                {loading ? (
                  <Spinner className="fill-secondary text-primary" />
                ) : (
                  `${sizzlerManager.lpPerTask} tQPLP`
                )}
                <div className="bg-info text-white text-xs text-medium px-2 py-1 rounded-full">
                  Quipuswap SZL-kUSD LP
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-secondary font-semibold mt-6">
            <a href="/technical_paper.pdf" target="_blank" rel="noreferrer">
              <span className="hover:opacity-80 cursor-pointer">
                Learn More <i className="bi bi-box-arrow-up-right" />
              </span>{" "}
            </a>
          </div>
        </div>
        {/* Background */}
        <div style={{ top: "60%", height: "40%" }} className="absolute bg-secondary w-full"></div>
      </div>
      <div className="flex flex-col items-center gap-y-16 py-16 px-5">
        <div className="font-bold text-3xl">
          How does it w<span className="text-secondary">o</span>rk?
        </div>
        <img src={Design} alt="design" className="w-full md:w-1/2" />
      </div>
    </div>
  );
};

export default Home;
