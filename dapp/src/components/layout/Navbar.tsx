import { useState } from "react";
// import { useLocation } from "react-router-dom";

// Hooks
import { useActions, useTypedSelector } from "../../hooks";

// Components
import Button from "../button/Button";
import Badge from "../badge/Badge";

const navLinks = ["home", "tasks", "logs", "governance", "bond"];

const Navbar = () => {
  // const loc = useLocation();

  const { connectWallet } = useActions();

  const { accountPkh, isConnected } = useTypedSelector((state) => state.wallet);

  const [selected, setSelected] = useState<string>("home");

  return (
    <div className="grid grid-cols-12 px-5 py-4 relative">
      <div className="flex flex-row items-center font-bold col-span-2">
        <div className="flex flex-col items-center">
          <span className="text-3xl leading-6">
            S<span className="text-secondary">i</span>zzler
          </span>
          <span className="text-base">network</span>
        </div>
      </div>
      <div className="flex flex-row justify-center gap-x-7 text-lg col-span-8 text-navlink font-semibold">
        {navLinks.map((link: string, index) => {
          if (selected === link)
            return (
              <div key={index} className="flex items-center justify-center text-secondary relative">
                <span className="cursor-pointer hover:text-secondary">
                  {link[0].toUpperCase() + link.slice(1)}
                </span>
                <div className="absolute bottom-2.5 w-1/3 h-0.5 bg-secondary" />
              </div>
            );
          else
            return (
              <div
                key={index}
                onClick={() => setSelected(link)}
                className="flex items-center justify-center"
              >
                <span className="cursor-pointer hover:text-secondary">
                  {link[0].toUpperCase() + link.slice(1)}
                </span>
              </div>
            );
        })}
      </div>
      <div className="flex flex-row items-center justify-end w-full col-span-2">
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
      <div
        className={`flex flex-col items-end gap-y-2 absolute top-20 right-5 transition-transform duration-1000 transform ${
          isConnected ? "translate-x-0" : "translate-x-80"
        }`}
      >
        {selected === "home" && <Badge label="XTZ Balance" body="23.45 ꜩ" />}
        <Badge label="Sizzle Balance" body="101.65 SZL" />
        {(selected === "home" || selected === "bond") && (
          <Badge label="Quipuswap LP" body="1.34 tQPLP" />
        )}
      </div>
    </div>
  );
};

export default Navbar;
