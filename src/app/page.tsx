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
          backgroundImage: `radial-gradient(circle, #222 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: `translate(${mouse.x / 60}px, ${mouse.y / 60}px)`, // The Parallax effect
        }}
      />

      {/* Title */}
      <div className="absolute top-8 left-10 pointer-events-none">
        <h1 className="text-2xl font-light tracking-widest opacity-50">null_void</h1>
        <p className="text-xs text-slate-500">Double-click to create</p>
      </div>

      {/* Render All Pins */}
      {pins.map((pin) => (
        <PinCard key={pin.id} pin={pin} />
      ))}
    </main>
  );
}