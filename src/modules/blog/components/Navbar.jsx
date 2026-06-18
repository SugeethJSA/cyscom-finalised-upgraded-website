import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createPortal } from "react-dom";
import Button from "./Button";

const navItems = [
  { name: "Home", path: "/", isExternal: false },
  { name: "Main Site", path: "/", isExternal: false },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (audioElementRef.current) {
      if (isAudioPlaying) {
        audioElementRef.current.play().catch(err => console.log("Audio play deferred until user interaction"));
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (isMobileMenuOpen) return; // Prevent scroll hiding navbar when menu is open
    
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY, isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [isNavVisible]);

  const handleNavigate = (item) => {
    if (item.isExternal) {
      window.open(item.path, "_blank");
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              <Link to="/" className="flex items-center gap-2 cursor-target">
                <img src={`${import.meta.env.BASE_URL}img/logo.png`} alt="CYSCOM Logo" className="w-8 md:w-10 rounded-full border border-blue-500/20" />
                <span className="font-zentry text-xl tracking-wider text-white hidden sm:inline-block">CYSCOM <span className="text-blue-400">BLOG</span></span>
              </Link>

              <Button
                id="recruit-btn"
                title="Main Site"
                rightIcon={<TiLocationArrow />}
                containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1 cursor-target"
                onClick={() => navigate("/")}
              />
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              className="md:hidden z-50 flex flex-col gap-1.5 p-2 cursor-target"
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
                    href={item.path}
                    className="nav-hover-btn scroll-smooth cursor-target"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate(item);
                    }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Audio Toggle Button */}
              <button
                onClick={toggleAudioIndicator}
                className="ml-10 flex items-center space-x-0.5 cursor-target h-6 px-2"
                title="Toggle ambient background synth loop"
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
                      "--animation-order": bar,
                      animationDelay: `${bar * 0.1}s`,
                    }}
                  />
                ))}
              </button>
            </div>
          </nav>
        </header>
      </div>

      {/* Render Mobile Menu Drawer using React Portal directly under document.body to avoid parent layout warping */}
      {createPortal(
        <div className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-lg z-[9999] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-blue-400 text-3xl font-light cursor-target p-4"
            aria-label="Close Menu"
          >
            ✕
          </button>
          
          <div className="flex flex-col items-center justify-center h-screen gap-8 px-8 text-center">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="text-3xl font-zentry text-blue-50 hover:text-blue-300 transition-colors cursor-target"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  handleNavigate(item);
                }}
              >
                {item.name}
              </a>
            ))}
            
            <div className="h-px w-24 bg-white/20 my-2"></div>
            
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/");
              }}
              className="text-lg font-general text-blue-300 hover:text-white transition-colors cursor-target"
            >
              Visit Website
            </button>

            <button
              onClick={toggleAudioIndicator}
              className="mt-6 flex items-center space-x-1 cursor-target p-2 border border-white/10 rounded-full"
            >
              <span className="text-xs font-mono text-blue-50 mr-2">AMBIENT AUDIO</span>
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    "--animation-order": bar,
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default NavBar;
