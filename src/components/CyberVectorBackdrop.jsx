import { useEffect, useRef, useState } from "react";

const CyberVectorBackdrop = ({ vectorSrc = "/img/cyscomlogo_vector.svg" }) => {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    fetch(vectorSrc)
      .then((res) => res.text())
      .then((data) => {
        setSvgContent(data);
      })
      .catch((err) => console.warn("Failed to fetch vector backdrop:", err));
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
    </div>
  );
};

export default CyberVectorBackdrop;
