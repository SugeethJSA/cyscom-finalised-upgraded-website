import { useEffect, useRef } from "react";
import gsap from "gsap";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";

const Hero = ({ onExplore }) => {
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    // GSAP animations for hero entry
    const tl = gsap.timeline();
    
    tl.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );
    
    tl.fromTo(
      subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    );
  }, []);

  return (
    <section id="hero" className="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-black py-20 px-4 md:px-8">
      {/* Background Matrix/Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />
      
      {/* Radiant Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[80px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[90px] animate-pulse pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Hacker Code tag */}
        <div className="mb-6 px-3 py-1 rounded border border-blue-500/20 bg-blue-950/20 font-mono text-[10px] md:text-xs text-blue-400 uppercase tracking-[0.3em] animate-pulse">
          Node // CYSCOM.VITC.BLOG.v2
        </div>

        {/* Huge Animated Cyber Title */}
        <h1 
          ref={headingRef}
          className="hero-heading text-white select-none font-zentry leading-none tracking-tight flex flex-col items-center text-glow"
        >
          <span>CYBER</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            CHRONICLES
          </span>
        </h1>

        {/* Description & Typewriter subtitle */}
        <p 
          ref={subtitleRef}
          className="mt-6 max-w-xl text-sm md:text-base text-blue-100/70 font-mono tracking-wide leading-relaxed"
        >
          Exploring vulnerabilities, reverse engineering malware, and dissecting web security. Written by students of the <span className="text-blue-400">CyberSecurity Students' Community</span> at VIT Chennai.
        </p>

        {/* Buttons Row */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center items-center">
          <Button 
            title="Read Articles" 
            rightIcon={<TiLocationArrow />} 
            onClick={onExplore}
            containerClass="bg-blue-600 text-white cursor-target"
          />
          <a 
            href="/" 
            target="_blank" 
            rel="noreferrer"
            className="px-6 py-2 border border-blue-500/30 rounded-full text-xs uppercase font-semibold text-blue-50 hover:text-white hover:bg-blue-950/30 hover:border-blue-400 transition-all duration-300 cursor-target"
          >
            Visit VITC Club
          </a>
        </div>

      </div>

      {/* Animated Scroll Prompt */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer cursor-target opacity-75 hover:opacity-100 transition-opacity" onClick={onExplore}>
        <span className="text-[9px] font-mono text-blue-400/80 tracking-[0.3em] uppercase">SCROLL UPLINK</span>
        <div className="w-5 h-8 border border-blue-500/40 rounded-full p-1 flex justify-center">
          <div className="w-1 h-2 bg-blue-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
