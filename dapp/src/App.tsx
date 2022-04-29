import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Hooks
import { useActions } from "./hooks";

// Components and Pages
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Logs from "./pages/Logs";
import Navbar from "./components/Navbar";
import NewTask from "./pages/NewTask";
import Governance from "./pages/Governance";
import NewProposal from "./pages/NewProposal";

const App = () => {
  const { connectWallet } = useActions();

  useEffect(() => {
    connectWallet(false);
  }, [connectWallet]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-primary font-primary">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/new" element={<NewTask />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/governance/new" element={<NewProposal />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
