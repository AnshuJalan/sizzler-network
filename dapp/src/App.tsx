import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Hooks
import { useActions } from "./hooks";

// Components and Pages
import Home from "./pages/Home";
import Bond from "./pages/Bond";
import Tasks from "./pages/Tasks";
import Logs from "./pages/Logs";
import NewTask from "./pages/NewTask";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Governance from "./pages/Governance";
import NewProposal from "./pages/NewProposal";

const App = () => {
  const { connectWallet, getStats } = useActions();

  useEffect(() => {
    connectWallet(false);
    getStats();
  }, [connectWallet, getStats]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-primary font-primary">
      <BrowserRouter>
        <Navbar />
        <Loader />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/new" element={<NewTask />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/governance/new" element={<NewProposal />} />
          <Route path="/bond" element={<Bond />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
