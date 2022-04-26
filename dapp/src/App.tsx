import { useEffect } from "react";
// import { Router } from "react-router-dom";

// Hooks
import { useActions } from "./hooks";

// Temp
import Navbar from "./components/layout/Navbar";

const App = () => {
  const { connectWallet } = useActions();

  useEffect(() => {
    connectWallet(false);
  }, [connectWallet]);

  return (
    <div className="h-full w-full overflow-x-hidden bg-primary font-primary">
      <Navbar />
    </div>
  );
};

export default App;
