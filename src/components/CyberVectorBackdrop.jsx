import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CyberVectorBackdrop = () => {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState("");

  // Fetch the SVG file content so we can inject and animate it
  useEffect(() => {
    fetch("/img/cyscomlogo_vector.svg")
      .then((res) => res.text())
      .then((data) => {
        setSvgContent(data);
      });
  }, []);

  useEffect(() => {
    if (svgContent && containerRef.current) {
      // Use a slight timeout to ensure React has finished injecting the raw HTML
      setTimeout(() => {
        const lines = containerRef.current.querySelectorAll("polyline, path, line");
        
        // Cyber glow and data-stream stroke animation
        gsap.set(lines, {
          strokeDasharray: "40 120", // Creates "data packets"
          strokeDashoffset: 0,
          strokeWidth: 4,
        });

        // Animate the data packets flowing through the logo
        gsap.to(lines, {
          strokeDashoffset: -160,
          duration: 3,
          ease: "none", // linear
          repeat: -1,
        });
      }, 50);
      
      // Slow ambient pulse for the entire background
      gsap.to(containerRef.current, {
        opacity: 0.8,
        scale: 1.02,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }, [svgContent]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
      style={{
        filter: "drop-shadow(0 0 20px rgba(10, 107, 255, 0.6))",
        mixBlendMode: "screen",
        opacity: 0.5 // Start with a subtle opacity
      }}
    >
      <style>{`
        .cyber-svg-wrapper svg {
          height: 90vh !important;
          width: auto !important;
          max-width: 100vw;
          object-fit: contain;
        }
      `}</style>
      <div 
        className="cyber-svg-wrapper w-full h-full flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: svgContent }} 
      />
    </div>
  );
};

export default CyberVectorBackdrop;
