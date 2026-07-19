import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useProjects } from "./pages/Projects/useProjects";
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

// Flat Pages
const EventsHub = lazy(() => import("./pages/Events/EventsHub"));
const PublicRegister = lazy(() => import("./pages/Events/PublicRegister"));
const PublicTransfer = lazy(() => import("./pages/Events/PublicTransfer"));
const ProjectsHome = lazy(() => import("./pages/Projects/Home"));
const Leaderboard = lazy(() => import("./pages/Projects/Leaderboard"));
const ProjectShowcase = lazy(() => import("./pages/Projects/ProjectShowcase"));
const Recruitments = lazy(() => import("./pages/Recruitments/Recruitments"));
const Writeups = lazy(() => import("./pages/Writeups/components/Writeups"));

const BlogHome = lazy(() => import("./pages/Blog/BlogHome"));
const BlogPostDetail = lazy(() => import("./pages/Blog/BlogPostDetail"));

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
  useProjects();
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
    if (itemLabel === "Projects") {
      navigate("/projects");
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

  const navItems = ["Home", "About", "Events", "Projects", "Our Team", "Blogs", "Writeups"].map(label => ({
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
            logoSrc="/img/logo.webp"
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
              
              {/* Flat Page Routes */}
              {/* Events */}
              <Route path="/events" element={<EventsHub />} />
              <Route path="/events/:slug/register" element={<PublicRegister />} />
              <Route path="/events/:slug/transfer" element={<PublicTransfer />} />
              
              {/* Projects */}
              <Route path="/projects" element={<ProjectsHome />} />
              <Route path="/projects/leaderboard" element={<Leaderboard />} />
              <Route path="/projects/showcase" element={<ProjectShowcase />} />
              
              {/* Recruitments & Writeups */}
              <Route path="/recruitments/*" element={<Recruitments />} />
              <Route path="/writeups/*" element={<Writeups />} />
              
              <Route path="/blog" element={<BlogHome />} />
              <Route path="/blog/post/:id" element={<BlogPostDetail />} />
            </Routes>
          </Suspense>
          <ScrollToTop />
        </>
      )}
    </main>
  );
}

export default App;
