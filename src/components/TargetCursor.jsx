import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TargetCursor = ({ targetSelector = '.cursor-target, a, button, .nav-hover-btn' }) => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices or low-end devices for performance
    const isTouchDevice = window.matchMedia("(any-pointer: coarse)").matches;
    const isLowEndDevice = navigator.hardwareConcurrency <= 4 || (navigator.deviceMemory && navigator.deviceMemory <= 4);
    
    if (window.innerWidth < 768 || isTouchDevice || isLowEndDevice) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';
    
    // Use GSAP quickTo for highly optimized performance instead of a manual rAF loop
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });

    let activeTarget = null;
    let targetRect = null;
    
    const handleMouseMove = (e) => {
      if (!activeTarget) {
        xTo(e.clientX);
        yTo(e.clientY);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleMouseOver = (e) => {
      const target = e.target.closest(targetSelector);
      if (target && target !== activeTarget) {
        activeTarget = target;
        // Cache the bounding rect once on enter
        targetRect = target.getBoundingClientRect();
        
        const corners = cursor.querySelectorAll('.target-cursor-corner');
        const pad = 4;
        
        gsap.killTweensOf(corners);
        
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;
        
        // Snap cursor center to target center using quickTo
        xTo(targetCenterX);
        yTo(targetCenterY);
        
        // Expand corners around target bounding box
        const halfW = targetRect.width / 2 + pad;
        const halfH = targetRect.height / 2 + pad;
        
        const [tlc, trc, brc, blc] = corners;
        
        gsap.to(tlc, { x: -halfW, y: -halfH, duration: 0.2, overwrite: 'auto' });
        gsap.to(trc, { x: halfW - 12, y: -halfH, duration: 0.2, overwrite: 'auto' });
        gsap.to(brc, { x: halfW - 12, y: halfH - 12, duration: 0.2, overwrite: 'auto' });
        gsap.to(blc, { x: -halfW, y: halfH - 12, duration: 0.2, overwrite: 'auto' });
        
        cursor.classList.add('is-locked');
      }
    };

    const handleMouseOut = (e) => {
      if (activeTarget && !e.target.closest(targetSelector)) {
        activeTarget = null;
        targetRect = null;
        
        const corners = cursor.querySelectorAll('.target-cursor-corner');
        gsap.killTweensOf(corners);
        
        const [tlc, trc, brc, blc] = corners;
        const size = 12;
        
        gsap.to(tlc, { x: -size * 1.5, y: -size * 1.5, duration: 0.3, ease: 'power3.out' });
        gsap.to(trc, { x: size * 0.5, y: -size * 1.5, duration: 0.3, ease: 'power3.out' });
        gsap.to(brc, { x: size * 0.5, y: size * 0.5, duration: 0.3, ease: 'power3.out' });
        gsap.to(blc, { x: -size * 1.5, y: size * 0.5, duration: 0.3, ease: 'power3.out' });
        
        cursor.classList.remove('is-locked');
        
        // Snap back to current mouse position
        xTo(e.clientX);
        yTo(e.clientY);
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });

    const handleMouseDown = () => {
      gsap.to(dotRef.current, { scale: 0.6, duration: 0.2 });
      gsap.to(cursor, { scale: 0.95, duration: 0.2 });
    };

    const handleMouseUp = () => {
      gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = originalCursor;
    };
  }, [targetSelector]);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{ willChange: 'transform' }}
    >
      {/* Center dot */}
      <div
        ref={dotRef}
        className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      />
      {/* Target Corners Wrapper */}
      <div className="cursor-spin-wrapper absolute w-0 h-0 will-change-transform">
        <div
          className="target-cursor-corner absolute w-3 h-3 border-[3px] border-white transform -translate-x-[150%] -translate-y-[150%] border-r-0 border-b-0"
          style={{ willChange: 'transform' }}
        />
        <div
          className="target-cursor-corner absolute w-3 h-3 border-[3px] border-white transform translate-x-[50%] -translate-y-[150%] border-l-0 border-b-0"
          style={{ willChange: 'transform' }}
        />
        <div
          className="target-cursor-corner absolute w-3 h-3 border-[3px] border-white transform translate-x-[50%] translate-y-[50%] border-l-0 border-t-0"
          style={{ willChange: 'transform' }}
        />
        <div
          className="target-cursor-corner absolute w-3 h-3 border-[3px] border-white transform -translate-x-[150%] translate-y-[50%] border-r-0 border-t-0"
          style={{ willChange: 'transform' }}
        />
      </div>
    </div>
  );
};

export default TargetCursor;
