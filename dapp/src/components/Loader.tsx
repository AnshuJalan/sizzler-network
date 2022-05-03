// Hooks
import { useTypedSelector, useActions } from "../hooks";

// types
import { Status } from "../redux/actions/loader";

// Assets
import SizzlerHat from "../assets/sizzler_hat_orange.png";
import React from "react";

const Loader = () => {
  const { setLoader } = useActions();

  const { status, text } = useTypedSelector((state) => state.loader);

  if (status === Status.LOADING)
    return (
      <div className="fixed z-50 flex flex-col items-center justify-center gap-6 h-screen w-full bg-overlay bg-opacity-90">
        <img src={SizzlerHat} alt="sizzler hat" className="animate-wiggle w-24" />
        <div className="text-white font-semibold text-3xl">{text}</div>
      </div>
    );
  else if (status === Status.SUCCESS)
    return (
      <div className="fixed z-50 flex flex-col items-center justify-center gap-6 h-screen w-full bg-overlay bg-opacity-90">
        <div className="flex flex-col items-center bg-primary py-8 px-12">
          <i className="bi bi-check-circle-fill text-8xl text-secondary" />
          <div className="text-center font-medium text-2xl mt-8 text-black">{text}</div>
          <div
            onClick={() => setLoader(null)}
            className="mt-4 cursor-pointer font-secondary font-semibold text-sm text-navlink hover:text-black"
          >
            Go Back
          </div>
        </div>
      </div>
    );
  else if (status === Status.FAILURE)
    return (
      <div className="fixed z-50 flex flex-col items-center justify-center gap-6 h-screen w-full bg-overlay bg-opacity-90">
        <div className="flex flex-col items-center bg-primary py-8 px-12">
          <i className="bi bi-x-circle-fill text-8xl text-secondary" />
          <div className="text-center font-medium text-2xl mt-8 text-black">{text}</div>
          <div
            onClick={() => setLoader(null)}
            className="mt-4 cursor-pointer font-secondary font-semibold text-sm text-navlink hover:text-black"
          >
            Go Back
          </div>
        </div>
      </div>
    );

  return <React.Fragment></React.Fragment>;
};

export default Loader;
