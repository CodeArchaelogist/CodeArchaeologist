import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import RepositoryInput from "./pages/RepositoryInput.jsx";
import Investigation from "./pages/Investigation.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RepositoryDNA from "./pages/RepositoryDNA.jsx";
import EvolutionTimeline from "./pages/EvolutionTimeline.jsx";
import DecisionForensics from "./pages/DecisionForensics.jsx";
import RiskImpact from "./pages/RiskImpact.jsx";
import AskArchaeologist from "./pages/AskArchaelogist.jsx";
import DeepScanBackground from "./components/DeepScanBackground.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <>
      <DeepScanBackground />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/analyze" element={<RepositoryInput />} />
        <Route path="/investigation/:id" element={<Investigation />} />

        <Route path="/dashboard/:id" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/repository-dna/:id" element={<DashboardLayout />}>
          <Route index element={<RepositoryDNA />} />
        </Route>
        <Route path="/timeline/:id" element={<DashboardLayout />}>
          <Route index element={<EvolutionTimeline />} />
        </Route>
        <Route path="/decisions/:id" element={<DashboardLayout />}>
          <Route index element={<DecisionForensics />} />
        </Route>
        <Route path="/risks/:id" element={<DashboardLayout />}>
          <Route index element={<RiskImpact />} />
        </Route>
        <Route path="/ask/:id" element={<DashboardLayout />}>
          <Route index element={<AskArchaeologist />} />
        </Route>
        <Route path="/login" element={<Login />}>
        </Route>
        <Route path="/signup" element={<Signup />}>
        </Route>
        <Route path="/profile" element={<DashboardLayout />}>
          <Route index element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}