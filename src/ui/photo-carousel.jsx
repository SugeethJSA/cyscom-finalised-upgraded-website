"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";

export const PhotoCarousel = ({
  content,
  gridCols = 3,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  // Auto-advance timer
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % content.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering, content.length]);

  const handlePrevious = () => {
    setActiveIndex(prev => (prev - 1 + content.length) % content.length);
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % content.length);
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  // Calculate visible photos for grid (show 3 at a time, with active in center)
  const getVisibleIndices = () => {
    const indices = [];
    for (let i = 0; i < gridCols; i++) {
      const offset = i - Math.floor(gridCols / 2);
      indices.push((activeIndex + offset + content.length) % content.length);
    }
    return indices;
  };

  const visibleIndices = getVisibleIndices();

  return (
    <div
      ref={containerRef}
      className="relative w-full py-12 px-4 md:px-8"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setIsHovering(false)}
    >
      {/* Main Carousel Grid */}
      <div className="relative h-[450px] md:h-[600px] mb-8 rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="relative w-full h-full bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-black/40 rounded-xl overflow-hidden">
              {/* Image */}
              <div className="absolute inset-0">
                {content[activeIndex].content}
              </div>

              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="font-zentry text-2xl md:text-3xl font-black uppercase text-white mb-2">
                    {content[activeIndex].title}
                  </h3>
                  <p className="font-general text-sm md:text-base text-white/80 line-clamp-2">
                    {content[activeIndex].description}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail Grid */}
      <div className="flex justify-center gap-3 md:gap-4 mb-8">
        {visibleIndices.map((idx) => {
          const isActive = idx === activeIndex;
          return (
            <motion.button
              key={idx}
              onClick={() => handleDotClick(idx)}
              initial={{ scale: isActive ? 1 : 0.8 }}
              animate={{
                scale: isActive ? 1 : 0.8,
                opacity: isActive ? 1 : 0.6,
              }}
              whileHover={{ scale: 0.9 }}
              className={clsx(
                "relative rounded-lg overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                isActive
                  ? "ring-2 ring-blue-400 scale-100"
                  : "hover:ring-1 hover:ring-white/30"
              )}
              style={{
                width: isActive ? "120px" : "80px",
                height: "80px",
              }}
            >
              <div className="w-full h-full bg-white/5 rounded-lg overflow-hidden">
                {content[idx].content}
              </div>
              {isActive && (
                <motion.div
                  className="absolute inset-0 border-2 border-blue-400 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center items-center gap-6 md:gap-8 mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          className="relative group p-3 rounded-full bg-white/10 hover:bg-blue-500/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Previous photo"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        <div className="text-white/60 font-general text-sm md:text-base">
          <span className="font-bold text-white">{activeIndex + 1}</span> / {content.length}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="relative group p-3 rounded-full bg-white/10 hover:bg-blue-500/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Next photo"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>

      {/* Progress Bar Indicators */}
      <div className="flex justify-center gap-2 px-4">
        {content.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => handleDotClick(i)}
            className="relative h-1 rounded-full overflow-hidden bg-white/20 focus:outline-none transition-all duration-300"
            initial={{ width: i === activeIndex ? 48 : 24 }}
            animate={{ width: i === activeIndex ? 48 : 24 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.3)" }}
            aria-label={`Go to photo ${i + 1}`}
          >
            {i === activeIndex && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovering ? 0 : 1 }}
                transition={
                  isHovering
                    ? { duration: 0 }
                    : { duration: 4, ease: "linear" }
                }
                style={{ transformOrigin: "left" }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
