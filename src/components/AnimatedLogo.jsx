import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const AnimatedLogo = () => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useGSAP(() => {
    const imgEl = imgRef.current;

    // Use a tiny timeout to ensure DOM is fully laid out before measuring
    setTimeout(() => {
      const heroEl = document.querySelector("#hero");
      
      // If we're not on the landing page, just render it normally in the navbar.
      if (!heroEl) {
        gsap.set(containerRef.current, { scale: 1, x: 0, y: 0, opacity: 1 });
        return;
      }

      // Initial calculation to center it
      const calculateOffset = () => {
        if (!imgEl) return { x: 0, y: 0 };
        const rect = imgEl.getBoundingClientRect();
        // Calculate how much we need to move it to center it on the screen
        const x = (window.innerWidth / 2) - (rect.left + rect.width / 2);
        const y = (window.innerHeight / 2) - (rect.top + rect.height / 2);
        return { x, y };
      };

      const offset = calculateOffset();

      // Set initial massive centered state
      // Scale 20 or higher means we zoom deeply into the center of the logo on the landing page
      gsap.set(containerRef.current, {
        x: offset.x,
        y: offset.y,
        scale: 15, // Zoomed in heavily for the landing page
      });

      // Animate to normal size (top left Navbar slot) on scroll down
      gsap.to(containerRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: heroEl, // The hero section
          start: "top top",
          end: "bottom top", // Ends when hero leaves viewport
          scrub: 1, // Smooth scrubbing
          invalidateOnRefresh: true, // Recalculates offsets on resize
        },
      });
    }, 50);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="z-[100] relative origin-center will-change-transform">
      <img
        ref={imgRef}
        src={`${import.meta.env.BASE_URL}img/logo.png`}
        alt="CYSCOM Logo"
        className="w-8 h-8 md:w-10 md:h-10 rounded-full"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default AnimatedLogo;
