"use client";
import React, { useEffect, useRef } from 'react';

export default function MouseTrail() {
  // INCREASED: 100 points ensures high density so no gaps appear at speed
  const TRAIL_LENGTH = 100; 
  
  const pointsRef = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 }))
  );
  const mouseRef = useRef({ x: 0, y: 0 });
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Tracks the "active" state of the cursor (0 = stopped, 1 = moving)
  const activityRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const points = pointsRef.current;
      const mouse = mouseRef.current;

      // --- 1. DETECT MOTION (Smoothed) ---
      // Calculate how far the head is from the mouse (lag distance)
      const dist = Math.hypot(mouse.x - points[0].x, mouse.y - points[0].y);
      
      // If distance is significant (> 1px), we want full size (1). Otherwise vanish (0).
      const targetScale = dist > 1 ? 1 : 0;
      
      // SMOOTHING MAGIC:
      // Controls the speed of fading out (Lower = slower/smoother fade)
      activityRef.current += (targetScale - activityRef.current) * 0.02;

      // --- 2. PHYSICS ---
      // Head: Follows mouse with some drag
      points[0].x += (mouse.x - points[0].x) * 0.6;
      points[0].y += (mouse.y - points[0].y) * 0.6;

      // Body: Spring Chain
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        const leader = points[i - 1];
        const follower = points[i];
        
        // TIGHTER SPRING: Increased from 0.35 to 0.45 
        // This ensures followers stick closer to leaders at high speed
        follower.x += (leader.x - follower.x) * 0.45;
        follower.y += (leader.y - follower.y) * 0.45;
      }

      // --- 3. RENDER ---
      dotsRef.current.forEach((dot, index) => {
        if (!dot) return;
        const p = points[index];
        
        // Taper the tail naturally
        const baseScale = 1 - (index / TRAIL_LENGTH) * 0.9; 
        
        // Apply the smooth shrinking effect
        const finalScale = baseScale * activityRef.current;
        
        // Prevent rendering tiny sub-pixel artifacts
        if (finalScale < 0.001) {
             dot.style.transform = `scale(0)`; 
        } else {
             dot.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${finalScale})`;
        }
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ filter: 'blur(5px) contrast(40)' }}
    >
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { dotsRef.current[i] = el; }}
          className="absolute top-0 left-0 bg-white rounded-full translate-x-[-50%] translate-y-[-50%]"
          style={{
            width: '130px', // Slightly smaller base size for higher density
            height: '130px',
            willChange: 'transform',
            // Fade out the tail opacity slightly for depth
            opacity: 1 - (i / TRAIL_LENGTH) * 0.8, 
          }}
        />
      ))}
    </div>
  );
}