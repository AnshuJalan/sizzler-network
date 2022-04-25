import { useEffect } from "react";

// Hooks
import { useActions } from "./hooks";

const App = () => {
  const { connectWallet } = useActions();

  useEffect(() => {
    connectWallet(false);
  }, [connectWallet]);

  return (
    <div onClick={() => connectWallet(true)} className="font-bold">
      Hello World!
    </div>
  );
};

export default App;
