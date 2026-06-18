"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";

export const StickyScroll = ({
  content,
  contentClassName,
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const backgroundColors = useMemo(() => [
    "#172554", // blue-950
    "#1e1b4b", // indigo-950
    "#0c4a6e", // sky-950
    "#052e16", // green-950
    "#1c1917", // stone-950
    "#0f172a", // slate-950
  ], []);

  const linearGradients = useMemo(() => [
    "linear-gradient(to bottom right, #06b6d4, #10b981)",
    "linear-gradient(to bottom right, #ec4899, #6366f1)",
    "linear-gradient(to bottom right, #f97316, #eab308)",
    "linear-gradient(to bottom right, #3b82f6, #8b5cf6)",
    "linear-gradient(to bottom right, #14b8a6, #06b6d4)",
    "linear-gradient(to bottom right, #f43f5e, #fb923c)",
  ], []);

  // Auto-advance timer
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveCard(prev => (prev + 1) % content.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovering, content.length]);

  const backgroundGradient = linearGradients[activeCard % linearGradients.length];
  const bgColor = backgroundColors[activeCard % backgroundColors.length];

  return (
    <motion.div
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="relative flex h-[30rem] justify-center space-x-10 lg:space-x-20 rounded-md p-5"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setIsHovering(false)}
    >
      {/* Left: text content */}
      <div className="relative flex items-center">
        <div className="max-w-xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
            >
              <h2 className="font-zentry text-4xl md:text-5xl font-black uppercase leading-tight text-white special-font">
                {content[activeCard].title}
              </h2>
              <p className="mt-6 max-w-lg font-general text-sm md:text-base text-white/75 leading-relaxed">
                {content[activeCard].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar indicators */}
          <div className="flex gap-2 mt-8 items-center">
            {content.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCard(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative h-[3px] rounded-full overflow-hidden bg-white/20 transition-all duration-500 focus:outline-none"
                style={{ width: i === activeCard ? 56 : 16 }}
              >
                {i === activeCard && (
                  <motion.div
                    key={`progress-${activeCard}-${isHovering}`}
                    className="absolute inset-0 bg-white rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovering ? 0 : 1 }}
                    transition={
                      isHovering
                        ? { duration: 0 }
                        : { duration: 3, ease: "linear" }
                    }
                    style={{ transformOrigin: "left" }}
                  />
                )}
              </button>
            ))}
          </div>
          {isHovering && (
            <p className="mt-2 font-general text-[10px] uppercase tracking-widest text-white/30">
              paused — move mouse away to resume
            </p>
          )}
        </div>
      </div>

      {/* Right: image / content panel */}
      <div
        className={clsx(
          "sticky top-20 hidden h-60 w-96 overflow-hidden rounded-xl lg:flex items-center justify-center flex-shrink-0",
          contentClassName
        )}
        style={{ background: backgroundGradient, transition: "background 0.8s ease" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {content[activeCard].content ?? null}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};