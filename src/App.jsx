import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { TiLocationArrow } from "react-icons/ti";
import About from "./components/About";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Sponsors from "./components/PastEvents";
import ScrollToTop from "./components/ScrollToTop";
import { StickyScrollRevealDemo } from "./components/sticky_scroll";
import { Navbar as NavBar, Preloader } from "@cyscomvit/cyscomui";
import TargetCursor from "./components/TargetCursor";

const OurTeam = lazy(() => import("./components/OurTeam"));
const Login = lazy(() => import("./pages/Auth/Login").then(module => ({ default: module.Login })));
const Signup = lazy(() => import("./pages/Auth/Signup").then(module => ({ default: module.Signup })));
const Profile = lazy(() => import("./pages/Auth/Profile").then(module => ({ default: module.Profile })));

// Modules
const EventsApp = lazy(() => import("./modules/events/App"));
const OpenSrcApp = lazy(() => import("./modules/opensrc/App"));
const RecruitmentsApp = lazy(() => import("./modules/recruitments/App"));
const BlogApp = lazy(() => import("./modules/blog/App"));
const WriteupsApp = lazy(() => import("./modules/writeups/App"));

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

const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-black">
    <div className="three-body">
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
    </div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [criticalAssetsLoaded, setCriticalAssetsLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (itemLabel) => {
    if (itemLabel === "Our Team") {
      navigate("/our-team");
      window.scrollTo(0, 0);
      return;
    }
    if (itemLabel === "Events") {
      navigate("/events");
      window.scrollTo(0, 0);
      return;
    }
    if (itemLabel === "Open Source") {
      navigate("/opensrc");
      window.scrollTo(0, 0);
      return;
    }
    if (itemLabel === "Blogs") {
      navigate("/blog");
      window.scrollTo(0, 0);
      return;
    }
    if (itemLabel === "Writeups") {
      navigate("/writeups");
      window.scrollTo(0, 0);
      return;
    }

    const targetId = itemLabel === "Home" ? "hero" : itemLabel.toLowerCase().replace(" ", "-");

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navItems = ["Home", "About", "Events", "Open Source", "Our Team", "Blogs", "Writeups"].map(label => ({
    label,
    url: `#${label === "Home" ? "hero" : label.toLowerCase().replace(" ", "-")}`,
    onClick: () => handleNavigate(label)
  }));

  const actionButtons = [
    {
      id: "product-button",
      label: "Recruitments",
      icon: <TiLocationArrow />,
      containerClass: "bg-blue-50 flex items-center justify-center gap-1",
      onClick: () => navigate("/recruitments")
    }
  ];

  // Critical assets needed for initial render (Hero + Navbar)
  const criticalAssets = [
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
          <NavBar 
            logoSrc="/img/logo.png"
            navItems={navItems}
            actionButtons={actionButtons}
            audioSrc="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
            onLogoClick={() => handleNavigate("Home")}
          />
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
          <ScrollToTop />
        </>
      )}
    </main>
  );
}

export default App;
