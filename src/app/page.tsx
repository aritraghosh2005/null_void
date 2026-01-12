"use client";
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import PinCard from '../components/PinCard';

export default function Board() {
  const { pins, addPin } = useStore();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY });
  };

  return (
    <main 
      onMouseMove={handleMouseMove}
      onDoubleClick={(e) => addPin('text', e.clientX, e.clientY)}
      className="w-screen h-screen bg-[#050505] relative overflow-hidden text-white"
    >
      {/* Parallax Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
  // cx/cy = center position (20 is middle of 40)
  // r = radius (2px radius = 4px wide dot). Change 'r' to resize.
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%23555'/%3E%3C/svg%3E")`,
          transform: `translate(${mouse.x / 60}px, ${mouse.y / 60}px)`,
      }}
      />

      {/* Title & UI Layer - Z-Index 100 ensures it stays on top */}
      <div className="absolute top-12 left-12 pointer-events-none z-[100] select-none">
        
        {/* Main Logo: Gradient Text + Glow */}
        <h1 className="font-mono text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
          Null Void
        </h1>

        {/* Status Line: Blinking Dot + Monospace Tech Text */}
        <div className="flex items-center gap-3 mt-2 pl-1 opacity-70">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]" />
          <p className="font-mono text-xs text-emerald-400/80 tracking-widest uppercase">
            System Online // Double-click to Initialize
          </p>
        </div>
        
      </div>

      {/* Render All Pins */}
      {pins.map((pin) => (
        <PinCard key={pin.id} pin={pin} />
      ))}
    </main>
  );
}