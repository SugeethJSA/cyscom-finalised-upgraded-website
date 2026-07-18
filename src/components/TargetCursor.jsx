import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TargetCursor = ({ targetSelector = '.cursor-target, a, button, .nav-hover-btn' }) => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices for performance
    if (window.innerWidth < 768) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';

    // Track mouse position
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Smooth trailing position (lerped)
    let currentX = mouseX;
    let currentY = mouseY;
    
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let activeTarget = null;
    let targetRect = null;

    const handleMouseOver = (e) => {
      const target = e.target.closest(targetSelector);
      if (target && target !== activeTarget) {
        activeTarget = target;
        // Cache the bounding rect once on enter.
        // This is the core fix to prevent layout thrashing!
        targetRect = target.getBoundingClientRect();
        
        const corners = cursor.querySelectorAll('.target-cursor-corner');
        const pad = 4;
        
        gsap.killTweensOf(corners);
        gsap.killTweensOf(cursor);
        
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;
        
        // Snap cursor center to target center
        gsap.to(cursor, {
          x: targetCenterX,
          y: targetCenterY,
          duration: 0.2,
          overwrite: 'auto',
          ease: 'power2.out'
        });
        
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
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });

    // Smooth position updates using LERP in requestAnimationFrame loop
    let rAF;
    const updatePosition = () => {
      if (!activeTarget) {
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;
        
        gsap.set(cursor, {
          x: currentX,
          y: currentY
        });
      } else {
        // Maintain centering on locked target
        currentX = mouseX;
        currentY = mouseY;
      }
      rAF = requestAnimationFrame(updatePosition);
    };
    rAF = requestAnimationFrame(updatePosition);

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
      cancelAnimationFrame(rAF);
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
