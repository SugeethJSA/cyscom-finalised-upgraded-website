import "./index.css";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import ScrollToTop from "./components/ScrollToTop";

import Writeups from "./components/Writeups";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [criticalAssetsLoaded, setCriticalAssetsLoaded] = useState(false);

  // Critical assets needed for initial render
  const criticalAssets = [
    { type: 'image', src: '/img/logo.png' },
  ];

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-black">
      <Routes>
        <Route path="/" element={<Writeups />} />
        <Route path="categories" element={<Writeups />} />
      </Routes>
      <ScrollToTop />
    </main>
  );
}

export default App;
