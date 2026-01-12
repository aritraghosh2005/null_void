"use client";
import React, { useEffect, useRef } from 'react';

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<{ x: number; y: number; age: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const addPoint = (e: MouseEvent) => {
      points.current.push({ x: e.clientX, y: e.clientY, age: 0 });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw points
      points.current.forEach((p, i) => {
        p.age += 1;
        const opacity = 1 - p.age / 40; // Trail lasts for 40 frames
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Remove old points
      points.current = points.current.filter(p => p.age < 40);
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', addPoint);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', addPoint);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0" 
    />
  );
}