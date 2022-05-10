import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Hooks
import { useActions, useTypedSelector } from "../hooks";

// Components
import Button from "./Button";
import Badge from "./Badge";

// Local constants
const NAVLINKS = ["home", "tasks", "logs", "governance", "bond"];

const Navbar = () => {
  const path = useLocation().pathname;

  const [hasShadow, setHasShadow] = useState<boolean>();

  const { connectWallet } = useActions();

  const { accountPkh, sizzleBalance, lpBalance, isConnected } = useTypedSelector(
    (state) => state.wallet
  );

  const navlinkSegment = NAVLINKS.map((link: string, index) => {
    if (path.includes(link))
      return (
        <Link
          key={index}
          to={"/" + link}
          className="flex flex-col items-center text-secondary relative font-bold"
        >
          <span className="cursor-pointer">{link[0].toUpperCase() + link.slice(1)}</span>
          <div className="absolute bottom-0 w-1/3 h-0.5 bg-secondary" />
        </Link>
      );
    else
      return (
        <Link
          key={index}
          to={"/" + link}
          className="flex items-center justify-center opacity-90 font-semibold"
        >
          <span className="cursor-pointer hover:text-secondary">
            {link[0].toUpperCase() + link.slice(1)}
          </span>
        </Link>
      );
  });

  // Navbar scroll shadow utility
  const toggleNavbarShadow = useCallback(() => {
    if (window.scrollY > 0) {
      setHasShadow(true);
    } else {
      setHasShadow(false);
    }
  }, []);
  window.addEventListener("scroll", toggleNavbarShadow);

  return (
    <div className={`fixed z-20 w-full bg-primary ${hasShadow && "md:shadow-md"}`}>
      <div className="flex flex-row items-center justify-between px-5 py-4">
        {/* Brand */}
        <Link to="/">
          <img src="/assets/brand.png" alt="brand" className="w-24" />
        </Link>
        {/* Navlinks */}
        <div className="hidden md:flex flex-row justify-center gap-x-7 text-lg text-navlink">
          {navlinkSegment}
        </div>
        {/* Connect Wallet button */}
        <div className="flex flex-row items-center justify-end">
          <Button onClick={() => connectWallet(true)}>
            <div className="flex items-center justify-center gap-x-3 px-3 py-2 text-sm">
              <i className="bi bi-wallet" />
              <span>
                {isConnected
                  ? `${accountPkh.slice(0, 8)}...${accountPkh.slice(-5)}`
                  : "Connect Wallet"}
              </span>
            </div>
          </Button>
        </div>
        {/* Balance badges */}
        <div
          className={`hidden md:flex flex-col items-end gap-y-2 absolute top-20 right-5 transition-transform duration-1000 transform ${
            isConnected ? "translate-x-0" : "translate-x-80"
          } ${hasShadow ? "translate-y-4" : "translate-y-0"}`}
        >
          <Badge label="Sizzle Balance" body={`${sizzleBalance} SZL`} />
          <Badge label="Quipuswap LP" body={`${lpBalance} tQPLP`} />
        </div>
      </div>
      {/* Navlinks positioning for mobile screens */}
      <div
        className={`flex md:hidden flex-row justify-between text-lg text-navlink px-5 pb-4 ${
          !isConnected && "shadow-md"
        }`}
      >
        {navlinkSegment}
      </div>
      {/* Balance badges positioning for mobile screens */}
      {isConnected && (
        <div className="flex md:hidden justify-evenly px-5 pb-4 shadow-md">
          <Badge label="Sizzle Balance" body={`${sizzleBalance} SZL`} />
          <Badge label="Quipuswap LP" body={`${lpBalance} tQPLP`} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
