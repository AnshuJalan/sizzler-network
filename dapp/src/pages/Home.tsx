const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center gap-y-20 relative">
      <div className="font-bold text-2xl sm:text-4xl w-3/4 md:w-1/2 text-center mt-44">
        Automate recurring tasks on Tezos by delegating it to S
        <span className="text-secondary">i</span>zzlers
      </div>
      <div className="z-10 bg-card py-8 px-12 mb-5 sm:mb-0 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6 sm:gap-y-10 font-medium text-xl">
          <div className="flex flex-col gap-y-4 items-center">
            <div className="text-gray-500">Active Tasks</div>
            <div>421</div>
          </div>
          <div className="flex flex-col gap-y-4 items-center">
            <div className="text-gray-500">Active Proposals</div>
            <div>12</div>
          </div>
          <div className="flex flex-col gap-y-4 items-center">
            <div className="text-gray-500">Sizzlers</div>
            <div>56</div>
          </div>
          <div className="flex flex-col gap-y-4 items-center">
            <div className="text-gray-500">SZL Supply</div>
            <div>56,600</div>
          </div>
          <div className="flex flex-col gap-y-4 items-center">
            <div className="text-gray-500">SZL Emission Rate</div>
            <div>5 SZL / min</div>
          </div>
          <div className="flex flex-col gap-y-4 items-center">
            <div className="text-gray-500">Min Bond Value</div>
            <div className="flex flex-col items-center gap-y-2">
              1.5 tQPLP
              <div className="bg-info text-white text-xs text-medium px-2 py-1 rounded-full">
                Quipuswap SZL-kUSD LP
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-secondary font-semibold mt-6">
          <span className="hover:opacity-80 cursor-pointer">
            Learn More <i className="bi bi-box-arrow-up-right" />
          </span>{" "}
        </div>
      </div>
      {/* Background */}
      <div style={{ top: "60%", height: "40%" }} className="absolute bg-secondary w-full"></div>
    </div>
  );
};

export default Home;
