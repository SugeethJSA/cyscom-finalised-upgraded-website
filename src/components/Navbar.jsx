import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "./Button";

const navItems = ["Home", "Events", "Open Source", "Blogs", "Writeups", "Our Team"];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Manage audio playback
  useEffect(() => {
    if (audioElementRef.current) {
      if (isAudioPlaying) {
        audioElementRef.current.play();
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [isNavVisible]);

  const handleNavigate = (item) => {
    if (item === "Our Team") {
      navigate("/our-team");
      window.scrollTo(0, 0);
      return;
    }

    if (item === "Events") {
      navigate("/events");
      window.scrollTo(0, 0);
      return;
    }

    if (item === "Open Source") {
      navigate("/opensrc");
      window.scrollTo(0, 0);
      return;
    }

    if (item === "Blogs") {
      navigate("/blog");
      window.scrollTo(0, 0);
      return;
    }
    
    if (item === "Writeups") {
      navigate("/writeups");
      window.scrollTo(0, 0);
      return;
    }

    const targetId = item === "Home" ? "video-frame" : item.toLowerCase().replace(" ", "-");

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Product button */}
          <div className="flex items-center gap-4 md:gap-7">
            <img src="/img/logo.png" alt="logo" className="w-8 md:w-10 rounded-full" loading="lazy" decoding="async" fetchPriority="low" />

            <div className="hidden md:flex items-center gap-3">
              <Button
                id="product-button"
                title="Recruitments"
                rightIcon={<TiLocationArrow />}
                containerClass="bg-blue-50 flex items-center justify-center gap-1"
                onClick={() => navigate("/recruitments")}
              />
              {localStorage.getItem('participant_token') ? (
                <Button
                  id="profile-btn"
                  title="My Profile"
                  containerClass="bg-black/40 border border-blue-500/30 text-blue-50 flex items-center justify-center"
                  onClick={() => navigate("/profile")}
                />
              ) : (
                <Button
                  id="login-btn"
                  title="Login"
                  containerClass="bg-black/40 border border-blue-500/30 text-blue-50 flex items-center justify-center"
                  onClick={() => navigate("/login")}
                />
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 flex flex-col gap-1.5 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-blue-50 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-blue-50 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-blue-50 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Navigation Links and Audio Button */}
            <div className="hidden md:flex h-full items-center">
            <div className="md:flex md:items-center md:gap-1">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item === "Home" ? "hero" : item.toLowerCase().replace(" ", "-")}`}
                  className="nav-hover-btn scroll-smooth"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(item);
                  }}
                >
                  {item}
                </a>
              ))}
            </div>

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
                loop
                preload="none"
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>

        </nav>
      </header>
    </div>

    {/* Mobile Menu */}
    <div className={`md:hidden fixed inset-0 bg-black z-40 transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex flex-col items-center justify-start min-h-full pt-32 pb-8 px-6 text-center overflow-y-auto">
        
        {/* Quick Action Buttons */}
        <div className={`flex flex-col gap-3 w-full max-w-xs mb-8 transition-all duration-500 delay-100 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <Button
            id="mobile-product-button"
            title="Recruitments"
            rightIcon={<TiLocationArrow />}
            containerClass="!w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl text-xs"
            onClick={() => { setIsMobileMenuOpen(false); navigate("/recruitments"); }}
          />
          {localStorage.getItem('participant_token') ? (
            <Button
              id="mobile-profile-btn"
              title="My Profile"
              containerClass="!w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 py-3.5 rounded-xl text-xs"
              onClick={() => { setIsMobileMenuOpen(false); navigate("/profile"); }}
            />
          ) : (
            <Button
              id="mobile-login-btn"
              title="Login"
              containerClass="!w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 py-3.5 rounded-xl text-xs"
              onClick={() => { setIsMobileMenuOpen(false); navigate("/login"); }}
            />
          )}
        </div>

        <div className={`w-12 h-[1px] bg-zinc-800 mb-8 transition-all duration-500 delay-200 ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-6 items-center w-full">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={`#${item === "Home" ? "hero" : item.toLowerCase().replace(" ", "-")}`}
              className={`text-2xl font-black font-zentry uppercase tracking-widest text-zinc-300 hover:text-white transition-all transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: `${200 + index * 50}ms`, transitionDuration: '500ms' }}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                handleNavigate(item);
              }}
            >
              {item}
            </a>
          ))}
        </div>

        <div className={`w-12 h-[1px] bg-zinc-800 mt-8 mb-8 transition-all duration-500 delay-[500ms] ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudioIndicator}
          className={`flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 px-6 py-2.5 rounded-full uppercase text-[10px] font-bold tracking-widest text-zinc-400 transition-all duration-500 delay-[600ms] ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          Toggle Audio
          <div className="flex items-center space-x-0.5">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={clsx("indicator-line", {
                  active: isIndicatorActive,
                })}
                style={{
                  animationDelay: `${bar * 0.1}s`,
                }}
              />
            ))}
          </div>
        </button>
      </div>
    </div>
    </>
  );
};

export default NavBar;
