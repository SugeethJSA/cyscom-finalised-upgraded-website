import "./index.css";
import { Routes, Route } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Locker from "./pages/Locker";
import HallOfFame from "./pages/HallOfFame";
import Legacy from "./pages/Legacy";
import Verify from "./pages/Verify";
import CertViewer from "./pages/CertViewer";

import { syncFromFirebase } from "./utils/firebaseSync";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Critical assets needed for initial render
  const criticalAssets = [
    { type: 'image', src: '/img/logo.png' }
  ];

  // Sync latest properties from remote Firebase Database on mount
  useEffect(() => {
    syncFromFirebase().catch((err) => {
      console.warn("Firebase startup sync bypassed or failed:", err);
    });
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-black text-blue-50 overflow-x-hidden">
      <div className="pt-24 min-h-[calc(100vh-80px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="locker" element={<Locker />} />
          <Route path="hall-of-fame" element={<HallOfFame />} />
          <Route path="legacy" element={<Legacy />} />
          <Route path="verify" element={<Verify />} />
          <Route path="cert-viewer" element={<CertViewer />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
