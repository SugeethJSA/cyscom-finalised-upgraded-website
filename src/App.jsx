import { Routes, Route } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Sponsors from "./components/PastEvents";
import ScrollToTop from "./components/ScrollToTop";
import { StickyScrollRevealDemo } from "./components/sticky_scroll";
import OurTeam from "./components/OurTeam";
import Preloader from "./components/Preloader";
import TargetCursor from "./ui/target";
import { Login } from "./pages/Auth/Login";
import { Signup } from "./pages/Auth/Signup";
import { Profile } from "./pages/Auth/Profile";

// Modules
import EventsApp from "./modules/events/App";
import OpenSrcApp from "./modules/opensrc/App";
import RecruitmentsApp from "./modules/recruitments/App";
import BlogApp from "./modules/blog/App";
import WriteupsApp from "./modules/writeups/App";

function MainSite() {
  return (
    <>
      <Hero />
      <About />
      <div className="relative">
        <Features />
        <Story />
        <StickyScrollRevealDemo />
        <Sponsors />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [criticalAssetsLoaded, setCriticalAssetsLoaded] = useState(false);

  // Critical assets needed for initial render (Hero + Navbar)
  const criticalAssets = [
    { type: 'video', src: `${import.meta.env.BASE_URL}videos/main.webm` },
    { type: 'image', src: `${import.meta.env.BASE_URL}img/hacked.webp` },
    { type: 'image', src: `${import.meta.env.BASE_URL}img/logo.png` },
  ];

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
    setCriticalAssetsLoaded(true);
  }, []);

  // Lazy load non-critical assets after initial render
  useEffect(() => {
    if (!criticalAssetsLoaded) return;
    
    const lazyAssets = [
      { type: 'image', src: `${import.meta.env.BASE_URL}img/newsletter.webp` },
      { type: 'video', src: `${import.meta.env.BASE_URL}videos/ctf.webm` },
      { type: 'video', src: `${import.meta.env.BASE_URL}videos/proj.webm` },
      { type: 'image', src: `${import.meta.env.BASE_URL}img/leaderboard2.webp` },
      { type: 'image', src: `${import.meta.env.BASE_URL}img/blogs.webp` },
      { type: 'image', src: `${import.meta.env.BASE_URL}img/fast.webp` },
      { type: 'image', src: `${import.meta.env.BASE_URL}img/mid.webp` },
      { type: 'image', src: `${import.meta.env.BASE_URL}img/intrusion.png` },
      { type: 'image', src: `${import.meta.env.BASE_URL}img/team018.jpg` },
      { type: 'image', src: `${import.meta.env.BASE_URL}img/contact-1.webp` },
      { type: 'image', src: `${import.meta.env.BASE_URL}img/contact-2.webp` },
      { type: 'image', src: `${import.meta.env.BASE_URL}img/swordman.webp` },
    ];
    
    const loadLazyAssets = async () => {
      for (const asset of lazyAssets) {
        if (asset.type === 'image') {
          const img = new Image();
          img.src = asset.src;
        } else if (asset.type === 'video') {
          const video = document.createElement('video');
          video.preload = 'auto';
          video.src = asset.src;
          video.load();
        }
      }
    };
    
    const timer = setTimeout(loadLazyAssets, 1000);
    return () => clearTimeout(timer);
  }, [criticalAssetsLoaded]);

  return (
    <main className="relative min-h-screen w-full">
      {isLoading ? (
        <Preloader assets={criticalAssets} onComplete={handlePreloaderComplete} />
      ) : (
        <>
          <TargetCursor targetSelector=".cursor-target, a, button, .nav-hover-btn" />
          <NavBar />
          <Routes>
            <Route path="/" element={<MainSite />} />
            <Route path="/our-team" element={<OurTeam />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Module Routes */}
            <Route path="/events/*" element={<EventsApp />} />
            <Route path="/opensrc/*" element={<OpenSrcApp />} />
            <Route path="/recruitments/*" element={<RecruitmentsApp />} />
            <Route path="/blog/*" element={<BlogApp />} />
            <Route path="/writeups/*" element={<WriteupsApp />} />
          </Routes>
          <ScrollToTop />
        </>
      )}
    </main>
  );
}

export default App;
