import { useEffect, useRef, useState } from "react";

const CyberVectorBackdrop = ({ vectorSrc = "/img/cyscomlogo_vector.svg" }) => {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState("");
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check if device is low-end or mobile
    // Note: Web browsers do not expose "free" system memory for security/fingerprinting reasons.
    // navigator.deviceMemory only returns the *total* physical RAM category (e.g. 2, 4, 8).
    // To ensure they have ~4GB free, we require a system with at least 8GB of total RAM.
    const checkPerformance = () => {
      const isLowRam = navigator.deviceMemory && navigator.deviceMemory < 16;
      const isMobile = window.innerWidth < 768;
      
      if (isLowRam || isMobile) {
        setIsLowPerformance(true);
      } else {
        // Only fetch the heavy vector if we have good performance
        fetch(vectorSrc)
          .then((res) => res.text())
          .then((data) => {
            setSvgContent(data);
          })
          .catch((err) => console.warn("Failed to fetch vector backdrop:", err));
      }
    };

    checkPerformance();
    
    // Optional: re-check on resize in case they resize a desktop window to mobile size
    window.addEventListener('resize', checkPerformance);
    return () => window.removeEventListener('resize', checkPerformance);
  }, [vectorSrc]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
      style={{
        // Hardware accelerated glow effect (simplified to reduce repaint overhead)
        filter: "drop-shadow(0 0 20px rgba(10, 107, 255, 0.6))",
        mixBlendMode: "screen",
        opacity: 0.6,
        transform: "translate3d(0,0,0)",
        willChange: "transform"
      }}
    >
      {isLowPerformance ? (
        <img 
          src="/img/upscale.webp" 
          alt="CYSCOM Logo" 
          className="h-[60vh] w-auto max-w-[80vw] object-contain opacity-80"
        />
      ) : (
        <>
          <style>{`
            .cyber-svg-wrapper svg {
              height: 90vh !important;
              width: auto !important;
              max-width: 100vw;
              object-fit: contain;
            }
            
            /* CSS keyframes for drawing lines instead of GSAP loops */
            .cyber-svg-wrapper polyline,
            .cyber-svg-wrapper path,
            .cyber-svg-wrapper line {
              stroke-dasharray: 40 120;
              stroke-width: 4;
              animation: drawVectorLines 4s linear infinite;
            }

            @keyframes drawVectorLines {
              from {
                stroke-dashoffset: 0;
              }
              to {
                stroke-dashoffset: -160;
              }
            }
          `}</style>
          <div 
            className="cyber-svg-wrapper w-full h-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgContent }} 
          />
        </>
      )}
    </div>
  );
};

export default CyberVectorBackdrop;
